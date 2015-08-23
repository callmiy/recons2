$tr = $($rowChkBoxSelector).filter(':checked').parents('tr')

clirecDataObj = getClirecData $tr

$lcNumber = $('#id_lc_number').val(clirecDataObj.lcNumber)
$customer = $('#id_customer')

$('#id_amount_text').val clirecDataObj.amount
$('#id_amount').val kanmii.formattedToNumber clirecDataObj.amount
$('#id_clirec_details').val clirecDataObj.clirecDetails
$('#id_clirec_id').val clirecDataObj.id
$('#id_val_date_dr').val clirecDataObj.valDate

$crAcct = $ '#id_cr_acct'
$crAcct.val clirecUploadUtils.nostroObj.id
$crAcct.attr 'data-plugin-options', clirecUploadUtils.setPluginInitialVal(
  $el: $crAcct, text: clirecUploadUtils.nostroObj.number, id: clirecUploadUtils.nostroObj.id)

lcNumberIsCorrect = -> $lcNumber.val() and $lcNumber.val().length > 12
customerIsCorrect = -> /^\d+$/.test $customer.val()
dataIsCorrect = -> lcNumberIsCorrect()  and customerIsCorrect()

$('#clirec-modal-charge-form').on
    'submit': (evt) ->
      evt.preventDefault()
      $el = $ this

      if not dataIsCorrect()
        return window.alert 'Customer or LC Number not correct.'

      $.ajax
        url: clirecUploadUtils.getModalActionUrl 'charge'
        data: $el.serialize()
        type: 'POST'
        dataType: 'json'
        success: (resp) -> processSucceeds $tr, resp
        error: (resp) -> console.log 'charge creation fails: ', resp

$(window).trigger('init-autocomplete')
