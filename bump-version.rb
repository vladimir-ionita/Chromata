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

def create_item_node(title, changelog, url, version)
  require 'nokogiri'

  builder = Nokogiri::XML::Builder.new do
    item {
      title title
      description
      enclosure('url' => url, 'sparkle:version' => version)
    }
  end

  builder.doc.xpath('//description').first << builder.doc.create_cdata(changelog)

  return builder.doc.at('//item')
end

def bump_version_appcast(version, changelog)
  require 'nokogiri'

  appcast_relative_file_path = '.appcast.xml'
  appcast_file_path = File.join(File.dirname(__FILE__), appcast_relative_file_path)

  file = File.read(appcast_file_path)
  xml = Nokogiri::XML(file) do |config|
    config.default_xml.noblanks
  end

  channel_node = xml.xpath('//channel').first
  new_item_node = create_item_node(
    'Version ' + version,
    changelog,
    "https://github.com/abnamrocoesd/Chromata/releases/download/#{version}/chromata.sketchplugin.zip",
    version
  )
  channel_node << new_item_node

  File.open(appcast_file_path, "w") do |f|
    f.write(xml.to_xml(:indent => 2))
  end
end

def bump_version_readme(version)
  readme_relative_file_path = "README.md"
  readme_file_path = File.join(File.dirname(__FILE__), readme_relative_file_path)

  url_regexp = /https:(.*).svg/
  new_version_url = "https://img.shields.io/badge/Version-#{version}-green.svg"

  text = File.read(readme_file_path)
  new_contents = text.sub(url_regexp, new_version_url)
  File.open(readme_file_path, "w") { |file| file.puts new_contents }
end


puts "Chromata version bumper v0.1.0"

version = ARGV[0]
if version.nil?
  puts "usage: ruby bump-version.rb <version_number>"
  exit 1
end

puts "Version bump to " + version
