$(function() {
  "use strict";

  var $preLabel = $('pre[data-label-for]');
  var $targetCtrl = $("#" + ($preLabel.data('label-for')));

  if ($targetCtrl.val()) {
    $preLabel.hide();
  }

  $preLabel.css({
    position: 'absolute',
    top: 10,
    left: 25,
    margin: 0,
    padding: 0,
    color: '#ADACAC',
    display: 'block',
    border: 0,
    cursor: 'text',
    'background-color': 'initial',
    'white-space': 'pre-line',
    'border-radius': 0
  }).on('click', function() {
    var $el;
    $el = $(this);
    if ($targetCtrl.val) {
      if ($targetCtrl.val()) {
        $el.hide();
      } else {
        $targetCtrl.focus();
        $el.show();
      }
    } else if ($targetCtrl.text) {
      if ($targetCtrl.text()) {
        $el.hide();
      } else {
        $el.show();
      }
    }
    $targetCtrl.focus();
  })
    .next().on({
      'focusout': function() {
        var $el = $(this);
        if ($el.val) {
          if (!$el.val()) {
            return $el.prev().show();
          } else {
            return $el.prev().hide();
          }
        } else if ($el.text) {
          if (!$el.text()) {
            return $el.prev().show();
          } else {
            return $el.prev().hide();
          }
        }
      },
      'focusin': function() { $(this).prev().hide();}
    });

  var $idUpload = $('#id_upload-lc-register'),
    returnedData = [],
    reportText

  $idUpload.on('input', function() {
    var reportHeaderBeginText = 'APPLICANT REF	LC ESTABLISHMENT DATE'

    reportText = $idUpload.val().trim()

    reportText = reportText.slice(reportText.indexOf(reportHeaderBeginText))

    var results = Papa.parse(reportText, {delimiter: '\t', header: true}).data;

    for (var i = 0; i < results.length; i++) {
      var obj = results[i],
        returnedObj = {};
      for (var key in obj) {
        if (key in mappings) {
          var mappingsVal = mappings[key];
          returnedObj[mappingsVal] = obj[key].trim();
        }
      }
      returnedData.push(returnedObj);
    }
    $idUpload.val(JSON.stringify(returnedData));
  });

  $('.upload-lc-register-form').submit(function(evt) {

    if (/^\[\{".+/.test($idUpload.val())) {
      $('#upload-lc-register-submit').prop('disabled', true)
      $idUpload.prop('readonly', true)
      $(this).addClass('ui-widget-overlay ui-front')

    } else{
      window.alert('Nothing to upload or invalid upload data!')
      evt.preventDefault()
    }
  })
});
