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


@import 'Core/CHRPalette.js'
@import 'Parser/CHRDocumentParser.js'
@import 'Core/CHRRogueLayers.js'

/**
 * Find all rogue layers
 *
 * This command will find all layers that have colors outside of your palette
 *
 * @param context
 */
let findAllRogueLayers = function(context) {
    let palette = CHRPalette.loadPalette()
    if (palette.length == 0) {
        context.document.showMessage('You have no colors in your palette.')
        return
    }

    let mappings = CHRDocumentParser.getLayerColorsMappingsForDocument(context.document)
    let rogueLayers = CHRRogueLayers.getRogueLayersFromLayerMappings(mappings, palette)
    context.document.showMessage("You have " + rogueLayers.length + " rogue layers.")

    let layersIds = rogueLayers.map(layer => layer.objectID())
    CHRRogueLayers.saveRogueLayersIds(layersIds)
    CHRRogueLayers.removeRogueLayersCursor()
}
