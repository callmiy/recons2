tbodyHtml = null
selectedClirecsEnum = null

do ->
  trTemplateFunc = _.template("""
    <tr
      id="tr-id-<%-instance.id%>"
      data-created-on="<%-instance.date_first_uploaded%>"
      data-url="<%=instance.url%>"
      class="clirec-instance tr-<%-instance.dr_cr%>-<%-instance.swift_flex%>
            <%if (instance.date_upload_processed) print('processed');%>
            <%if (instance.comment) print('commented');%>"

      <%if (instance.comment) {%>
        data-toggle="tooltip" data-placement="bottom" title="<%-instance.comment%>"
      <%}%>

      <%if (instance.clirec_obj) {%>
        data-related-object="<%- JSON.stringify({
              clirec_obj: instance.clirec_obj,
              content_type: instance.content_type,
              object_id: instance.object_id
        })%>"
      <%}%> >

      <td class="tr-meta-info">
        <input type="checkbox" class="<%-instance.dr_cr%>-<%-instance.swift_flex%>">
        <input type="hidden" id="d-c" value="<%-instance.dr_cr%>">
        <input type="hidden" id="s-f" value="<%-instance.swift_flex%>">
      </td>

      <td class="post-date date">
        <input type="hidden" value="<%-instance.post_date%>"><%-dateMonText(instance.post_date)%>
      </td>

      <td class="valdate date">
        <input type="hidden" value="<%-instance.valdate%>"><%-dateMonText(instance.valdate)%>
      </td>

      <td class="lc-number"><%-instance.lc_number%></td>
      <td class="amount"><%-kanmii.numberFormat(instance.amount)%></td>

      <td class="clirec-details">
          <textarea readonly="true" class="details"><%-instance.details%></textarea>
          <textarea readonly="true" class="comment" style="display: none"><%-instance.comment%></textarea>
      </td>

      <td class="date date-processed"><%-dateMonText(instance.date_upload_processed)%></td>
    </tr>
    """)

  displayTemplateFunc = _.template("""
    <%if (!_.isEmpty(clirecDrSw)){%>
      <tr class="clirec-display header" id="D-S">
        <td><input id="d-s-chk-all" type="checkbox"/></td>
        <td colspan="5">
          OUTSTANDING DEBITS IN SWIFT&nbsp;&nbsp; <%-clirecDrSw.length%> item(s)
        </td>
        <td class="toggle-hide-clirec-rows-D-S">Toggle Visibility</td>
      </tr>

      <%_.each(clirecDrSw, function(instance) {%>
          <%print(trTemplateFunc({instance: instance}));%>
        <%});
      %>
    <%}%>

    <%if (!_.isEmpty(clirecCrSw)){%>
      <tr class="clirec-display header" id="C-S">
        <td><input id="c-s-chk-all" type="checkbox"/></td>
        <td colspan="5">
          OUTSTANDING CREDITS IN SWIFT&nbsp;&nbsp; <%-clirecCrSw.length%> item(s)
        </td>
        <td class="toggle-hide-clirec-rows-C-S">Toggle Visibility</td>
      </tr>

      <%_.each(clirecCrSw, function(instance) {%>
          <%print(trTemplateFunc({instance: instance}));%>
        <%});
      %>
    <%}%>

    <%if (!_.isEmpty(clirecDrFc)){%>
      <tr class="clirec-display header" id="D-F">
        <td><input id="d-f-chk-all" type="checkbox"/></td>
        <td colspan="5">
          OUTSTANDING DEBITS IN FLEXCUBE&nbsp;&nbsp; <%-clirecDrFc.length%> item(s)
        </td>
        <td class="toggle-hide-clirec-rows-D-F">Toggle Visibility</td>
      </tr>

      <%_.each(clirecDrFc, function(instance) {%>
          <%print(trTemplateFunc({instance: instance}));%>
        <%});
      %>
    <%}%>

    <%if (!_.isEmpty(clirecCrFc)){%>
      <tr class="clirec-display header" id="C-F">
        <td><input id="c-f-chk-all" type="checkbox"/></td>
        <td colspan="5">
          OUTSTANDING CREDITS IN FLEXCUBE&nbsp;&nbsp; <%-clirecCrFc.length%> item(s)
        </td>
        <td class="toggle-hide-clirec-rows-C-F">Toggle Visibility</td>
      </tr>

      <%_.each(clirecCrFc, function(instance) {%>
          <%print(trTemplateFunc({instance: instance}));%>
        <%});
      %>
    <%}%>
  """)

  tbodyHtml = (data) ->
    displayTemplateFunc
      trTemplateFunc: trTemplateFunc
      clirecDrSw: (c for  c in data when  c.dr_cr is 'D' and c.swift_flex is 'S')
      clirecCrSw: (c for  c in data when  c.dr_cr is 'C' and c.swift_flex is 'S')
      clirecDrFc: (c for  c in data when  c.dr_cr is 'D' and c.swift_flex is 'F')
      clirecCrFc: (c for  c in data when  c.dr_cr is 'C' and c.swift_flex is 'F')


do ->
  selectedTemplateFunc = _.template("""
    RECONCILIATION OF  <%-clirecUploadUtils.nostroObj.name%> A/C <%-clirecUploadUtils.nostroObj.ledger_acct.number%>
    STMT A/C- <%-clirecUploadUtils.nostroObj.number%> AS AT <%=new Date().strftime('%d-%b-%Y')%> CURRENCY - <%- clirecUploadUtils.nostroObj.ccy %>

    Post Date%tab%Value Date%tab%Details%tab%Amount

    <% if (postInfoObj.crSwift.length){ %>
    OUTSTANDING CREDITS IN SWIFT <% _.each(postInfoObj.crSwift, function(obj) { %>
    <%=new Date(obj.postDate).strftime('%b %d, %Y')%>%tab%<%=new Date(obj.valDate).strftime('%b %d, %Y')%>%tab%<%-obj.details%>%tab%<%-obj.amount%> <% }); %> <% } %>

    <% if (postInfoObj.crFlex.length){ %>
    OUTSTANDING CREDITS IN FLEXCUBE <% _.each(postInfoObj.crFlex, function(obj) { %>
    <%=new Date(obj.postDate).strftime('%b %d, %Y')%>%tab%<%=new Date(obj.valDate).strftime('%b %d, %Y')%>%tab%<%-obj.details%>%tab%<%-obj.amount%> <% }); %> <% } %>

    <% if (postInfoObj.drSwift.length){ %>
    OUTSTANDING DEBITS IN SWIFT <% _.each(postInfoObj.drSwift, function(obj) { %>
    <%=new Date(obj.postDate).strftime('%b %d, %Y')%>%tab%<%=new Date(obj.valDate).strftime('%b %d, %Y')%>%tab%<%-obj.details%>%tab%<%-obj.amount%> <% }); %> <% } %>

    <% if (postInfoObj.drFlex.length){ %>
    OUTSTANDING DEBITS IN FLEXCUBE <% _.each(postInfoObj.drFlex, function(obj) { %>
    <%=new Date(obj.postDate).strftime('%b %d, %Y')%>%tab%<%=new Date(obj.valDate).strftime('%b %d, %Y')%>%tab%<%-obj.details%>%tab%<%-obj.amount%> <% }); %> <% } %>

    %tab%%tab%Total%tab%<%-netAmtFormatted%>
  """)

  selectedClirecsEnum = () ->
    postDrAmount = 0
    postCrAmount = 0
    postInfoObj =
      crSwift: []
      crFlex: []
      drSwift: []
      drFlex: []

    {rows, ids} = getCheckedRowsInfo getChecked()[0]
    for id in ids
      {amount, drCr, swiftFlex, clirecDetails, valDate, postDate} = getClirecData rows[id]

      data =
        details: clirecDetails
        valDate: valDate
        postDate: postDate

      if drCr is 'D'
        data.amount = "-#{amount}"
        postDrAmount += kanmii.formattedToNumber amount

        if swiftFlex is 'S'
          postInfoObj.drSwift.push data
        else postInfoObj.drFlex.push data

      else
        data.amount = amount
        postCrAmount += kanmii.formattedToNumber amount

        if swiftFlex is 'S'
          postInfoObj.crSwift.push data
        else postInfoObj.crFlex.push data

    netAmt = postCrAmount - postDrAmount
    netAmtFormatted = kanmii.numberFormat netAmt
    absNetAmtFormatted = netAmtFormatted.replace /^-/, ''

    selectionSummary = selectedTemplateFunc(
      postInfoObj: postInfoObj
      netAmtFormatted: netAmtFormatted
    ).replace(/%tab%/g, '\t'
    ).replace(/[\n\s]+OUTSTANDING CREDITS IN SWIFT/mg, '\n\nOUTSTANDING CREDITS IN SWIFT'
    ).replace(/[\n\s]+OUTSTANDING DEBITS IN SWIFT/mg, '\n\nOUTSTANDING DEBITS IN SWIFT'
    ).replace(/[\n\s]+OUTSTANDING CREDITS IN FLEXCUBE/mg, '\n\nOUTSTANDING CREDITS IN FLEXCUBE'
    ).replace(/[\n\s]+OUTSTANDING DEBITS IN FLEXCUBE/mg, '\n\nOUTSTANDING DEBITS IN FLEXCUBE'
    ).replace(new RegExp("[\\n\\s]+\\t\\tTotal\\s+#{netAmtFormatted}"), "\n\n\t\Total\t\t#{netAmtFormatted}"
    ).replace(/[\s\n]+Post Date\tValue Date/, '\n\nPost Date\tValue Date'
    )

    netAmt: netAmt
    rows: rows
    ids: ids
    selectionSummary: selectionSummary
    absNetAmtFormatted: absNetAmtFormatted
