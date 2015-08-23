$(function() {
  "use strict";

  var $draftControls = $('.draft-control-group');
  var $hideAll = $('#hide-all');
  var $showAll = $('#show-all');

  var $fieldsToHideCheckboxes = $('.fields-to-hide-checkboxes');
  var fieldsToHideCheckboxesCount = $fieldsToHideCheckboxes.size();

  var $lcRefHideCheckbox = $('#lc-ref-hide');
  var $issueDateHideCheckbox = $('#issue-date-hide');
  var $expiryDateHideCheckbox = $('#expiry-date-hide');
  var $shipmentDateHideCheckbox = $('#shipment-date-hide');

  var $telex = $('#telex-text-mt-700');
  var $telexReformatted = $('#telex-text-mt-700-reformatted');
  var $telexReformattedFileName = $('#telex-text-mt-700-reformatted-file-name');

  var $confirmation = $($('#hide-telex-variables-confirmation-template').text()).dialog({
    resizable: false,
    height   : 250,
    width    : 400,
    modal    : true,
    autoOpen : false
  });

  var $confirmationMsg = $confirmation.find('#message');

  var confirmationCancelButton = {
    text : 'Cancel',
    click: function() {
      $(this).dialog('close');
    }
  };

  (function showHideControlEvents() {
    $('.hide-or-show-all-checkboxes').change(function() {
      var $el = $(this);

      if ($el.is('#hide-all')) {

        if ($el.is(':checked')) {
          $fieldsToHideCheckboxes.each(function() {
            $(this).prop('checked', true);
          });

          $showAll.prop('checked', false);

        }

      } else {
        if ($el.is(':checked')) {
          $fieldsToHideCheckboxes.each(function() {
            $(this).prop('checked', false);
          });

          $hideAll.prop('checked', false);
        }
      }
    });

    $fieldsToHideCheckboxes.change(function() {

      if ($fieldsToHideCheckboxes.filter(':checked').size() === 0) {
        $hideAll.prop('checked', false);
        $showAll.prop('checked', true);

      } else if ($fieldsToHideCheckboxes.filter(':checked').size() < fieldsToHideCheckboxesCount) {
        $hideAll.prop('checked', false);
        $showAll.prop('checked', false);

      } else {
        $hideAll.prop('checked', true);
      }
    });

    $('input[name=release-type-radio]').change(function() {
      var $el = $(this);

      if ($el.prop('id') === 'release-type-draft') {
        $draftControls.show();

      } else {
        $showAll.prop('checked', true).trigger('change');
        $draftControls.hide();
      }
    });
  })();

  /**
   * Takes the raw MT 700 string from either TI or SWIFT, hides data that we do not want customer to see such as LC
   * reference (e.g in the case of draft LC). We returned the cleaned MT 700 telex along with file name that will be
   * used to save telex copy on client machine. The file name is made of identifiers from the MT 700 telex
   *
   * @returns {{telex: (*|string), fileName: string}}
   */
  function processMT700() {

    /**
     * Extract applicant name, LC value, LC currency, form M number, issue date, shipment date and expiry date from
     * MT 700 telex
     * @returns {{applicant: string, ccy: string, amount: string, formM: string, issueDate: string, expiryDate: string,
     *   shipmentDate: string, lcRef: string}}
     */
    function extractVariables() {
      var applicant = '';
      var applicantExec = /[:F]*50: APPLICANT.*\n(.+)/i.exec(telex);

      if (applicantExec) {
        applicant = applicantExec[1].trim();
      }

      var amount = '';
      var amountExec = /[:F]*32B: CURRENCY CODE, AMOUNT[.\n\s]*[A-Z]{3}[.\n\s]*([0-9,]+)/i.exec(telex);

      if (!amountExec) {
        amountExec = /Amount:\s+[\d,]+\s+#([0-9,]+)#/.exec(telex);
      }

      if (amountExec) {
        amount = kanmii.numberFormat(amountExec[1].trim().replace(',', '.'));
      }

      var ccy = '';
      var ccyExec = /[:F]*32B: CURRENCY CODE, AMOUNT[.\n\s]*([A-Z]{3})/i.exec(telex) || /Currency:\s+([A-Z]{3})/i.exec(telex);

      if (ccyExec) {
        ccy = ccyExec[1].trim();
      }

      var formM = '';
      var formMExec = /MF20[\dX]+/i.exec(telex);

      if (formMExec) {
        formM = formMExec[0];
      }

      var lcRef = '';
      var lcRefExec = /ILCL[A-Z]{3}[\d+X]+/i.exec(telex);

      if (lcRefExec) {
        lcRef = lcRefExec[0];
      }

      var expiryDate;
      var expiryDateExec = /[:F]*31D: Date and Place of Expiry[\s.\n]+(\d{6})/i.exec(telex);

      if (expiryDateExec) {
        expiryDate = expiryDateExec[1];
      }

      var issueDate;
      var issueDateExec = /[:F]*31C: DATE OF ISSUE[\s.\n]+(\d{6})/i.exec(telex);

      if (issueDateExec) {
        issueDate = issueDateExec[1];
      }

      var shipmentDate;
      var shipmentDateExec = /[:F]*44C: LATEST DATE OF SHIPMENT[\s.\n]+(\d{6})/i.exec(telex);

      if (shipmentDateExec) {
        shipmentDate = shipmentDateExec[1];
      }

      return {
        applicant   : applicant,
        ccy         : ccy,
        amount      : amount,
        formM       : formM,
        issueDate   : issueDate,
        expiryDate  : expiryDate,
        shipmentDate: shipmentDate,
        lcRef       : lcRef
      };
    }

    /**
     * Hide LC reference, issue date, expiry date and shipment depending on user's choice. If LC reference should not be
     * hidden, append it to the file name
     */
    function hideVariables() {
      if (variables.lcRef) {
        if ($lcRefHideCheckbox.is(':checked')) {
          var lcRefRegexp = new RegExp(variables.lcRef, 'g');
          telex = telex.replace(lcRefRegexp, variables.lcRef.slice(0, 4) + 'XXXXXXXXXXXX');
          willBeHiddenTexts.push('LC reference will be hidden!');

        } else {
          fileName += ('-' + variables.lcRef);
        }
      }

      if (variables.issueDate && $issueDateHideCheckbox.is(':checked')) {
        telex = telex.replace(variables.issueDate, 'XXXXXX');
        willBeHiddenTexts.push('Issue date will be hidden!');
      }

      if (variables.expiryDate && $expiryDateHideCheckbox.is(':checked')) {
        telex = telex.replace(variables.expiryDate, 'XXXXXX ');
        willBeHiddenTexts.push('Expiry date will be hidden!');
      }

      if (variables.shipmentDate && $shipmentDateHideCheckbox.is(':checked')) {
        telex = telex.replace(variables.shipmentDate, 'XXXXXX');
        willBeHiddenTexts.push('Shipment date will be hidden!');
      }
    }

    var telex = $telex.val().trim();
    var willBeHiddenTexts = [];

    if (!telex) {return null;}

    var tiTelexStart = telex.toLowerCase().indexOf('mt700 issue of a documentary credit');

    if (tiTelexStart !== -1) {
      telex = telex.slice(tiTelexStart);
    }

    var variables = extractVariables();

    var fileName = variables.applicant + '-' + variables.ccy + variables.amount + '-' + variables.formM;

    if ($showAll.is(':checked')) {
      fileName += ('-' + variables.lcRef);

    } else {
      hideVariables();
    }

    fileName += '.txt';

    return {
      telex            : telex,
      fileName         : fileName,
      willBeHiddenTexts: willBeHiddenTexts
    };
  }

  (function saveTelex() {

    $('#save-telex-button').click(function() {

      hideTelexFormattedContainer();
      $confirmationMsg.html('');

      var telexFileNameObj = processMT700();

      if (telexFileNameObj) {
        var buttons = [confirmationCancelButton];
        buttons.push({
          text : 'Ok',
          click: function() {
            var blob = new Blob([telexFileNameObj.telex], {type: "text/plain;charset=utf-8"});
            saveAs(blob, telexFileNameObj.fileName);

            $telexReformattedFileName.val(telexFileNameObj.fileName);
            $telexReformatted.val(telexFileNameObj.telex).parent().show();
            kanmii.selectText($telexReformattedFileName[0]);
            $(this).dialog('close');
          }
        });

        if (telexFileNameObj.willBeHiddenTexts.length > 0) {
          telexFileNameObj.willBeHiddenTexts.forEach(function(text) {
            $confirmationMsg.append($('<p>' + text + '</p>'));
          });

        } else {
          $confirmationMsg.append($('<p>Nothing will be hidden. You are releasing authenticated telex?</p>'));
        }

        $confirmation
          .dialog('option', 'buttons', buttons)
          .dialog('open');

      } else {
        $confirmation
          .dialog('option', 'buttons', [confirmationCancelButton])
          .dialog('open');
      }
    });

    $('#clear-telex-button').click(function() {
      $telex.val('');
      hideTelexFormattedContainer();
    });

    /**
     * Hides the HTML div container that contains controls for displaying reformatted telex and file name
     */
    function hideTelexFormattedContainer(){
      $telexReformattedFileName.val('');
      $telexReformatted.val('').parent().hide();
    }
  })();
});
