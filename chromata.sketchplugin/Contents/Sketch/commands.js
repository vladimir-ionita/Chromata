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


@import "Commands/CommandsShared.js"
@import "Commands/registerPalette.js"
@import "Commands/findAllRogueLayers.js"
@import "Commands/moveToPreviousRogueLayer.js"
@import "Commands/moveToNextRogueLayer.js"

var registerPaletteCommand = function(context) {
    setupEnvironment(context)
    registerPalette(context)
}

var findAllRogueLayersCommand = function(context) {
    setupEnvironment(context)
    findAllRogueLayers(context)
}

var moveToPreviousRogueLayerCommand = function(context) {
    setupEnvironment(context)
    moveToPreviousRogueLayer(context)
}

var moveToNextRogueLayerCommand = function(context) {
    setupEnvironment(context)
    moveToNextRogueLayer(context)
}
