/*
  Chromata - Sketch plugin to find and fix layers that have colors
  outside of your palette.
  Copyright (C) 2018  Vladimir Ionita
*/


function isColorHex(color) {
  return color.indexOf('#') != -1
}

function isColorRGB(color) {
  return color.indexOf('rgba') != -1
}


function hexStringToColor(hexString) {
  var rgbColor = hexToRgb(hexString)
  return MSColor.rgbColorRed_green_blue(rgbColor.r, rgbColor.g, rgbColor.b)
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function rgbaStringToRgb(rgbaString) {
  var rgbaValuesString = rgbaString.substring(rgbaString.indexOf('(') + 1, rgbaString.indexOf(')'))
  var rgbaValues = rgbaValuesString.split(',')

  return {
    r: rgbaValues[0],
    g: rgbaValues[1],
    b: rgbaValues[2],
    a: rgbaValues[3]
  }
}

function rgbaStringToColor(rgbaString) {
  var rgb = rgbaStringToRgb(rgbaString)
  return rgbToColor(rgb)
}

function rgbToColor(rgb) {
  return MSColor.rgbColorRed_green_blue(rgb.r, rgb.g, rgb.b).colorWithAlphaComponent(rgb.a)
}
