@import 'Sources/CHRLayer.js'
@import 'Sources/Utilities/CFXArrayHelper.js'
@import 'Sources/Utilities/CFXUserDefaults.js'

var palette = []

var onRun = function(context) {
  var palette = []

  var selectedLayers = context.selection

  if (selectedLayers.count() == 0) {
    var message = "You haven't selected any layers."
    context.document.showMessage(message)

    return
  }

  for (var i = 0; i < selectedLayers.count(); i++) {
    var layer = selectedLayers[i]
    var colorsForLayer = new CHRLayer(layer).getColorsForLayer()

    for (var j = 0; j < len(colorsForLayer); j++) {
      var dictionary = colorsForLayer[j]
      var colors = dictionary['colors']

      palette = palette.concat(colors)
    }
  }

  if (len(palette) > 0) {
    savePalette(palette)
    var message = 'Palette saved. You got ' + len(palette) + ' colors in your palette.'
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

  setValueForKey(paletteRgb, 'palette')
}
