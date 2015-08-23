do ->
  acctIsValid = false

  {rows, ids, netAmt, absNetAmtFormatted, selectionSummary} = selectedClirecsEnum()
  $('#id_clirec_ids').val ids.join ','
  $("#id_manual_post_amount").val Math.abs netAmt

  drAcct = ''
  crAcct = ''
  $dr = $('#id_dr_acct')
  $cr = $('#id_cr_acct')
  $drText = $('#id_dr_acct_text')
  $crText = $('#id_cr_acct_text')
  $manualPostForm = $('#clirec-modal-manual-posting-form')
  $manualPostNarr = $ '#id_manual_post_narration'
  $manualPostBatch = $ '#id_manual_post_batch_no'
  $submitBtn = $ '#create-manual-post-btn'
  $manualPostChker = $ '#id_create_manual_post'

  if netAmt < 0
    $crText.val(clirecUploadUtils.nostroObj.ledger_acct.number).prop('readonly', true).addClass 'nostro-ledger'
    $cr.val(clirecUploadUtils.nostroObj.ledger_acct.id)
    $drText.removeClass 'nostro-ledger'
    $dr.val ''
    crAcct = clirecUploadUtils.nostroObj.ledger_acct.number
  else
    $drText.val(clirecUploadUtils.nostroObj.ledger_acct.number).prop('readonly', true).addClass 'nostro-ledger'
    $dr.val(clirecUploadUtils.nostroObj.ledger_acct.id)
    $crText.removeClass 'nostro-ledger'
    $cr.val ''
    drAcct = clirecUploadUtils.nostroObj.ledger_acct.number

  $postInfoDisplay = $('#id_posting_enum').val _.template("""
                          <%=selectionSummary%>

                          %tab%DR%tab%<%-drAcct%>%tab%<%-absNetAmtFormatted%>
                          %tab%CR%tab%<%-crAcct%>%tab%<%-absNetAmtFormatted%>
                          %tab%NARRATION:

                          %tab%%tab%BATCH
                          """,
                          selectionSummary: selectionSummary
                          absNetAmtFormatted: absNetAmtFormatted
                          drAcct: drAcct
                          crAcct: crAcct).replace /%tab%/g, '\t'


  setAcctInfoDisplay = (drCr, newVal) ->
    val = $postInfoDisplay.val()
    if drCr is 'D'
      $postInfoDisplay.val val.replace(
        new RegExp("\tDR\t.*\t#{absNetAmtFormatted}"),
        "\tDR\t#{newVal}\t#{absNetAmtFormatted}")
    else
      $postInfoDisplay.val val.replace(
        new RegExp("\tCR\t.*\t#{absNetAmtFormatted}"),
        "\tCR\t#{newVal}\t#{absNetAmtFormatted}")

  setAcctOnDecPpty = ($el) ->
    unless $el.prop('id').indexOf('id_dr_acct') is -1
      notation = 'Debit'
      flag = 'D'
    else
      notation = 'Credit'
      flag = 'C'
    notation: notation, flag: flag


  isValidManualNarr = ->
    if $manualPostChker.prop('checked')
      if not /^\d{4}$/.test($manualPostBatch.val()) or $manualPostNarr.val().length < 3
        return false
    true

  checkAndEnableSubmitBtn = ->
    idRegexp = /^\d+$/
    numManualChkers = $manualPostForm.find('input[type=checkbox]:checked').size()
    if idRegexp.test($cr.val()) and idRegexp.test($dr.val()) \
        and numManualChkers >= 1 and isValidManualNarr()
      $submitBtn.prop 'disabled', false
    else $submitBtn.prop 'disabled', true

  $manualPostForm.on
    'killed': (evt) ->
      {flag} = setAcctOnDecPpty $ this
      setAcctInfoDisplay flag, ''
      checkAndEnableSubmitBtn()
      acctIsValid = false

    'added': (evt, pk, uiItem) ->
      $el = $(this)
      {notation, flag} = setAcctOnDecPpty $el
      contraAcct = uiItem.label

      if contraAcct is clirecUploadUtils.nostroObj.ledger_acct.number or not new RegExp(clirecUploadUtils.nostroObj.ccy).test contraAcct
        window.alert("Wrong #{notation} Account.\nPlease select a valid ledger account.")
        $el.children().remove()
        return $el.trigger('killed')

      setAcctInfoDisplay flag, contraAcct
      checkAndEnableSubmitBtn()
      acctIsValid = true

    'div[id$=_on_deck]'

  $manualPostForm.on
    'change': (evt) ->
      if this is $manualPostBatch[0] and $manualPostBatch.val()
        $postInfoDisplay.val (index, oldVal) ->
          oldVal.replace /\t\tBATCH\s*\d*\s*/, "\t\tBATCH #{$manualPostBatch.val()}"

      else if this is $manualPostNarr[0] and $manualPostNarr.val()
        $postInfoDisplay.val (index, oldVal) ->
          oldVal.replace /\tNARRATION:.*\n/, "\tNARRATION:\t#{$manualPostNarr.val()}\n"

      checkAndEnableSubmitBtn()

    '.manual-post-rqd'

  $manualPostForm.on
    'change': (evt) ->
      if this is $manualPostChker[0]
        if $(this).prop 'checked'
          $manualPostNarr.parents('.form-group').fadeIn()
          $manualPostBatch.parents('.form-group').fadeIn()
        else
          $manualPostNarr.val('').parents('.form-group').hide()
          $manualPostBatch.val('').parents('.form-group').hide()

      checkAndEnableSubmitBtn()

    'input[type=checkbox]'

  manualPostChkBoxesValid = ->
    $('#id_update_manual_post_comment').prop('checked') or $('#id_create_manual_post').prop('checked')

  okToPost = () ->
    if $manualPostChker.prop('checked') and not /BATCH\s*\d{4}/.test $postInfoDisplay.val()
      $submitBtn.prop 'disabled', true
      return window.alert 'You must specify a batch number.'

    unless acctIsValid
      $submitBtn.prop 'disabled', true
      return window.alert 'Account is not valid'

    unless manualPostChkBoxesValid()
      return window.alert 'You must select one of "update comment" or "post" or both.'
    true


  $manualPostForm.submit (evt) ->
    evt.preventDefault()
    if okToPost()
      $.ajax
        url : clirecUploadUtils.getModalActionUrl 'manual-postings'
        data: $(this).serialize()
        type: 'post'
        dataType: 'json'
        success: (resp) ->
          setSuccessMessage resp
          setRowComment(rows[id], resp.comment) for id in resp.ids
        error: (resp) -> console.log resp

$(window).trigger('init-autocomplete')
