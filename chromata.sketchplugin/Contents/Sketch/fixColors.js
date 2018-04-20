@import 'Sources/Utilities/CFXUserDefaults.js'
@import 'Sources/Utilities/CFXArrayHelper.js'
@import 'Sources/CHRDocument.js'

var onRun = function(context) {
  var palette = loadPalette()
  if (len(palette) == 0) {
    context.document.showMessage('You have no colors in your palette.')

    return
  }

  var layerColorsDictionaries = (new CHRDocument(context.document)).getColorsForDocument()
  var deviatedLayer = getNextDeviatedLayer(layerColorsDictionaries, palette)
  if (typeof deviatedLayer != 'undefined') {
    context.document.setCurrentPage(deviatedLayer.parentPage())
    context.document.currentPage().changeSelectionBySelectingLayers([])
    deviatedLayer.select_byExpandingSelection(true, true);
  } else {
    context.document.showMessage("You're all set. Your colors match your palette!")
  }
}

function loadPalette() {
  var rawPaletteRgb = getValueForKey('palette')

  var palette = []
  for (var i = 0; i < rawPaletteRgb.count(); i++) {
    palette.push(MSColor.colorWithRGBADictionary(rawPaletteRgb[i]))
  }

  return palette
}

function getNextDeviatedLayer(layerColorsDictionaries, palette) {
  for (var i = 0; i < len(layerColorsDictionaries); i++) {
    var layerColors = layerColorsDictionaries[i]['colors']

    for (var j = 0; j < len(layerColors); j++) {
      if (!isColorInPalette(layerColors[j], palette)) {
        return layerColorsDictionaries[i]['layer']
      }
    }
  }
}

function isColorInPalette(color, palette) {
  for (var i = 0; i < len(palette); i++) {
    if (color.fuzzyIsEqual_precision(palette[i], 0.9/255)) {
      return true
    }
  }

  return false
}
