do ->
  $lcAvailForm = $('#clirec-modal-availment-form')
  memoAcctText = ''

  $lcAvailForm.on
    'added': (evt, pk, uiItem) -> memoAcctText = uiItem.label
    'killed': -> memoAcctText = ''

    '#id_memo_acct_on_deck'

  $tr = $($rowChkBoxSelector).filter(':checked').parents('tr')

  clirecDataObj = getClirecData $tr

  $lcNumber = $('#id_lc_number').val(clirecDataObj.lcNumber)

  $('#id_date_negotiated').val clirecDataObj.valDate
  $('#id_drawn_amt_text').val clirecDataObj.amount
  $('#id_drawn_amt').val kanmii.formattedToNumber clirecDataObj.amount
  $('#id_clirec_id').val clirecDataObj.id
  $('#id_dr_cr').val clirecDataObj.drCr
  $('#id_flex_swift').val clirecDataObj.swiftFlex

  $nostroAcct = $('#id_nostro_acct').val clirecUploadUtils.nostroObj.id
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

  $('#id_lc_avail_clirec_detail').val summaryText

  lcNumberIsCorrect = -> $lcNumber.val() and $lcNumber.val().length > 12

  memoAcctIsCorrect = ->
    return false unless $memoAcct.val() is String clirecUploadUtils.nostroObj.defaultMemoAcct.id
    return false unless /^\d+$/.test($memoAcct.val())
    ccy = /MCSH-?([A-Z]{3})/i.exec memoAcctText
    return false if not ccy or ccy[1] isnt clirecUploadUtils.nostroObj.ccy
    true

  dataIsCorrect = -> lcNumberIsCorrect() and memoAcctIsCorrect()

  $lcAvailForm.on
      'submit': (evt) ->
        evt.preventDefault()
        $el = $ this

        if not dataIsCorrect()
          return window.alert "Lc Number/Memo account not set or incorrect."

        $.ajax
          url: clirecUploadUtils.getModalActionUrl 'availment'
          data: $el.serialize()
          type: 'POST'
          dataType: 'json'
          success: (resp) ->
            # resp.form_errors = true implies that the server could not validate
            # the submitted form.
            resp.summaryText = summaryText unless resp.form_errors
            processSucceeds $tr, resp
          error: (resp) ->
            window.alert 'availment fails.\nCheck console for details.'
            console.log 'availment fails = ', resp.responseText or resp

$(window).trigger('init-autocomplete')
