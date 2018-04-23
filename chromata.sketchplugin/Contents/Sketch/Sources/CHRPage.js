/*
  Chromata - Sketch plugin to find and fix layers that have colors
  outside of your palette.
  Copyright (C) 2018  Vladimir Ionita
*/


@import 'Sources/CHRLayer.js'

class CHRPage {
  constructor(page) {
    this.page = page
  }

  getColorsForPage() {
    var colorsForAllLayers = []

    var layers = this.page.layers()
    for (var i = 0; i < layers.count(); i++) {
      var layer = layers[i]
      var colorsForLayer = new CHRLayer(layer).getColorsForLayer()

      colorsForAllLayers = colorsForAllLayers.concat(colorsForLayer)
    }

    return colorsForAllLayers
  }
}
