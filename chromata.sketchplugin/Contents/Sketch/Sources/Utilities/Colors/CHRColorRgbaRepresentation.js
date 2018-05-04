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


/** Class representing a rgba representation (a simple dictionary) */
function CHRColorRgbaRepresentation(r, g, b, a) {
  this.r = r
  this.g = g
  this.b = b
  this.a = a
}

/**
 * Create rgba representation from rgba description
 * @param {string} rgbaDescription
 * @return {CHRColorRgbaRepresentation|null}
 */
CHRColorRgbaRepresentation.createFromRgbaDescription = function(rgbaDescription) {
  var rgbaDescriptionValues = rgbaDescription.substring(rgbaDescription.indexOf('(') + 1, rgbaDescription.indexOf(')'))
  var rgbaValues = rgbaDescriptionValues.split(',')
  if (rgbaValues.length < 4) {
    return null
  }

  var r = rgbaValues[0]
  var g = rgbaValues[1]
  var b = rgbaValues[2]
  var a = rgbaValues[3]
  if (r == null || g == null || b == null || a == null) {
    return null
  }

  return new CHRColorRgbaRepresentation(r, g, b, a)
}
