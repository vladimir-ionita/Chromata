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


@import 'Parser/CHRDocumentParser.js'
@import 'Core/CHRPalette.js'

var onRun = function(context) {
    globalContext = context

    let palette = CHRPalette.loadPalette()
    if (palette.length == 0) {
        context.document.showMessage('You have no colors in your palette.')
        return
    }

    let mappings = CHRDocumentParser.getLayerColorsMappingsForDocument(context.document)
    let rogueLayer = getNextRogueLayer(mappings, palette)
    if (typeof rogueLayer != 'undefined') {
        selectLayer(context, rogueLayer)
        moveViewportFocusToLayer(context, rogueLayer)
    } else {
        context.document.showMessage("You're all set. Your colors match your palette!")
    }
}

/**
 * Get non-empty mappings
 * An empty mapping is a mapping with no colors
 * @param {Array.CHRLayerColorsMapping} mappings
 * @return {Array.CHRLayerColorsMapping}
 */
function getNonEmptyMappings(mappings) {
    return mappings.filter(mapping => mapping.colors.length > 0)
}

/**
 * Get next rogue layer
 * A rogue layers is a layer that has its colors outside of the palette
 * @param {Array.<CHRLayerColorsMapping>} layerMappings
 * @param {Array.<MSColor>} palette
 * @return {MSLayer}
 */
function getNextRogueLayer(layerMappings, palette) {
    for (let i = 0; i < layerMappings.length; i++) {
        let mapping = layerMappings[i]

        let layerColors = mapping.colors
        for (let j = 0; j < layerColors.length; j++) {
            if (!isColorInPalette(layerColors[j], palette)) {
                return mapping.layer
            }
        }
    }
}

/**
 * Check if color is in palette
 * @param {MSColor} color
 * @param {Array.<MSColor>} palette
 * @return {boolean}
 */
function isColorInPalette(color, palette) {
    let comparisionPrecision = 0.9/255

    for (let i = 0; i < palette.length; i++) {
        if (color.fuzzyIsEqual_precision(palette[i], comparisionPrecision)) {
            return true
        }
    }

    return false
}

/**
 * Select a layer
 * @param {NSDictionary} context
 * @param {MSLayer} layer
 */
function selectLayer(context, layer) {
    context.document.setCurrentPage(layer.parentPage())
    context.document.currentPage().changeSelectionBySelectingLayers([])
    layer.select_byExpandingSelection(true, true)
}


/**
 * Move view focus to a specific layer
 * @param {NSDictionary} context
 * @param {MSLayer} layer
 */
function moveViewportFocusToLayer(context, layer) {
    const padding = 100

    let focusRect = NSMakeRect(
        layer.absolutePosition().x - padding,
        layer.absolutePosition().y - padding,
        layer.frame().size().width + padding * 2,
        layer.frame().size().height + padding * 2
    )

    context.document.currentContentViewController().contentDrawView().zoomToFitRect(focusRect)
}


/**
 * Print palette colors amount and non empty layer mappings amount
 * @param {Array.<MSColor>} palette
 * @param {Array.<CHRLayerColorsMapping>} mappings
 */
function debugInfo(palette, mappings) {
    log("Palette: " + palette.length)
    log("Colors: " + getNonEmptyMappings(mappings).length)
}
