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
 * Class representing a parser around MSStyle
 * @class
 */
function CHRStyleParser() {}

/**
 * Get style's colors
 * @param {MSStyle} style
 *
 * @return {Array.<MSColor>}
 */
CHRStyleParser.getColors = (function() {
  @import 'Sources/Utilities/CHRErrorHandler.js'

  /**
   * Get borders colors
   * @param {Array.<MSStyleBorder>} borders
   *
   * @return {Array.<MSColor>}
   */
  function getBordersColors(borders) {
    var colors = []

    for (let i = 0; i < borders.length; i++) {
      var borderColor = borders[i].color()
      colors.push(borderColor)
    }

    return colors
  }

  /**
   * Get fills colors
   * @param {Array.<MSStyleFill>} fills
   *
   * @return {Array.<MSColor>}
   */
  function getFillsColors(fills) {
    var colors = []

    for (let i = 0; i < fills.length; i++) {
      var fill = fills[i]

      var fillType = fill.fillType()
      switch(fillType) {
        case 0: // Solid Color
          var fillColor = fill.color()
          colors.push(fillColor)
          break
        case 1: // Gradient
          var gradientColors = getGradientColors(fill.gradient())
          colors = colors.concat(gradientColors)
          break
        default:
          var errorMessage = 'Warning. Unknown fill type: ' + fillType + '.'
          raiseWarningError(errorMessage)
      }
    }

    return colors
  }

  /**
   * Get a gradient's colors
   * @param {MSGradient} gradient
   *
   * @return {Array.<MSColor>}
   */
  function getGradientColors(gradient) {
    var colors = []

    var gradientStops = gradient.stops()
    for (let i = 0; i < gradientStops.length; i++) {
      colors = colors.concat(gradientStops[i].color())
    }

    return colors
  }

  return function(style) {
    var colors = []

    colors = colors.concat(getBordersColors(style.enabledBorders()))
    colors = colors.concat(getFillsColors(style.enabledFills()))

    return colors
  }
})()
