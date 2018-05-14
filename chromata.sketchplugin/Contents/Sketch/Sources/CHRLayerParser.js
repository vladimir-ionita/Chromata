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


@import 'Sources/CHRStyleParser.js'
@import 'Sources/CHRLayerColorsMapping.js'
@import 'Sources/Utilities/Colors/CHRColorsHelper.js'
@import 'Sources/Utilities/Colors/CHRMSColorFactory.js'
@import 'Core/CHRErrorHandler.js'

/**
 * Class representing a parser around MSLayer
 */
function CHRLayerParser() {}

/**
 * Get the mappings for a layer
 * @param {MSLayer} layer
 * @return {Array.<CHRLayerColorsMapping>}
 */
CHRLayerParser.getLayerColorsMappingsForLayer = (function() {
    /**
     * Get the mappings for a layer
     * @param {MSLayer} layer
     * @return {Array.<CHRLayerColorsMapping>}
     */
    function getLayerColorsMappingsForLayer(layer) {
        if (!layer.isVisible()) {
            return []
        }

        let layerClass = layer.class()
        switch (layerClass) {
            case MSArtboardGroup:
            case MSSymbolMaster:
            case MSLayerGroup:
                return getLayersColorsMappingsForANestedLayer(layer)

            case MSTextLayer:
                return [(getLayerColorsMappingForALeafTextLayer(layer))]
            case MSSliceLayer:
                return [(getLayerColorsMappingForALeafSliceLayer(layer))]

            case MSShapeGroup:
            case MSSymbolInstance:
            case MSBitmapLayer:
                return [(getLayerColorsMappingForALeafLayer(layer))]

            case MSRectangleShape:
            case MSShapePathLayer:
            case MSOvalShape:
                return []

            default:
                let errorMessage = 'Warning. Unknown layer class: ' + layerClass
                raiseWarningError(errorMessage)
                return []
        }
    }

    /**
     * Get the mappings for a nested layer
     * @param {MSArtboardGroup|MSLayerGroup|MSSymbolMaster} nestedLayer
     * @return {Array.<CHRLayerColorsMapping>}
     */
    function getLayersColorsMappingsForANestedLayer(nestedLayer) {
        let mappings = [(getLayerColorsMappingForALeafLayer(nestedLayer))]

        let childrenLayers = nestedLayer.layers()
        for (let i = 0; i < childrenLayers.length; i++) {
            let layer = childrenLayers[i]
            mappings = mappings.concat(CHRLayerParser.getLayerColorsMappingsForLayer(layer))
        }

        return mappings
    }

    /**
     * Get the mapping of a text layer and its colors
     * A text layer is also a leaf layer, it has no children layers
     * @param {MSTextLayer} textLayer
     * @return {CHRLayerColorsMapping}
     */
    function getLayerColorsMappingForALeafTextLayer(textLayer) {
        let layerColors = getLayerColorsMappingForALeafLayer(textLayer).colors

        let textAttributes = textLayer.attributedStringValue().treeAsDictionary().attributes
        for (let i = 0; i < textAttributes.length; i++) {
            let attribute = textAttributes[i]
            if (attribute.MSAttributedStringColorAttribute == undefined) {
                continue
            }

            let colorString = attribute.MSAttributedStringColorAttribute.value
            if (isHexRepresentationOfAColor(colorString)) {
                layerColors.push(CHRMSColorFactory.createFromHexRepresentation(colorString))
            } else if (isRgbaDescriptionOfAColor(colorString)) {
                layerColors.push(CHRMSColorFactory.createFromRgbaDescription(colorString))
            } else {
                let errorMessage = "Warning: 'getLayerColorsMappingForALeafTextLayer' found a color that is not a hex description and nor a rgba description"
                raiseWarningError(errorMessage)
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
    function getLayerColorsMappingForALeafSliceLayer(sliceLayer) {
        let layerColors = sliceLayer.hasBackgroundColor() ? [sliceLayer.backgroundColor()] : []
        return new CHRLayerColorsMapping(sliceLayer, layerColors)
    }

    /**
     * Get the mapping of a leaf layer and its colors
     * A leaf layer is a layer that has no children layers
     * @param {MSLayer} layer
     * @return {CHRLayerColorsMapping}
     */
    function getLayerColorsMappingForALeafLayer(layer) {
        let layerColors = CHRStyleParser.getColors(layer.style())
        return new CHRLayerColorsMapping(layer, layerColors)
    }

    return getLayerColorsMappingsForLayer
})()
