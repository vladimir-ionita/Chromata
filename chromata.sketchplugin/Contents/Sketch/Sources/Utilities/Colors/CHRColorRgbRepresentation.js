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


/** Class representing a rgb representation (a simple dictionary) */
function CHRColorRgbRepresentation(r, g, b) {
  this.r = r
  this.g = g
  this.b = b
}

/**
 * Create rgb representation from hex representation
 * @param {string} hexRepresentation
 * @return {CHRColorRgbRepresentation|null}
 */
CHRColorRgbRepresentation.createFromHexRepresentation = function(hexRepresentation) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexRepresentation)
  if (result == null) {
    return null
  }

  var r = parseInt(result[1], 16)
  var g = parseInt(result[2], 16)
  var b = parseInt(result[3], 16)
  if (r == null || g == null || b == null) {
    return null
  }

  return new CHRColorRgbRepresentation(r, g, b)
}
