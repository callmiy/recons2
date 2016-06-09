$( function () {
  /*jshint camelcase:false*/

  "use strict";


  var $idUpload = $( '#id_upload-lc-register-text' ),
    lcCommissionInstances = [],
    $toUpload = $( '#id_upload-lc-register' ),
    $dateFormat = $( '[name=date-format]' ),
    $textAreaControls = $( '.text-area-control' ),
    dateFormat

  function parseNumber(val) {
    return Number( val.replace( /[,\s]/g, '' ) )
  }

  function prePendZeros(val) {
    val = '' + val
    return val.length === 4 ? val : '20' + val
  }

  function parseDate(val) {
    var dateRe = new RegExp( "(\\d+)[^\d](\\d+)[^\d](\\d+)" ),
      exec = dateRe.exec( val.trim() ),
      start = prePendZeros( exec[3] ) + '-'

    if ( dateFormat === 'mm-dd-yyyy' ) return start + exec[1] + '-' + exec[2]

    return start + exec[2] + '-' + exec[1]
  }

  $dateFormat.change( function () {
    dateFormat = $( this ).val()
    var disabled = !$dateFormat.filter( ':checked' ).size()

    $textAreaControls.each( function () {
      $( this ).prop( 'disabled', disabled )
    } )
  } )

  $idUpload.on( 'input', function () {
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
        } catch (e) { }
      }
    } )
  } )
} )
