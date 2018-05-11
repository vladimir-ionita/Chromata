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


/** Class representing a wrapper around MSStyle
 * @class
 *
 * @constructor
 *
 * @property {MSStyle} style
 */
function CHRStyle(style) {
  this.style = style
  var that = this

  /**
   * Get style's colors
   * @return {Array.<MSColor>}
   */
  this.getColors = function() {
    var colors = []

    colors = colors.concat(getBorderColors())
    colors = colors.concat(getFillColors())

    return colors
  }

  /**
   * Get style's border colors
   * @return {Array.<MSColor>}
   */
  var getBorderColors = function() {
    var colors = []

    var borders = that.style.borders()
    for (var i = 0; i < borders.length; i++) {
      var border = borders[0]
      var borderColors = border.isEnabled() ? [border.color()] : []
      colors = colors.concat(borderColors)
    }

    return colors
  }

  /**
   * Get style's fill colors
   * @return {Array.<MSColor>}
   */
  var getFillColors = function() {
    var colors = []

    var fills = that.style.fills()
    for (var i = 0; i < fills.length; i++) {
      var fill = fills[i]

      var fillType = fill.fillType()
      switch(fillType) {
        case 0: // Solid Color
          var fillColors = fill.isEnabled() ? [fill.color()] : []
          colors = colors.concat(fillColors)
          break
        case 1: // Gradient
          var gradientColors = getGradientColors(fill.gradient())
          colors = colors.concat(gradientColors)
          break
        default:
          // TODO: Better error handling
          alert("Error: Unknown fill type", fillType)
          throw -1
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
  var getGradientColors = function(gradient) {
    var colors = []

    var gradientStops = gradient.stops()
    for (let i = 0; i < gradientStops.length; i++) {
      colors = colors.concat(gradientStops[i].color())
    }

    return colors
  }
}
