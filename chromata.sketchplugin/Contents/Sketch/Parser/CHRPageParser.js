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


@import 'Parser/CHRLayerParser.js'

/**
 * Class representing a parser around MSPage
 * @class
 */
function CHRPageParser() {}

/**
 * Get the mappings between a page's layers and their colors
 *
 * @param {MSPage} page
 *
 * @return {Array.<CHRLayerColorsMapping>}
 */
CHRPageParser.getLayerColorsMappingsForPage = function(page) {
    let mappings = []

    let layers = page.layers()
    for (let i = 0; i < layers.length; i++) {
        let layer = layers[i]
        mappings = mappings.concat(CHRLayerParser.getLayerColorsMappingsForLayer(layer))
    }

    return mappings
}

/**
 * Get layer by id from a page
 *
 * @param {string} layerId
 * @param {MSPage} page
 *
 * @return {MSLayer|null}
 */
CHRPageParser.getLayerByIdFromPage = function(layerId, page) {
    let layers = page.layers()

    for (let i = 0; i < layers.length; i++) {
        let layer = layers[i]

        let leafLayer = CHRLayerParser.getLayerByIdFromNodeLayer(layerId, layer)
        if (leafLayer) {
            return leafLayer
        }
    }

    return null
}
