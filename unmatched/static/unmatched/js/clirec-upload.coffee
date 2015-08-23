clirecUpload = {}

# show the "display" tab
$displayTab = $('#clarec-tab a:last').tab 'show'

# textarea where user copies and pastes data that will be uploaded to server
$uploadTextArea = $ "#clarec-upload-data-text"
$tbody = $ "tbody"

$modal = $ '#unmatched-clirec-modal'

# the checkbox which indicates that a row has been selected
$rowChkBoxSelector = 'tr[id^=tr-id-]>td>input[type=checkbox]'
$('table').checkOneAll '.D-S', '#d-s-chk-all'
$('table').checkOneAll '.C-S', '#c-s-chk-all'
$('table').checkOneAll '.D-F', '#d-f-chk-all'
$('table').checkOneAll '.C-F', '#c-f-chk-all'

$('table').on
  'click': ->
    tag = /toggle-hide-clirec-rows-([A-Z-]+)/.exec($(this).prop('class'))[1]
    $("tr.clirec-instance.tr-#{tag}").toggle().find(
      "input[type=checkbox]").prop('checked', false).trigger 'change'

  'td[class^=toggle-hide-clirec-rows-]'

# select input control to choose a nostro
$displayedNostroSelector = $ 'select#nostro'

# select input for recons actions
$reconsActionSelector = $ '#id_recons_actions'

$runReconsAction = $('#run-recons-action-btn')
# recons actions select input was interacted with

$reconsActionSelector.on(
  'change': (evt) ->
    if $(this).val()
      $runReconsAction.prop 'disabled', false
    else
      $runReconsAction.prop 'disabled', true
)

# reset the action selector
resetActionSelector = -> $reconsActionSelector.val('').prop('disabled', true).trigger 'change'

# nostro jquery object and selector
$displayedNostro = $ '#id_clirec_nostro'
nostroTextSelector = '#id_clirec_nostro_on_deck>div'
nostroSelectedIndicator = '#kill_undefinedid_clirec_nostro'

# remove table rows containing clirec records.
removeTrs = -> $tbody.children().remove()


# display total number of clirec instances currently displayed
updateInstanceTotal = ->
  $('.clirec-instance-total').text 'Total: 0'
  totalInstances = $('.clirec-instance').size()
  $('.clirec-instance-total').text "Total: #{totalInstances}"

$clirecDownloadBtn = $ '.clarec-download'
$clirecUploadBtn = $ '#clirec-upload-btn'

disableCtrls = (flag)->
  $clirecUploadBtn.prop 'disabled', flag
  $clirecDownloadBtn.prop 'disabled', flag
  $uploadTextArea.prop 'disabled', flag


$('#id_clirec_nostro_wrapper').on
  'killed': (evt) ->
    removeTrs()
    updateInstanceTotal()
    resetActionSelector()
    disableCtrls true

  'added': (evt) ->
    disableCtrls false
    if clirecUploadUtils.nostroObj is undefined or \
        clirecUploadUtils.nostroObj.id isnt $displayedNostro.val()
      removeTrs()
      updateInstanceTotal()
      resetActionSelector()
      clirecUploadUtils.setNostroObj $displayedNostro.val()

  '#id_clirec_nostro_on_deck'


# strip clirec data, for upload, of white space when textarea loses focus
$uploadTextArea.on
    'focusout': (evt) ->
      $(this).val (index, oldVal) -> kanmii.strip oldVal

# when clirec details textarea is double clicked, reveal
# comment textarea
$tbody.on
  'dblclick': (evt) -> $(this).hide().siblings('.comment').show()
  ,
  '.clirec-details>.details'


# get clirec data from a row
getClirecData = ($row) ->
  $tds = $row.children()
  data =
    id: /\d+$/.exec($row.prop('id'))[0]
    amount: $tds.filter('.amount').text()
    valDate: $tds.filter('.valdate').children('input').val()
    postDate: $tds.filter('.post-date').children('input').val()
    lcNumber: $tds.filter('.lc-number').text()
    clirecDetails: $tds.filter('.clirec-details').children('.details').val()
    drCr: $tds.filter('.tr-meta-info').children('#d-c').val()
    swiftFlex: $tds.filter('.tr-meta-info').children('#s-f').val()

# return a date in the format dd-mmm-yyyy
dateMonText = (dateString) ->
  return null unless dateString
  new Date(dateString).strftime '%d-%b-%Y'


setRowComment = ($row, comment) ->
  $row.find('.comment').val comment
  $row.addClass 'commented'
  .removeAttr 'title'
  .attr
    'data-toggle': "tooltip"
    'data-placement': "bottom"
    'title': comment


setRowRelatedObj = ($tr, record) ->
  setRowComment($tr, record.comment) if record.comment

  # if the record's related object has been set, update row accordinly.
  if record.clirec_obj
    $tr.attr
      'data-related-object': JSON.stringify
                                clirec_obj: record.clirec_obj
                                content_type: record.content_type
                                object_id: record.object_id

downloadRecords = ->
    removeTrs()
    resetActionSelector()

    $.get "#{clirecUtilUrls.clirecUploadUrl}?nostro=#{clirecUploadUtils.nostroObj.id}&show=True"

     .done (resp) ->
      $displayTab.tab 'show'
      return window.alert('No record to display.') if not resp.length
      $tbody.html tbodyHtml resp
      updateInstanceTotal()

     .fail (resp) ->
      window.alert 'Download failed'
      console.log resp


uploadRecords = (dataArray) ->
    # @dataArray: Array of the form [object, object..]
    $.ajax
      url: clirecUtilUrls.clirecUploadUrl
      type: 'POST'
      contentType: "application/json; charset=utf-8"
      dataType: "json"
      data: JSON.stringify dataArray

     .done (resp) ->
      window.alert('No record uploaded. May be no new records.') if not resp.length
      downloadRecords()

     .fail (resp) ->
      window.alert 'Upload failed. Check console for error details.'
      console.log resp


# click to upload data to the server
$clirecUploadBtn.on
    "click": (evt) ->
      evt.preventDefault()
      [malformedData, correctData] = clirecUploadUtils.parseUploadText(
          kanmii.strip($uploadTextArea.val()))
      if malformedData instanceof Error
        $uploadTextArea[0].scrollTop = 0
        [nostroNameInText, nostroNumberInText] = correctData
        window.alert """
          Invalid Nostro!
          Selected account: #{clirecUploadUtils.nostroObj.number} | #{clirecUploadUtils.nostroObj.name}

          Account in upload text: #{nostroNumberInText} | #{nostroNameInText}
          """
      else if malformedData.length
        window.alert "malformedData\n", malformedData
      else
        uploadRecords correctData

      $uploadTextArea.val ''


$clirecDownloadBtn.click (evt) -> downloadRecords()

# get checked checkboxes
getChecked = -> $($rowChkBoxSelector).filter(':checked')

# activate action selector only when row/rows is/are selected/checked
$tbody.on(
  'change': (evt) ->
    $el = $ this
    $tr = $el.parents 'tr'
    if $el.prop('checked')
      $tr.addClass('selected')
      $reconsActionSelector.prop 'disabled', false
    else
      $tr.removeClass 'selected'
      $tr.find('.comment').hide()
      $tr.find('.details').show()
      resetActionSelector() if not getChecked().size()
  ,
  $rowChkBoxSelector
)


# patch record with given data
patchRec = (url, data) ->
  $.ajax
    url: url
    type: 'POST'
    dataType: "json"
    headers: 'X-CSRFToken': csrftoken, 'X-HTTP-METHOD-OVERRIDE': 'PATCH'
    data: data

modalTemplateFunc = _.template $('#clirec-modal-template').html()
alertModal = (msg) ->
  $modal.find('.modal-content').html modalTemplateFunc modalContent: msg
  $('#unmatched-clirec-modal').modal 'show'


# make comment textarea editable or not
# currentComment is the value of comment when we dblclick. we cache this so we only
# patch comment when it is edited
currentComment = ''
$tbody.on
    'dblclick': (evt) ->
      currentComment = kanmii.strip $(this).prop('readonly', false).val()

    'focusout': (evt) ->
      $el = $(this).prop 'readonly', true
      comment = kanmii.strip $el.val()
      $el.val(comment) #I need to do this in case only white-space and new-lines were added.
      if comment and comment isnt currentComment
        $tr = $el.parents('tr')

        patchRec $tr.data('url'), comment: comment
        .done (resp) -> setRowComment $tr, comment
        .fail (resp) ->
          alertModal 'patch of comment failed. Check console for error details.'
          console.log 'patch of comment failed: ', resp

      # always reset currentComment
      currentComment = ''

    ,
    'textarea.comment'

# make lc number tds editable or not
currentLCNumber = ''
$tbody.on
    'dblclick': (evt) ->
      currentLCNumber = $(this).prop('contenteditable', true).text()

    'focusout': (evt) ->
      $el = $(this).prop 'contenteditable', false
      lcNumber = kanmii.strip $el.text()
      $el.text lcNumber
      if lcNumber and currentLCNumber isnt lcNumber
        patchRec $el.parents('tr').data('url'), lc_number: lcNumber
        .done (resp) ->
          alertModal "Clirec reference '#{resp.lc_number}' updated."
        .fail (resp) ->
          alertModal 'Clirec reference update failed.\nCheck console for error details.'
          console.log resp

      # always reset currentLCNumber
      currentLCNumber = ''
    ,
    '.lc-number:not(th)'

# modal dialog event
$('body').on(
    'loaded.bs.modal': (evt) ->
      $this = $ this
      formName = $this.data('bs.modal').options.formName

      # TODO: make the script returned by this ajax call
      # register its entry point in an object
      # the key is the filename, value is script's entry point look for
      # key in object. if there, call entry point else make ajax call for
      # script.
      $.ajax
        url: "/static/unmatched/js/clirec-modals/#{formName}.js"
        dataType: 'script'
        cache: true
        success: (data)-> $this.modal show: true


    'hidden.bs.modal': (evt) ->
      $el = $ this
      $el.removeData('bs.modal').find('.modal-content').children().remove()

    ,
    '#unmatched-clirec-modal'
  )

clirecUpload.deleteRecords = (rowObj, ids, url) ->
  # delete action was selected

  rec = if ids.length is 1 then 'record' else 'records'
  if window.confirm "Are you sure you want to delete selected #{ids.length} #{rec}?"
    $.ajax(
      url: url
      type: 'POST'
      dataType: "json"
      headers:
        'X-CSRFToken': csrftoken
        'X-HTTP-METHOD-OVERRIDE': 'DELETE'
      data: JSON.stringify multiple_delete_ids: ids
      contentType: "application/json; charset=utf-8"
    ).done( (resp) ->
      len_records = resp.deleted_ids.length
      msg = if len_records is 1 then 'record' else 'records'

      window.alert "#{len_records} #{msg} deleted."
      rowObj[id].remove() for id in resp.deleted_ids
      resetActionSelector()
      updateInstanceTotal()
    ).fail (resp) ->
      window.alert 'Delete failed. Server error.'
      console.log resp


setSuccessMessage = (respObj) ->
  $modalBody = $modal.find('.modal-body')
  $modalBody.children().remove()
  $modalBody.append $ """<p class="process-successful-msg">#{respObj.msg}</p>"""
  if respObj.summaryText
    $modalBody.append $ """
      <textarea style="display:block; width:100%" rows="10">
      #{respObj.summaryText}</textarea>"""


processSucceeds = ($tr, successResp) ->
  # successResp is an object of the form:
  # {form_errors: true -- only if there are form validation errors
  #  fieldName: [Array of field errors], -- only if there are form validation errors
  #  fieldName: [Array of field errors], -- only if there are form validation errors
  #  msg: 'action succeeded response message' -- only if action succeeded
  #  summaryText: string
  # }
  if successResp.form_errors # there are form errors
    error_mgs = ''
    for fieldName, errorArray of successResp
      (error_mgs += "#{fieldName}:   #{errorArray}\n") if fieldName isnt 'form_errors'
    return window.alert "Form errors\n#{error_mgs}"

  setSuccessMessage successResp
  $tr.addClass('processed')
  $tr.children('.lc-number').text successResp.ref  if successResp.ref

  # fetch the clirec instance to which action was applied and update its
  # with the date action was applied. Also update comment and its related object
  $.ajax
    url: $tr.data 'url'
    type: 'GET'
    dataType: "json"
    success: (resp) ->
      $tr.children('.date-processed').text dateMonText resp.date_upload_processed
      setRowRelatedObj $tr, resp
    error: (resp) -> console.log resp


# when row/rows is/are checked and an action selected,
# get information about selected rows
getCheckedRowsInfo = (checkedEl) ->
  # @checkedEl: HTMLInputElement checkbox attached to a row
  $el = $ checkedEl
  $thisRow = $el.parents('tr')
  url = $thisRow.data 'url'
  rows = {}
  ids = []

  for checker in getChecked()
    tr = $(checker).parents('tr')
    id = Number /\d+$/.exec(tr.prop('id'))[0]
    rows[id] = tr
    ids.push id

  rows: rows, ids: ids, url: url, $thisRow: $thisRow

modalContraintObj =
  charge:
    drCr: 'D'
    swiftFlex: 'S'
    errorMsg: 'Charge can only be created for statement debit.'

  lccovermovement:
    drCr: 'C'
    swiftFlex: 'S'
    errorMsg: 'You can only post entries for statement credits as LC cover movement.'

  lcundrawnbalance:
    drCr: 'C'
    swiftFlex: 'S'
    errorMsg: 'You can only create undrawn balance for statement credits.'

  'ubuk-depo-1gbp-26':
    drCr: 'C'
    swiftFlex: 'S'
    errorMsg: 'Ubuk deposit 1 action can only be applied to statement credits.'

actionCanRun = (action, $row) ->
  if _.has(modalContraintObj, action)
    clirecDataObj = getClirecData $row
    constraint = modalContraintObj[action]

    if constraint.drCr is clirecDataObj.drCr and \
        constraint.swiftFlex is clirecDataObj.swiftFlex
      return true
    else
      return alert constraint.errorMsg

  true

# the following actions can only be applied against a single row
SINGLE_ROW_ACTIONS = [
  'availment'
  'charge'
  'lccovermovement'
  'lcundrawnbalance'
]

$runReconsAction.click (evt) ->
  action = $reconsActionSelector.val()
  checkedBoxes = getChecked()
  numBoxes = checkedBoxes.size()

  if numBoxes > 1 and _.contains SINGLE_ROW_ACTIONS, action
    window.alert "'#{action}' can only be applied to a single row.\n#{numBoxes} rows selected."
    resetActionSelector()
    return checkedBoxes.prop('checked', false).trigger 'change'

  {rows, ids, $thisRow, url} = getCheckedRowsInfo checkedBoxes[0]
  return clirecUpload.deleteRecords(rows, ids, url) if action is 'delete'

  if actionCanRun(action, $thisRow) is true
    $('#unmatched-clirec-modal').modal
      backdrop: false
      formName: action,
      remote: clirecUploadUtils.getModalActionUrl action
