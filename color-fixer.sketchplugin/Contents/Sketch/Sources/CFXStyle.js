class CFXStyle {
  constructor(style) {
    this.style = style
  }

  getColors() {
    var colors = []

    colors = colors.concat(this.getBorderColors())
    colors = colors.concat(this.getFillColors())

    return colors
  }

  getBorderColors() {
    var colors = []

    var borders = this.style.borders()
    for (var i = 0; i < borders.count(); i++) {
      var border = borders[0]
      var borderColors = border.isEnabled() ? [border.color()] : []
      colors = colors.concat(borderColors)
    }

    return colors
  }

  getFillColors() {
    var colors = []

    var fills = this.style.fills()
    for (var i = 0; i < fills.count(); i++) {
      var fill = fills[i]

      var fillType = fill.fillType()
      switch(fillType) {
        case 0: // Solid Color
          var fillColors = fill.isEnabled() ? [fill.color()] : []
          colors = colors.concat(fillColors)
          break
        case 1: // Gradient
          var gradientColors = this.getGradientColors(fill.gradient())
          colors = colors.concat(gradientColors)
          break
        default:
          // TODO: Better error handling
          alert("Error: Unknown fill type", fillType);
          throw -1;
      }
    }

    return colors
  }

  getGradientColors(gradient) {
    var colors = []

    var gradientStops = gradient.stops()
    for (var i = 0; i < gradientStops; i++) {
      colors = colors.concat(gradientStop.color())
    }

    return colors
  }
}
