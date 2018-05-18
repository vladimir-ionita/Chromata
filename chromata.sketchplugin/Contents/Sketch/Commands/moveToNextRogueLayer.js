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


@import "Core/CHRPalette.js"
@import "Core/CHRRogueLayers.js"
@import "Parser/CHRDocumentParser.js"
@import "Commands/CommandsShared.js"

/**
 * Move to next rogue layer
 *
 * This command lets you navigate through the saved rogue layers
 *
 * @param context
 */
let moveToNextRogueLayer = function(context) {
    let palette = CHRPalette.loadPalette()
    if (palette.length == 0) {
        context.document.showMessage("You have no colors in your palette.")
        return
    }

    let rogueLayersIds = CHRRogueLayers.loadRogueLayersIds()
    if (rogueLayersIds.length == 0) {
        context.document.showMessage("You have no rogue layers. Use 'Find all rogue layers' first")
        return
    }

    let rogueLayersIdsCursorIndex = getRogueLayersCursorIndex(rogueLayersIds)
    if (rogueLayersIdsCursorIndex == undefined) {
        rogueLayersIdsCursorIndex = -1
    }

    if (rogueLayersIdsCursorIndex + 1 < rogueLayersIds.length) {
        rogueLayersIdsCursorIndex += 1

        let rogueLayersIdsCursor = rogueLayersIds[rogueLayersIdsCursorIndex]
        let rogueLayersCursor = CHRDocumentParser.getLayerByIdFromDocument(rogueLayersIdsCursor, context.document)
        if (rogueLayersCursor != null) {
            selectLayerInDocument(rogueLayersCursor, context.document)
            moveViewportFocusToLayerInDocument(rogueLayersCursor, context.document)
        } else {
            context.document.showMessage("This layer was removed, can't select it. Move forward or reset.")
        }

        CHRRogueLayers.saveRogueLayersCursor(rogueLayersIdsCursor)
    } else {
        context.document.showMessage("You are all set. There are no rogue layers left.")
    }
}

/**
 * Get rogue layers cursor index
 *
 * @param {Array.<string>} rogueLayersIds
 *
 * return {number|undefined}
 */
function getRogueLayersCursorIndex(rogueLayersIds) {
    let rogueLayersIdsCursor = CHRRogueLayers.loadRogueLayersCursor()
    if (rogueLayersIdsCursor == null) {
        rogueLayersIdsCursor == rogueLayersIds[0]
    }

    return rogueLayersIds.findIndex(element => element == rogueLayersIdsCursor)
}
