$( function () {
  "use strict";

  var $idUpload = $( '#id_upload-lc-register' ),
    lcInstances = [],
    $dateFormat = $( '[name=date-format]' ),
    reportText


  $dateFormat.change( function () {
    $idUpload.prop( 'disabled', !$dateFormat.filter( ':checked' ).size() )
  } )

  $idUpload.on( 'input', function () {
    var reportHeaderBeginText = 'APPLICANT REF	LC ESTABLISHMENT DATE'
    reportText = $idUpload.val().trim()
    reportText = reportText.slice( reportText.indexOf( reportHeaderBeginText ) )

    Papa.parse( reportText, {
      delimiter: '\t', header: true, step: function (row) {
        var lcInstance = {}
        var obj = row.data[0]

        if ( obj['LC NUMBER'].indexOf( 'GTE-' ) === 0 ) return

        _.each( obj, function (val, key) {
          if ( key in LC_REGISTER_REPORT_MODEL_HEADERS_MAPPING ) {
            var lcAttribute = LC_REGISTER_REPORT_MODEL_HEADERS_MAPPING[key]
            lcInstance[lcAttribute] = val.trim()
          }
        } )

        lcInstances.push( lcInstance )
      }
    } )

    $idUpload.val( JSON.stringify( lcInstances ) );
  } );

  $( '.upload-lc-register-form' ).submit( function (evt) {

    if ( /^\[\{".+/.test( $idUpload.val() ) ) {
      $( '#upload-lc-register-submit' ).prop( 'disabled', true )
      $idUpload.prop( 'readonly', true )
      $( this ).addClass( 'ui-widget-overlay ui-front' )

    } else {
      window.alert( 'Nothing to upload or invalid upload data!' )
      evt.preventDefault()
    }
  } )
} );
