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


@import 'Core/CHRErrorHandler.js'

/**
 * Class representing a parser around MSStyle
 */
function CHRStyleParser() {}

/**
 * Get style's colors
 *
 * @param {MSStyle} style
 *
 * @return {Array.<MSColor>}
 */
CHRStyleParser.getColors = (function() {
    /**
     * Get style's colors
     *
     * @param {MSStyle} style
     *
     * @return {Array.<MSColor>}
     */
    function getColors(style) {
        let colors = []

        colors = colors.concat(getBordersColors(style.enabledBorders()))
        colors = colors.concat(getFillsColors(style.enabledFills()))
        colors = colors.concat(getShadowsColors(style.enabledShadows()))
        colors = colors.concat(getInnerShadowsColors(style.enabledInnerShadows()))

        return colors
    }

    /**
     * Get borders colors
     *
     * @param {Array.<MSStyleBorder>} borders
     *
     * @return {Array.<MSColor>}
     */
    function getBordersColors(borders) {
        let colors = []

        for (let i = 0; i < borders.length; i++) {
            let borderColor = borders[i].color()
            colors.push(borderColor)
        }

        return colors
    }

    /**
     * Get fills colors
     *
     * @param {Array.<MSStyleFill>} fills
     *
     * @return {Array.<MSColor>}
     */
    function getFillsColors(fills) {
        let colors = []

        for (let i = 0; i < fills.length; i++) {
            let fill = fills[i]

            let fillType = fill.fillType()
            switch(fillType) {
                case 0: // Solid Color
                    let fillColor = fill.color()
                    colors.push(fillColor)
                    break
                case 1: // Gradient
                    let gradientColors = getGradientColors(fill.gradient())
                    colors = colors.concat(gradientColors)
                    break
                default:
                    let errorMessage = 'Warning. Unknown fill type: ' + fillType + '.'
                    raiseWarningError(errorMessage)
            }
        }

        return colors
    }

    /**
     * Get a gradient's colors
     *
     * @param {MSGradient} gradient
     *
     * @return {Array.<MSColor>}
     */
    function getGradientColors(gradient) {
        let colors = []

        let gradientStops = gradient.stops()
        for (let i = 0; i < gradientStops.length; i++) {
            colors = colors.concat(gradientStops[i].color())
        }

        return colors
    }

    /**
     * Get shadows colors
     *
     * @param {Array.<MSStyleShadow>} shadows
     *
     * @return {Array.<MSColor>}
     */
    function getShadowsColors(shadows) {
        let colors = []

        for (let i = 0; i < shadows.length; i++) {
            let shadowColor = shadows[i].color()
            colors.push(shadowColor)
        }

        return colors
    }

    /**
     * Get inner shadows colors
     *
     * @param {Array.<MSStyleInnerShadow>} innerShadows
     *
     * @return {Array.<MSColor>}
     */
    function getInnerShadowsColors(innerShadows) {
        let colors = []

        for (let i = 0; i < innerShadows.length; i++) {
            let innerShadowColor = innerShadows[i].color()
            colors.push(innerShadowColor)
        }

        return colors
    }

    return getColors
})()
