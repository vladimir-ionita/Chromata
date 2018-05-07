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
        pubDate Time.now.strftime('%a, %-d %b %Y %-k:%M:%S %z')
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

class ScriptOptions
  attr_accessor :bump_version, :release, :changelog

  def initialize
    @bump_version = nil
    @release = false
    @changelog = nil
  end

  def define_banner(parser)
    parser.banner = "Usage: bump-version.rb [options]"
    parser.separator ""
  end

  def define_options(parser)
    add_bump_option(parser)
    add_release_option(parser)
    add_changelog_option(parser)
    add_help_option(parser)
    add_version_option(parser)
  end

  private
  def add_bump_option(parser)
    parser.on("--bump [STRING]", "Specifiy the version to bump to") do |bump_version|
      version_regexp = /^(\d+\.)?(\d+\.)?(\d+)$/
      if bump_version.match(version_regexp).to_s == bump_version
        @bump_version = bump_version
      else
        parser.abort "Version should match the following format: x.y.z"
      end
    end
  end

  private
  def add_release_option(parser)
    parser.on("--release", "Make this version a release") do |release|
      @release = true
    end
  end

  private
  def add_changelog_option(parser)
    parser.on("--changelog 'x','y','z'", "Specify the changelog for the release") do |changelog|
      @changelog = changelog
    end
  end

  private
  def add_help_option(parser)
    parser.on_tail("-h", "--help", "Show this message") do
      puts parser
      exit
    end
  end

  private
  def add_version_option(parser)
    parser.on_tail("--version", "Show version") do
        puts Version
        exit
      end
  end
end

################################################################################

class ScriptOptionsParser
  def parse(args)
    require 'optparse'

    @options = ScriptOptions.new
    OptionParser.new do |parser|
      @options.define_banner(parser)
      @options.define_options(parser)
      parser.parse!(args)
    end

    return @options
  end
end

################################################################################

# TODO: create a changelog builder
# TODO: check for release option and only then release on app cast

Version = "0.2.0"
puts 'Chromata version bumper v%s' % [Version]
puts

optionsParser = ScriptOptionsParser.new
options = optionsParser.parse(ARGV)

if options.bump_version.nil?
  puts "No bump version specified."
  puts "Usage: bump-version.rb --bump <version_number>"
else
  puts 'Bump version to ' + options.bump_version

  manifest_file_path = FileHelper.absolute_file_path('chromata.sketchplugin/Contents/Sketch/manifest.json')
  ManifestFileVersionBumper.new(manifest_file_path).bump(version)
  puts "  Manifest version bump.. Done" #check if true first

  readme_file_path = FileHelper.absolute_file_path('README.md')
  ReadmeFileVersionBumper.new(readme_file_path).bump(version)
  puts "  Readme version bump.. Done" #check if true first
end

# appcast_file_path = FileHelper.absolute_file_path('.appcast.xml')
# AppcastFileVersionBumper.new(appcast_file_path).add_release(version, 'changelog-test')
# puts "  Appcast version bumped.. Done" #check if true first
