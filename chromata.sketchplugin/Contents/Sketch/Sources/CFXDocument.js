@import 'Sources/CHRPage.js'

class CFXDocument {
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
