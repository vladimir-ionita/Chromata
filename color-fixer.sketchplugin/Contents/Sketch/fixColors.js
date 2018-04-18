@import 'Sources/Utilities/CFXUserDefaults.js'
@import 'Sources/Utilities/CFXArrayHelper.js'

var onRun = function(context) {
  var palette = loadPalette()
  if (len(palette) == 0) {
    context.document.showMessage('You have no colors in your palette.')
  } else {
    context.document.showMessage('You have ' + len(palette) + ' colors in your palette.')
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
