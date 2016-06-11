$( function () {
  /*jshint camelcase:false*/

  "use strict";

  var $idUpload             = $( '#upload-lc-commission-text' ),
      $toUpload             = $( '#upload-lc-commission' ),
      $uploadStatus         = $( '#upload-lc-commission-status' )

  if ( $uploadStatus.val().trim() ) $uploadStatus.show()

  $idUpload.on( 'input', function () {
    var lcCommissionInstances = []
    $toUpload.val( '' )

    Papa.parse( $idUpload.val().trim(), {
      delimiter: '\t', header: true, step: function (row) {
        var lcCommissionData = {}
        var obj = row.data[0]

        try {
          _.each( obj, function (val, key) {
            if ( key in LC_COMMISSION_REPORT_MODEL_HEADERS_MAPPING ) {
              var lcCommissionAttribute = LC_COMMISSION_REPORT_MODEL_HEADERS_MAPPING[key]
              lcCommissionData[lcCommissionAttribute] = val.trim()
            }
          } )

          lcCommissionInstances.push( lcCommissionData )
        } catch (e) {
          window.alert( "Error parsing data\n" + e.message )
        }
      }
    } )

    $toUpload.val( JSON.stringify( lcCommissionInstances ) )
  } )

  $( '.upload-lc-commission-form' ).submit( function (evt) {

    if ( /^\[\{".+/.test( $toUpload.val() ) ) {
      $( '#upload-lc-register-submit' ).prop( 'disabled', true )
      $( 'textarea' ).each( function () {
        $( this ).prop( 'readonly', true )
      } )
      $( this ).addClass( 'ui-widget-overlay ui-front' )

    } else {
      window.alert( 'Nothing to upload or invalid upload data!' )
      evt.preventDefault()
    }
  } )

} )
