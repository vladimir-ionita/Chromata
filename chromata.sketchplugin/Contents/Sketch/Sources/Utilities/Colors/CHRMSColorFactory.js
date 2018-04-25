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


@import 'Sources/Utilities/Colors/CHRColorRgbRepresentation.js'
@import 'Sources/Utilities/Colors/CHRColorRgbaRepresentation.js'

/** Class representing a MSColor factory*/
function CHRMSColorFactory() {}

/**
 * Create a color from hex representation
 * @param {string} hexRepresentation
 * @return {MSColor|null}
 */
CHRMSColorFactory.createFromHexRepresentation = function(hexRepresentation) {
  var rgbRepresentation = CHRColorRgbRepresentation.createFromHexRepresentation(hexRepresentation)
  if (rgbRepresentation == null) {
    return null
  }

  return MSColor.rgbColorRed_green_blue(
    rgbRepresentation.r,
    rgbRepresentation.g,
    rgbRepresentation.b
  )
}

/**
 * Create color from rgba representation
 * @param {CHRColorRgbaRepresentation}
 * @return {MSColor|null}
 */
CHRMSColorFactory.createFromRgbaRepresentation = function(rgbaRepresentation) {
  if (rgbaRepresentation == null) {
    return null
  }

  return MSColor.rgbColorRed_green_blue(
    rgbaRepresentation.r,
    rgbaRepresentation.g,
    rgbaRepresentation.b
  ).colorWithAlphaComponent(
    rgbaRepresentation.a
  )
}
