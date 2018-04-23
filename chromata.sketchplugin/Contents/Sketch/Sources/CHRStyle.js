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


class CHRStyle {
  constructor(style) {
    this.style = style
  }

  getColors() {
    var colors = []

    colors = colors.concat(this.getBorderColors())
    colors = colors.concat(this.getFillColors())

    return colors
  }

  getBorderColors() {
    var colors = []

    var borders = this.style.borders()
    for (var i = 0; i < borders.count(); i++) {
      var border = borders[0]
      var borderColors = border.isEnabled() ? [border.color()] : []
      colors = colors.concat(borderColors)
    }

    return colors
  }

  getFillColors() {
    var colors = []

    var fills = this.style.fills()
    for (var i = 0; i < fills.count(); i++) {
      var fill = fills[i]

      var fillType = fill.fillType()
      switch(fillType) {
        case 0: // Solid Color
          var fillColors = fill.isEnabled() ? [fill.color()] : []
          colors = colors.concat(fillColors)
          break
        case 1: // Gradient
          var gradientColors = this.getGradientColors(fill.gradient())
          colors = colors.concat(gradientColors)
          break
        default:
          // TODO: Better error handling
          alert("Error: Unknown fill type", fillType);
          throw -1;
      }
    }

    return colors
  }

  getGradientColors(gradient) {
    var colors = []

    var gradientStops = gradient.stops()
    for (var i = 0; i < gradientStops; i++) {
      colors = colors.concat(gradientStop.color())
    }

    return colors
  }
}
