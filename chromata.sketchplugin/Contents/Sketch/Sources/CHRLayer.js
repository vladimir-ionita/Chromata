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
@import 'Sources/CHRLayerColorsMapping.js'
@import 'Sources/Utilities/Colors/CHRColorsHelper.js'
@import 'Sources/Utilities/Colors/CHRMSColorFactory.js'

/** Class representing a wrapper around MSLayer */
class CHRLayer {
  /**
   * Create a CHRLayer from a MSLayer
   * @param {MSLayer} layer
   */
  constructor(layer) {
    this.layer = layer
  }

  /**
   * Get the mappings for a layer
   * @return {Array.<CHRLayerColorsMapping>}
   */
  getLayerColorsMappingsForLayer() {
    if (!this.layer.isVisible()) {
      return []
    }

    var layerClass = this.layer.class()
    switch (layerClass) {
      case MSArtboardGroup:
      case MSSymbolMaster:
      case MSLayerGroup:
        return this.getLayerColorsMappingsForANestedLayer(this.layer)

      case MSTextLayer:
        return [this.getLayerColorsMappingForALeafTextLayer(this.layer)]
      case MSSliceLayer:
        return [this.getLayerColorsMappingForALeafSliceLayer(this.layer)]

      case MSShapeGroup:
      case MSSymbolInstance:
      case MSBitmapLayer:
        return [this.getLayerColorsMappingForALeafLayer(this.layer)]

      case MSRectangleShape:
      case MSShapePathLayer:
      case MSOvalShape:
        return []

      default:
        log("Error: Unknown layer class", layerClass)
        return []
      }
    }

    /**
     * Get the mappings for a nested layer
     * @param {MSArtboardGroup|MSLayerGroup|MSSymbolMaster} nestedLayer
     * @return {Array.<CHRLayerColorsMapping>}
     */
    getLayerColorsMappingsForANestedLayer(nestedLayer) {
      var mappings = [this.getLayerColorsMappingForALeafLayer(nestedLayer)]

      var childrenLayers = nestedLayer.layers()
      for (var i = 0; i < childrenLayers.length; i++) {
        var layer = childrenLayers[i]
        mappings = mappings.concat(new CHRLayer(layer).getLayerColorsMappingsForLayer())
      }

      return mappings
    }

    /**
     * Get the mapping of a text layer and its colors
     * A text layer is also a leaf layer, it has no children layers
     * @param {MSTextLayer} textLayer
     * @return {CHRLayerColorsMapping}
     */
    getLayerColorsMappingForALeafTextLayer(textLayer) {
      var layerColors = this.getLayerColorsMappingForALeafLayer(textLayer).colors

      var textAttributes = textLayer.attributedStringValue().treeAsDictionary().attributes
      for (var i = 0; i < textAttributes.length; i++) {
        var attribute = textAttributes[i]
        if (attribute.MSAttributedStringColorAttribute == undefined) {
          continue
        }

        var colorString = attribute.MSAttributedStringColorAttribute.value
        if (isHexRepresentationOfAColor(colorString)) {
          layerColors.push(CHRMSColorFactory.createFromHexRepresentation(colorString))
        } else if (isRgbaDescriptionOfAColor(colorString)) {
          layerColors.push(CHRMSColorFactory.createFromRgbaDescription(colorString))
        } else {
          log("Error: 'getLayerColorsMappingForALeafTextLayer' found a color that is not a hex description and nor a rgba description")
        }
      }

      return new CHRLayerColorsMapping(textLayer, layerColors)
    }

    /**
     * Get the mapping of a slice layer and its colors
     * A slice layer is also a leaf layer, it has no children layers
     * @param {MSSliceLayer} sliceLayer
     * @return {CHRLayerColorsMapping}
     */
    getLayerColorsMappingForALeafSliceLayer(sliceLayer) {
      var layerColors = sliceLayer.hasBackgroundColor() ? [sliceLayer.backgroundColor()] : []
      return new CHRLayerColorsMapping(sliceLayer, layerColors)
    }

    /**
     * Get the mapping of a leaf layer and its colors
     * A leaf layer is a layer that has no children layers
     * @param {MSLayer} layer
     * @return {CHRLayerColorsMapping}
     */
    getLayerColorsMappingForALeafLayer(layer) {
      var layerColors = new CHRStyle(layer.style()).getColors()
      return new CHRLayerColorsMapping(layer, layerColors)
    }
}
