/*
  Chromata - Sketch plugin to find and fix layers that have colors
  outside of your palette.
  Copyright (C) 2018  Vladimir Ionita
*/


@import 'Sources/CHRPage.js'

class CHRDocument {
  constructor(document) {
    this.document = document
  }

  getColorsForDocument() {
    var colorsForAllPages = []

    var pages = this.document.pages()
    for (var i = 0; i < pages.count(); i++) {
      var page = pages[i]
      var colorsForPage = new CHRPage(page).getColorsForPage()

      colorsForAllPages = colorsForAllPages.concat(colorsForPage)
    }

    return colorsForAllPages
  }
}
