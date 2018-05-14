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
 * Raise a warning error
 * @param {string} errorDescription
 */
function raiseWarningError(errorMessage) {
  errorMessage = [errorMessage, 'Please raise an issue on github (https://github.com/abnamrocoesd/Chromata/issues/new).'].join(' ')

  log(errorMessage)
  globalContext.document.showMessage(errorMessage)
}

/**
 * Raise a critical error
 * @param {string} errorDescription
 */
function raiseCriticalError(errorMessage) {
  raiseWarningError(errorMessage)
  throw -1
}
