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


@import 'Storage/CHRUserDefaults.js'

const kUserDefaultsRogueLayersKey = "rogue-layers"
const kUserDefaultsRogueLayersCursorKey = "rogue-layers-cursor"

/**
 * Class representing a service for rogue layers
 */
function CHRRogueLayers() {}

/**
 * Get all rogue layers
 *
 * @param {Array.<CHRLayerColorsMapping>} layerMappings
 * @param {Array.<MSColor>} palette
 *
 * @return {Array.<MSLayer>}
 */
CHRRogueLayers.getRogueLayersFromLayerMappings = function(layerMappings, palette) {
    return layerMappings
        .filter(mapping => CHRRogueLayers.isLayerRogue(mapping, palette))
        .map(mapping => mapping.layer)
}

/**
 * Check if a layer is rogue
 *
 * @param {CHRLayerColorsMapping} layerMapping
 * @param {Array.<MSColor>} palette
 *
 * @return {boolean}
 */
CHRRogueLayers.isLayerRogue = function(layerMapping, palette) {
    let layerColors = layerMapping.colors
    for (let i = 0; i < layerColors.length; i++) {
        if (!CHRPalette.isColorInPalette(layerColors[i], palette)) {
            return true
        }
    }

    return false
}

/**
 * Save rogue layers ids in user defaults for later use
 *
 * @param {Array.<string>} layersIds
 */
CHRRogueLayers.saveRogueLayersIds = function(layersIds) {
    CHRUserDefaults.saveValueForKey(layersIds, kUserDefaultsRogueLayersKey)
}

/**
 * Load rogue layers ids from user defaults
 *
 * @return {Array.<string>}
 */
CHRRogueLayers.loadRogueLayersIds = function() {
    return CHRUserDefaults.fetchValueForKey(kUserDefaultsRogueLayersKey)
}

/**
 * Save rogue layers cursor in user defaults for later use
 *
 * @param {string} layerId
 */
CHRRogueLayers.saveRogueLayersCursor = function(layerId) {
    CHRUserDefaults.saveValueForKey(layerId, kUserDefaultsRogueLayersCursorKey)
}

/**
 * Load rogue layers cursor from user defaults
 *
 * @return {string}
 */
CHRRogueLayers.loadRogueLayersCursor = function() {
    return CHRUserDefaults.fetchValueForKey(kUserDefaultsRogueLayersCursorKey)
}
