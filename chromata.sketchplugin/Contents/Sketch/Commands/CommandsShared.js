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


/**
 * Register a global context
 *
 * @param context
 */
function setupEnvironment(context) {
    globalContext = context
}

/**
 * Select a layer in a document
 *
 * @param {MSDocument} document
 * @param {MSLayer} layer
 */
function selectLayer(document, layer) {
    document.setCurrentPage(layer.parentPage())
    document.currentPage().changeSelectionBySelectingLayers([])
    layer.select_byExpandingSelection(true, true)
}

/**
 * Move focus to a specific layer
 *
 * @param {MSDocument} document
 * @param {MSLayer} layer
 */
function moveViewportFocusToLayer(document, layer) {
    const padding = 100

    let focusRect = NSMakeRect(
        layer.absolutePosition().x - padding,
        layer.absolutePosition().y - padding,
        layer.frame().size().width + padding * 2,
        layer.frame().size().height + padding * 2
    )

    document.currentContentViewController().contentDrawView().zoomToFitRect(focusRect)
}
