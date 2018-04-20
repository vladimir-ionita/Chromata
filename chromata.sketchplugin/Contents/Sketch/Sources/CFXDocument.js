@import 'Sources/CFXPage.js'

class CFXDocument {
  constructor(document) {
    this.document = document
  }

  getColorsForDocument() {
    var colorsForAllPages = []

    var pages = this.document.pages()
    for (var i = 0; i < pages.count(); i++) {
      var page = pages[i]
      var colorsForPage = new CFXPage(page).getColorsForPage()

      colorsForAllPages = colorsForAllPages.concat(colorsForPage)
    }

    return colorsForAllPages
  }
}
