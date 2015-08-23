$ ->
  {rows, ids, netAmt,
   absNetAmtFormatted,
   selectionSummary} = selectedClirecsEnum()

  $drAcctText = $ '#id_dr_acct_text'
  $crAcctText = $('#id_cr_acct_text')

  $('#id_clirec_ids').val ids.join ','
  $("#id_manual_post_amount").val Math.abs netAmt
  $('#id-amount-taken').val netAmt
  $("#id-memo-acct").val clirecUploadUtils.nostroObj.defaultMemoAcct.id
  $('#id-contra-acct').val clirecUploadUtils.nostroObj.ledger_acct.id

  if netAmt < 0
    $crAcctText.val(
      clirecUploadUtils.nostroObj.ledger_acct.number).addClass 'nostro-ledger'

    $('#id_cr_acct').val clirecUploadUtils.nostroObj.ledger_acct.id

    $drAcctText.val clirecUploadUtils.nostroObj.defaultMemoAcct.number
    $('#id_dr_acct').val clirecUploadUtils.nostroObj.defaultMemoAcct.id
  else
    $drAcctText.val(
      clirecUploadUtils.nostroObj.ledger_acct.number).addClass 'nostro-ledger'

    $('#id_dr_acct').val clirecUploadUtils.nostroObj.ledger_acct.id

    $crAcctText.val clirecUploadUtils.nostroObj.defaultMemoAcct.number
    $('#id_cr_acct').val clirecUploadUtils.nostroObj.defaultMemoAcct.id

  $('#id_posting_enum').val _.template("""
                <%=selectionSummary%>

                %tab%DR%tab%<%-drAcct%>%tab%<%-absNetAmtFormatted%>
                %tab%CR%tab%<%-crAcct%>%tab%<%-absNetAmtFormatted%>
                """,
                selectionSummary: selectionSummary
                absNetAmtFormatted: absNetAmtFormatted
                drAcct: $drAcctText.val()
                crAcct: $crAcctText.val()
                ).replace /%tab%/g, '\t'

  $narr = $ '#id_manual_post_narration'

  $('#clirec-modal-taken-to-memo-form').submit (evt) ->
    evt.preventDefault()
    return alert "Please provide narration" if $narr.val().length < 3

    $.ajax
      url : clirecUploadUtils.getModalActionUrl 'take-to-memo'
      data: $(this).serialize()
      type: 'post'
      dataType: 'json'
      success: (resp) ->
        # return console.log resp
        setSuccessMessage resp
        setRowComment(rows[id], resp.comment) for id in resp.ids
      error: (resp) -> alert resp