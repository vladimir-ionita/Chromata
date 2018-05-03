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


@import 'Sources/Utilities/CHRUserDefaults.js'
@import 'Sources/CHRDocument.js'

var onRun = function(context) {
  var palette = loadPalette()
  if (palette.length == 0) {
    context.document.showMessage('You have no colors in your palette.')

    return
  }

  var layerColorsDictionaries = new CHRDocument(context.document).getLayerColorsMappingForDocument()
  var deviatedLayer = getNextDeviatedLayer(layerColorsDictionaries, palette)
  if (typeof deviatedLayer != 'undefined') {
    context.document.setCurrentPage(deviatedLayer.parentPage())
    context.document.currentPage().changeSelectionBySelectingLayers([])
    deviatedLayer.select_byExpandingSelection(true, true)
  } else {
    context.document.showMessage("You're all set. Your colors match your palette!")
  }
}

function loadPalette() {
  var rawPaletteRgb = CHRUserDefaults.fetchValueForKey('palette')

  var palette = []
  for (var i = 0; i < rawPaletteRgb.length; i++) {
    palette.push(MSColor.colorWithRGBADictionary(rawPaletteRgb[i]))
  }

  return palette
}

function getNextDeviatedLayer(layerColorsDictionaries, palette) {
  for (var i = 0; i < layerColorsDictionaries.length; i++) {
    var layerColors = layerColorsDictionaries[i]['colors']

    for (var j = 0; j < layerColors.length; j++) {
      if (!isColorInPalette(layerColors[j], palette)) {
        return layerColorsDictionaries[i]['layer']
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
