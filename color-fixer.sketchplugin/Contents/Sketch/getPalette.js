var onRun = function(context) {
  var palette = []

  var selectedLayers = context.selection

  if (selectedLayers.count() == 0) {
    var message = "You haven't selected any layers."
    context.document.showMessage(message)

    return
  }
}
