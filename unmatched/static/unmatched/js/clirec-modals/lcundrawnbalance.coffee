$tr = $($rowChkBoxSelector).filter(':checked').parents('tr')

clirecDataObj = getClirecData $tr

$lcNumber = $('#id_lc_number').val(clirecDataObj.lcNumber)

$('#id_estb_amt_text').val clirecDataObj.amount
$('#id_estb_amt').val kanmii.formattedToNumber clirecDataObj.amount
$('#id_claim_amt_text').val '0.00'
$('#id_claim_amt').val 0.00
$('#id_surplus_amt_text').val(clirecDataObj.amount).prop 'readonly', true
$('#id_surplus_amt').val kanmii.formattedToNumber clirecDataObj.amount
$('#id_clirec_id').val clirecDataObj.id

$undrawnNostro = $('#id_nostro').val clirecUploadUtils.nostroObj.id
$undrawnNostro.attr 'data-plugin-options', clirecUploadUtils.setPluginInitialVal
                                              $el: $undrawnNostro
                                              text: clirecUploadUtils.nostroObj.number
                                              id: clirecUploadUtils.nostroObj.id

lcNumberIsCorrect = -> $lcNumber.val() and $lcNumber.val().length > 12
customerIsCorrect = -> /^[1-9]\d*$/.test $('#id_customer').val()

$('#clirec-modal-lcundrawnbalance-form').on
    'submit': (evt) ->
      evt.preventDefault()

      if not lcNumberIsCorrect() or not customerIsCorrect()
        return window.alert "Lc Number/Customer name not set or incorrect."

      $.ajax
        url: clirecUploadUtils.getModalActionUrl 'lcundrawnbalance'
        data: $(this).serialize()
        type: 'POST'
        dataType: 'json'
        success: (resp) -> processSucceeds $tr, resp
        error: (resp) ->
          alertModal 'Create Undrawn Balance fails = '
          console.log resp

$(window).trigger('init-autocomplete')
