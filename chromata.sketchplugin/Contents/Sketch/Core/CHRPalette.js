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


@import 'Storage/CHRUserDefaults.js'

/** Class representing a palette */
function CHRPalette() { }

/**
 * Save the palette in user defaults
 * @param {Array.<MSColor>} palette
 */
CHRPalette.savePalette = function(palette) {
    var paletteRgba = palette.map(color => {
        return color.RGBADictionary()
    })

    CHRUserDefaults.saveValueForKey(paletteRgba, 'palette')
}

/**
 * Load the pallete from user defaults
 * Notes: Couldn't use the map function over the array. For some
 *  unknown reasons, it crashes Sketch
 * @return {Array.<MSColor>}
 */
CHRPalette.loadPalette = function() {
    var rawPaletteRgba = CHRUserDefaults.fetchValueForKey('palette')

    var palette = []
    for (var i = 0; i < rawPaletteRgba.length; i++) {
        palette.push(MSColor.colorWithRGBADictionary(rawPaletteRgba[i]))
    }

    return palette
}
