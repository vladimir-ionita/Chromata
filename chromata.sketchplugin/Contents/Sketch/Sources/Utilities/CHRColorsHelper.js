/*
  Chromata - A sketch plugin to find and fix layers that have colors
  outside of your palette.
  Copyright (C) 2018  Vladimir Ionita

  This file is part of Chromata.

  Chromata is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Chromata is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


/**
 * Check if a string is a hex representation of a color
 * @param {string} colorRepresentation
 * @return {boolean}
 */
function isHexRepresentationOfAColor(colorRepresentation) {
  return colorRepresentation.indexOf('#') >= 0
}

/**
 * Check if a string is a rgba description of a color
 * @param {string} colorDescription
 * @return {boolean}
 */
function isRgbaDescriptionOfAColor(colorDescription) {
  return colorDescription.indexOf('rgba') >= 0
}


function hexStringToColor(hexString) {
  var rgbColor = hexToRgb(hexString)
  return MSColor.rgbColorRed_green_blue(rgbColor.r, rgbColor.g, rgbColor.b)
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function rgbaStringToRgb(rgbaString) {
  var rgbaValuesString = rgbaString.substring(rgbaString.indexOf('(') + 1, rgbaString.indexOf(')'))
  var rgbaValues = rgbaValuesString.split(',')

  return {
    r: rgbaValues[0],
    g: rgbaValues[1],
    b: rgbaValues[2],
    a: rgbaValues[3]
  }
}

function rgbaStringToColor(rgbaString) {
  var rgb = rgbaStringToRgb(rgbaString)
  return rgbToColor(rgb)
}

function rgbToColor(rgb) {
  return MSColor.rgbColorRed_green_blue(rgb.r, rgb.g, rgb.b).colorWithAlphaComponent(rgb.a)
}
