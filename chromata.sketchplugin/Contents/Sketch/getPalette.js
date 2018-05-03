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


@import 'Sources/CHRLayer.js'
@import 'Sources/Utilities/CHRUserDefaults.js'

var palette = []

var onRun = function(context) {
  var palette = []

  var selectedLayers = context.selection

  if (selectedLayers.length == 0) {
    var message = "You haven't selected any layers."
    context.document.showMessage(message)

    return
  }

  for (var i = 0; i < selectedLayers.length; i++) {
    var layer = selectedLayers[i]
    var colorsForLayer = new CHRLayer(layer).getLayerColorsMappingsForLayer()

    for (var j = 0; j < colorsForLayer.length; j++) {
      var dictionary = colorsForLayer[j]
      var colors = dictionary['colors']

      palette = palette.concat(colors)
    }
  }

  if (palette.length > 0) {
    savePalette(palette)
    var message = 'Palette saved. You got ' + palette.length + ' colors in your palette.'
    context.document.showMessage(message)
  } else {
    var message = "Palette saved. No colors."
    context.document.showMessage(message)
  }
}

function savePalette(palette) {
  paletteRgb = palette.map(color => {
    return color.RGBADictionary()
  })

  CHRUserDefaults.saveValueForKey(paletteRgb, 'palette')
}
