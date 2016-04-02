$( function () {
  "use strict";

  var $dateFormat = $( '[name=date-format]' )
  var $upload = $( '#id_upload-contingent' )


  $dateFormat.change( function () {
    $upload.prop( 'disabled', !$dateFormat.filter( ':checked' ).size() )
  } )

} )
