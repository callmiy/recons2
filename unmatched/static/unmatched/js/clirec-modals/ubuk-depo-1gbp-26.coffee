$ ->
  {rows, ids, netAmt,
   absNetAmtFormatted,
   selectionSummary} = selectedClirecsEnum()

  $('#id_clirec_ids').val ids.join ','
  $("#id_manual_post_amount").val Math.abs netAmt

  $('#id_dr_acct_text').val(
    clirecUploadUtils.nostroObj.ledger_acct.number).addClass 'nostro-ledger'
  $('#id_dr_acct').val clirecUploadUtils.nostroObj.ledger_acct.id

  $('#id_posting_enum').val _.template("""
                <%=selectionSummary%>

                %tab%DR%tab%<%-drAcct%>%tab%<%-absNetAmtFormatted%>
                %tab%CR%tab%<%-crAcct%>%tab%<%-absNetAmtFormatted%>
                """,
                selectionSummary: selectionSummary
                absNetAmtFormatted: absNetAmtFormatted
                drAcct: clirecUploadUtils.nostroObj.ledger_acct.number
                crAcct: $('#id_cr_acct_text').val()
                ).replace /%tab%/g, '\t'

  $('#clirec-modal-ubuk-depo-1gbp-26-form').submit (evt) ->
    evt.preventDefault()

    $.ajax
      url : clirecUploadUtils.getModalActionUrl 'ubuk-depo-1gbp-26'
      data: $(this).serialize()
      type: 'post'
      dataType: 'json'
      success: (resp) ->
        setSuccessMessage resp
        setRowComment(rows[id], resp.comment) for id in resp.ids
      error: (resp) -> console.log resp