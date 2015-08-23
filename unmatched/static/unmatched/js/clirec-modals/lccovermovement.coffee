do ->
  $lcCoverMvmtForm = $('#clirec-modal-lccovermovement-form')
  memoAcctText = ''

  $lcCoverMvmtForm.on
    'added': (evt, pk, uiItem) -> memoAcctText = uiItem.label
    'killed': -> memoAcctText = ''

    '#id_memo_acct_on_deck'

  $tr = $($rowChkBoxSelector).filter(':checked').parents('tr')

  clirecDataObj = getClirecData $tr

  $lcNumber = $('#id_lc_number').val(clirecDataObj.lcNumber)
  $('#id_amount_text').prop('readonly', true).val clirecDataObj.amount
  $('#id_amount').val kanmii.formattedToNumber clirecDataObj.amount
  $('#id_clirec_id').val clirecDataObj.id

  $nostroAcct = $('#id_acct')
  $nostroAcct.attr 'data-plugin-options', clirecUploadUtils.setPluginInitialVal
                                            $el: $nostroAcct
                                            text: clirecUploadUtils.nostroObj.number
                                            id: clirecUploadUtils.nostroObj.id

  $memoAcct = $('#id_memo_acct')
  $memoAcct.attr 'data-plugin-options', clirecUploadUtils.setPluginInitialVal
                                          $el: $memoAcct
                                          text: clirecUploadUtils.nostroObj.defaultMemoAcct.number
                                          id: clirecUploadUtils.nostroObj.defaultMemoAcct.id
  summaryText = do ->
    {absNetAmtFormatted, selectionSummary} = selectedClirecsEnum()
    if clirecDataObj.drCr is 'D'
      drAcct = memoAcctText
      crAcct = clirecUploadUtils.nostroObj.ledger_acct.number
    else
      drAcct = clirecUploadUtils.nostroObj.ledger_acct.number
      crAcct = memoAcctText

     _.template("""
      <%=selectionSummary%>

      %tab%DR%tab%<%-drAcct%>%tab%<%-absNetAmtFormatted%>
      %tab%CR%tab%<%-crAcct%>%tab%<%-absNetAmtFormatted%>""",
      drAcct: drAcct
      crAcct: crAcct
      selectionSummary: selectionSummary
      absNetAmtFormatted: absNetAmtFormatted).replace /%tab%/g, '\t'

  $('#id_lc_cvmvmt_clirec_detail').val summaryText

  lcNumberIsCorrect = -> $lcNumber.val() and $lcNumber.val().length > 12

  memoAcctIsCorrect = ->
    return true if $memoAcct.val() is clirecUploadUtils.nostroObj.defaultMemoAcct.id
    return false if not /^\d+$/.test($('#id_memo_acct').val())
    ccy = /MCSH-?([A-Z]{3})/i.exec $('#id_memo_acct_on_deck>div').text()
    return false if not ccy or ccy[1] isnt clirecUploadUtils.nostroObj.ccy
    true

  dataIsCorrect = -> lcNumberIsCorrect() and memoAcctIsCorrect()

  $lcCoverMvmtForm.on
    'submit': (evt) ->
      evt.preventDefault()

      if not dataIsCorrect()
        return window.alert "Lc Number/Memo account not set or incorrect."
      else
        $.ajax
          url: clirecUploadUtils.getModalActionUrl 'lccovermovement'
          data: $(this).serialize()
          type: 'POST'
          dataType: 'json'
          success: (resp) ->
            # resp.form_errors = true implies that the server
            # could not validate the submitted form.
            resp.summaryText = summaryText unless resp.form_errors
            processSucceeds $tr, resp
          error: (resp) -> console.log 'Posting for cover movement fails = ', resp

$(window).trigger('init-autocomplete')
