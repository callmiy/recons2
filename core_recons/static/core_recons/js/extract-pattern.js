$( function () {
  "use strict";

  var $form = $( '#extract-pattern-form' )
  var $rawControl = $( '.raw-text-control' )
  var $rawText = $( '.raw-text' )
  var $select = $( '#selected-pattern' )
  var $result = $( '.result-text' )
  var result = JSON.parse( $result.val() )

  if ( result && result.result ) {
    $result.closest( 'div' ).show()
    var val = ''

    result.result.forEach( function (line) {
      val = val + line + '\n'
    } )

    $result.val( val )
  }

  $rawControl.click( function submitForm() {
    var rawText = $rawText.val().trim()
    var pattern = $select.val()

    if ( !rawText || !pattern ) {
      window.alert( 'Please enter text to extract or select pattern' )
      return
    }

    $form.submit()
  } )
} )
