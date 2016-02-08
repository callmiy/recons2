$(function () {
  /*jshint camelcase:false*/

  "use strict";

  function parseNumber(val) {
    return Number(val.replace(/[,\s]/g, ''))
  }

  function parseDate(val) {
    var dateRe = new RegExp("(\\d+)[^\d](\\d+)[^\d](\\d+)"),
        exec   = dateRe.exec(val.trim())

    return exec[3] + '-' + exec[2] + '-' + exec[1]
  }

  var $idUpload = $('#id_upload-lc-register-text'),
      $toUpload = $('#id_upload-lc-register')

  $idUpload.on('input', function () {
    var reportHeaderBeginText = 'FORM M PROCESSED ON CBN WINDOW',
        toUpload              = []

    Papa.parse($idUpload.val().replace(reportHeaderBeginText, '').trim().replace(/"/g, ''), {
      delimiter: '\t',
      header: true,
      step: function (row) {
        var data = row.data[0]

        try {
          toUpload.push(
            {
              ba: data['BA NUM'].trim(),
              mf: data['MF NUM'].trim(),
              ccy: data.CURRENCY.trim(),
              fob: parseNumber(data.FOB),
              applicant: data['APPLICANT NAME'].trim(),
              submitted_at: parseDate(data['DATE SUBMITTED']),
              goods_description: data.DESCS.trim(),
              cost_freight: parseNumber(data['COST AND FREIGHT']),
              validity_type: data['VALIDITY TYPE'].trim(),
              status: data.STAX.trim()
            }
          )
        } catch (e) {
          window.alert("Error parsing data\n" + e.message)
        }

      }
    })

    $toUpload.val(JSON.stringify(toUpload))
  })

  $('.upload-lc-register-form').submit(function (evt) {

    if (/^\[\{".+/.test($toUpload.val())) {
      $('#upload-lc-register-submit').prop('disabled', true)
      $('textarea').each(function () {
        $(this).prop('readonly', true)
      })
      $(this).addClass('ui-widget-overlay ui-front')

    } else {
      window.alert('Nothing to upload or invalid upload data!')
      evt.preventDefault()
    }
  })
});
