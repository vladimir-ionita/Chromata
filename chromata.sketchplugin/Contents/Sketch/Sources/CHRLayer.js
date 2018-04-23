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


@import 'Sources/CHRStyle.js'
@import 'Sources/Utilities/CHRColorsHelper.js'
@import 'Sources/Utilities/CHRArrayHelper.js'

class CHRLayer {
  constructor(layer) {
    this.layer = layer
  }

  getColorsForLayer() {
      var colors = []
      if (!this.layer.isVisible()) {
        return colors
      }

      var layerClass = this.layer.class()
      switch (layerClass) {
        case MSArtboardGroup:
          return colors.concat(this.getColorsFromNestedLayer(this.layer))
        case MSSymbolMaster:
          return colors.concat(this.getColorsFromNestedLayer(this.layer))
        case MSLayerGroup:
          return colors.concat(this.getColorsFromNestedLayer(this.layer))

        case MSTextLayer:
          return colors.concat(this.getColorsFromTextLayer(this.layer))
        case MSSliceLayer:
          return colors.concat(this.getColorsFromSliceLayer(this.layer))

        case MSShapeGroup:
          return colors.concat(this.getColorsFromBasicLayer(this.layer))
        case MSSymbolInstance:
          return colors.concat(this.getColorsFromBasicLayer(this.layer))
        case MSBitmapLayer:
          return colors.concat(this.getColorsFromBasicLayer(this.layer))

        case MSRectangleShape:
        case MSShapePathLayer:
        case MSOvalShape:
          return colors

        default:
          // TODO: Better error handling
          alert("Error: Unknown layer class", layerClass);
          throw -1;
      }
    }

    getColorsFromNestedLayer(nestedLayer) {
      var colors = this.getColorsFromBasicLayer(nestedLayer)

      var childrenLayers = nestedLayer.layers();
      for (var i = 0; i < childrenLayers.count(); i++) {
        var layer = childrenLayers[i]
        colors = colors.concat(new CHRLayer(layer).getColorsForLayer())
      }

      return colors
    }

    getColorsFromTextLayer(textLayer) {
      var colors = this.getColorsFromBasicLayer(textLayer)

      var stringAttributes = textLayer.attributedStringValue().treeAsDictionary()['attributes']
      for (var i = 0; i < stringAttributes.count(); i++) {
        var attribute = stringAttributes[i]
        var colorString = attribute['MSAttributedStringColorAttribute']['value']

        if (isColorHex(colorString)) {
          colors.push(hexStringToColor(colorString))
        } else if (isColorRGB(colorString)) {
          colors.push(rgbaStringToColor(colorString))
        }
      }

      return [{
        'layer': textLayer,
        'colors': colors
      }]
    }

    getColorsFromSliceLayer(sliceLayer) {
      var sliceLayerColors = sliceLayer.hasBackgroundColor() ? [sliceLayer.backgroundColor()] : []

      return len(sliceLayerColors) > 0 ? [{
        'layer': sliceLayer,
        'colors': sliceLayerColors
      }] : []
    }

    getColorsFromBasicLayer(layer) {
      var layerColors = new CHRStyle(layer.style()).getColors()

      return len(layerColors) > 0 ? [{
        'layer': layer,
        'colors': layerColors
      }] : []
    }
}
