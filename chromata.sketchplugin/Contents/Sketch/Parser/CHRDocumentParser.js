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


@import 'Parser/CHRPageParser.js'

/**
 * Class representing a parser around MSDocument
 */
function CHRDocumentParser() {}

/**
 * Get the mappings between a document's layers and their colors
 * @param {MSDocument} document
 * @return {Array.<CHRLayerColorsMapping>}
 */
CHRDocumentParser.getLayerColorsMappingsForDocument = function(document) {
    let mappings = []

    let pages = document.pages()
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i]
        mappings = mappings.concat(CHRPageParser().getLayerColorsMappingsForPage(page))
    }

    return mappings
}
