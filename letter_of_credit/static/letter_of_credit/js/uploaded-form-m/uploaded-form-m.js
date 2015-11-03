$(function() {
  /*jshint camelcase:false*/

  "use strict";

  var $idUpload = $('#id_upload-lc-register-text'),
    $toUpload = $('#id_upload-lc-register')

  $idUpload.on('input', function() {
    var reportHeaderBeginText = 'FORM M PROCESSED ON CBN WINDOW',
      toUpload = []

    Papa.parse($idUpload.val().replace(reportHeaderBeginText, '').trim(), {
      delimiter: '\t',
      header: true,
      step: function(row) {
        var data = row.data[0],
          ba = data['BA NUM']

        if (ba.length === 16) {
          toUpload.push(
            {
              ba: ba,
              mf: data['MF NUM'],
              ccy: data.CURRENCY,
              fob: data.FOB,
              applicant: data['APPLICANT NAME'],
              submitted_at: data['DATE SUBMITTED'],
              goods_description: data.DESCS,
              cost_freight: data['COST AND FREIGHT'],
              validity_type: data['VALIDITY TYPE'],
              status: data.STAX
            }
          )
        }
      }
    })

    $toUpload.val(JSON.stringify(toUpload))
  })

  $('.upload-lc-register-form').submit(function(evt) {

    if (/^\[\{".+/.test($toUpload.val())) {
      $('#upload-lc-register-submit').prop('disabled', true)
      $('textarea').each(function() {
        $(this).prop('readonly', true)
      })
      $(this).addClass('ui-widget-overlay ui-front')

      evt.preventDefault()

    } else {
      window.alert('Nothing to upload or invalid upload data!')
      evt.preventDefault()
    }
  })
});
