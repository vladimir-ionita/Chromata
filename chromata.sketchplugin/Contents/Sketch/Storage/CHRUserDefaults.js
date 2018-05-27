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


const kUserDefaultsChromataSuiteName = "com.vladimirionita.chromata"

/**
 * Class representing a wrapper around NSUserDefaults
 */
function CHRUserDefaults() {}

/**
 * Get suite name for user defaults
 *
 * @return {string}
 */
CHRUserDefaults.getSuiteName = function() {
    let fileName = globalContext.document.cloudName()
    return [kUserDefaultsChromataSuiteName, fileName].join("-")
}

/**
 * Save value for key in user defaults
 *
 * @param {T} value
 * @param {string} key
 */
CHRUserDefaults.saveValueForKey = function(value, key) {
    let userDefaults = NSUserDefaults.alloc().initWithSuiteName(kUserDefaultsChromataSuiteName)
    userDefaults.setObject_forKey(value, key)
    userDefaults.synchronize()
}

/**
 * Fetch value for key from user defaults
 *
 * @param {string} key
 *
 * @return {T|null}
 */
CHRUserDefaults.fetchValueForKey = function(key) {
    let userDefaults = NSUserDefaults.alloc().initWithSuiteName(kUserDefaultsChromataSuiteName)
    return userDefaults.valueForKey(key)
}


/**
 * Remove value for key from user defaults
 *
 * @param {string} key
 */
CHRUserDefaults.removeValueForKey = function(key) {
    let userDefaults = NSUserDefaults.alloc().initWithSuiteName(kUserDefaultsChromataSuiteName)
    userDefaults.removeObjectForKey(key)
    userDefaults.synchronize()
}
