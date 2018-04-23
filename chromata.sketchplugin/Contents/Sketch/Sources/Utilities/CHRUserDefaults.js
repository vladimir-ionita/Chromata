/*
  Chromata - Sketch plugin to find and fix layers that have colors
  outside of your palette.
  Copyright (C) 2018  Vladimir Ionita
*/


const pluginIdentifier = "com.vladimirionita.chromata";

function setValueForKey(value, key) {
  var userDefaults = NSUserDefaults.alloc().initWithSuiteName(pluginIdentifier)
  userDefaults.setObject_forKey(value, key)
  userDefaults.synchronize()
}

function getValueForKey(key) {
  var userDefaults = NSUserDefaults.alloc().initWithSuiteName(pluginIdentifier)
  return userDefaults.valueForKey(key)
}
