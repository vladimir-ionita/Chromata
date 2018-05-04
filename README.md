<div align="center">

# Chromata

### A sketch plugin to find and fix layers that have colors outside of your palette.
[![Version](https://img.shields.io/badge/Version-0.3.0-green.svg)]()
[![Compatible Sketch Version](https://img.shields.io/badge/Sketch-49.3-green.svg)]()
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

</div>
<br></br>

## Installation

**Dunya:** So how do I install it?

**Vladimir:** Just double click on the sketchplugin file ;)

## Usage

**Dunya:** I installed it. Now what?

**Vladimir:**
You have to select the layers that contain the colors you want to use for your palette and press `⌘ + ⇧ + P`.
After, you can press `⌘ + ⇧ + F` and the plugin will select the next deviated layer.

**Dunya:** How does the plugin know about my palette?

**Vladimir:** When you press `⌘ + ⇧ + P`, you actually register a palette.
This palette will be used when checking every layer's colors. If a layer doesn't correspond to the palette, it will be a 'deviated layer'.
Every time you want to reset the palette, reselect the layers and use the same shortcut to register a new one.
