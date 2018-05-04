##
# Chromata - A sketch plugin to find and fix layers that have colors
# outside of your palette.
# Copyright (C) 2018  Vladimir Ionita
#
# This file is part of Chromata.
#
# Chromata is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Chromata is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


################################################################################

class FileHelper
  def self.absolute_file_path(relative_file_path)
    return File.join(File.dirname(__FILE__), relative_file_path)
  end
end

################################################################################

class ManifestFileVersionBumper
  def initialize(file_path)
    @file_path = file_path
  end

  def bump(version)
    dictionary = get_json
    dictionary['version'] = version
    write_json(dictionary)
  end

  private
  def get_json
    require 'json'

    file = File.read(@file_path)
    return JSON.parse(file)
  end

  private
  def write_json(dictionary)
    require 'json'

    File.open(@file_path, 'w') do |file|
      file.write(JSON.pretty_generate(dictionary))
    end
  end
end

################################################################################

class AppcastFileVersionBumper
  def initialize(file_path)
    @file_path = file_path
  end

  def add_release(version, changelog=nil)
    require 'nokogiri'

    release_title = 'Version ' + version
    release_url = 'https://github.com/abnamrocoesd/Chromata/releases/download/v%s/chromata.sketchplugin.zip' % [version]
    release_node = create_release_node(
      release_title,
      release_url,
      version,
      changelog
    )

    xml = get_xml_content
    channel_node = get_channel_node(xml)
    channel_node << release_node
    write_xml(xml)
  end

  private
  def get_xml_content
    require 'nokogiri'

    file = File.read(@file_path)
    return Nokogiri::XML(file) do |config|
      config.default_xml.noblanks
    end
  end

  private
  def write_xml(xml)
    File.open(@file_path, 'w') do |file|
      file.write(xml.to_xml(:indent => 2))
    end
  end

  private
  def get_channel_node(xml)
    return xml.xpath('//channel').first
  end

  private
  def create_release_node(title, url, version, changelog=nil)
    require 'nokogiri'

    builder = Nokogiri::XML::Builder.new do
      item {
        title title
        description
        enclosure('url' => url, 'sparkle:version' => version)
      }
    end

    unless changelog.nil?
      changelog_cdata = builder.doc.create_cdata(changelog)
      builder.doc.xpath('//description').first << changelog_cdata
    end

    return builder.doc.at('//item')
  end
end

################################################################################

class ReadmeFileVersionBumper
  def initialize(file_path)
    @file_path = file_path
  end

  def bump(version)
    version_url_regexp = /https:(.*).svg/
    bumped_version_url = 'https://img.shields.io/badge/Version-%s-green.svg' % [version]

    text = get_text_content
    text = text.sub(version_url_regexp, bumped_version_url)
    write_text(text)
  end

  private
  def get_text_content
    return File.read(@file_path)
  end

  private
  def write_text(text)
    File.open(@file_path, 'w') do |file|
      file.puts text
    end
  end
end

################################################################################

# TODO: get args from command line (version and changelog)
# TODO: create a changelog builder
# TODO: check for release option and only then release on app cast

puts 'Chromata version bumper v0.1.0'

version = ARGV[0]
if version.nil?
  puts 'usage: ruby bump-version.rb <version_number>'
  exit 1
end

puts 'Bump version to ' + version

manifest_file_path = FileHelper.absolute_file_path('chromata.sketchplugin/Contents/Sketch/manifest.json')
ManifestFileVersionBumper.new(manifest_file_path).bump(version)
puts "  Manifest version bumped.. Done" #check if true first

readme_file_path = FileHelper.absolute_file_path('README.md')
ReadmeFileVersionBumper.new(readme_file_path).bump(version)
puts "  Readme version bumped.. Done" #check if true first

# appcast_file_path = FileHelper.absolute_file_path('.appcast.xml')
# AppcastFileVersionBumper.new(appcast_file_path).add_release(version, 'changelog-test')
# puts "  Appcast version bumped.. Done" #check if true first
