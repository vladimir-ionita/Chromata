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


@import 'Sources/CHRDocument.js'
@import 'Core/CHRPalette.js'

var onRun = function(context) {
  var palette = CHRPalette.loadPalette()
  if (palette.length == 0) {
    context.document.showMessage('You have no colors in your palette.')
    return
  }

  var layerColorsDictionaries = new CHRDocument(context.document).getLayerColorsMappingForDocument()
  var rogueLayer = getNextRogueLayer(layerColorsDictionaries, palette)
  if (typeof rogueLayer != 'undefined') {
    context.document.setCurrentPage(rogueLayer.parentPage())
    context.document.currentPage().changeSelectionBySelectingLayers([])
    rogueLayer.select_byExpandingSelection(true, true)
  } else {
    context.document.showMessage("You're all set. Your colors match your palette!")
  }
}

/**
 * Get next rogue layer
 * A rogue layers is a layer that has its colors outside of the palette
 * @param {Array.<CHRLayerColorsMapping>} layerMappings
 * @param {Array.<MSColor>} palette
 * @return {MSLayer}
 */
function getNextRogueLayer(layerMappings, palette) {
  for (var i = 0; i < layerMappings.length; i++) {
    var mapping = layerMappings[i]

    var layerColors = mapping.colors
    for (var j = 0; j < layerColors.length; j++) {
      if (!isColorInPalette(layerColors[j], palette)) {
        return mapping.layer
      }
    }
  }
}

function isColorInPalette(color, palette) {
  for (var i = 0; i < palette.length; i++) {
    if (color.fuzzyIsEqual_precision(palette[i], 0.9/255)) {
      return true
    }
  }

  return false
}
