$ ->
  $(window).trigger('init-autocomplete')
  $form = $('#lc-cv-mvt-form')
  $amountText = $ '#id_amount_text'
  $amount = $ '#id_amount'
  $lcNumber = $ '#id_lc_number'
  $memo = $ '#id_memo_acct'
  createUrl = $form.data 'create-url'
  csrfToken = $form.data 'csrf'
  $tbody = $ 'tbody'
  $createBtn = $('#create')
  $postBtn = $ '#post'
  rowCheckersSelector = 'tr>td>input'
  defaultMemoUrl = $('#default-memo-url').val()
  $memoDeck = $('#id_memo_acct_on_deck>div')

  $nostro = $('#id_acct').change (evt) ->
    ccy = /.+\|.+\|\s*([A-Z]{3})\s*\|/.exec($('#id_acct_on_deck>div').text())[1]
    $.ajax
      url: "#{defaultMemoUrl}?ccy=#{ccy}"
      type: 'GET'
      async: false
      dataType: 'json'
      success: (resp) ->
        $memoDeck.text resp.number
        $memo.val resp.id
      error: (resp) -> console.log resp

  memoAcct = ''
  nostroAcct = ''

  oneRowSelector = 'td>input'
  allRowsSelector = 'th>input'
  $('table').checkOneAll oneRowSelector, allRowsSelector

  $tbody.on
    'change': (evt) ->
      $el = $ this
      checked = Boolean $tbody.find("#{rowCheckersSelector}:checked").size()
      $postBtn.prop 'disabled', not checked
      $createBtn.prop 'disabled', checked

    , rowCheckersSelector



  $amountText.on
    'focusout': (evt) ->
      $el = $(this)
      amt = kanmii.numberFormat $el.val()
      $el.val(amt) if amt

  cleanUp = () ->
    $nostroDeck = $('#id_acct_on_deck>div')

    # extract nostroAcct for display before destroying
    nostroAcct = kanmii.strip $nostroDeck.text().replace 'X ', ''
    $nostroDeck.text('').children().remove()

    # extract memoAcct for display before destroying
    memoAcct = kanmii.strip $memoDeck.text().replace 'X ', ''
    $memoDeck.text('').children().remove()

    $form.find('input').val('')

  displayLc = (data) ->
    # @data: object of newly created lc cover movement
    $tr = $('<tr>', id: "tr-#{data.id}").appendTo $tbody
    $('<td>').appendTo($tr).append(
      $('<input>', type: 'checkbox'), ('  ' + $tbody.children().size()).replace /^\s+0/, '  ')
    $('<td>', class: 'lc-number', text: data.lc_number).appendTo $tr
    $('<td>',
      class: 'amount',
      text: kanmii.numberFormat data.amount).appendTo $tr
    $('<td>', class: 'nostro', text: nostroAcct).appendTo $tr
    $('<td>', class: 'memo', text: memoAcct).appendTo($tr).after $ '<td>', class: 'post-status'

  $createBtn.click (evt)->
    evt.preventDefault()

    amount = kanmii.formattedToNumber $amountText.val()
    if amount
      $amount.val amount
    else
      return window.alert 'Provide amount for movement.'

    return window.alert('Provide LC Number') if not $lcNumber.val()
    return window.alert('Provide Nostro') if not $nostro.val()
    return window.alert('Provide Memo account.') if not $memo.val()

    $.ajax createUrl,
      type: 'post'
      data:  $form.serialize()
      dataType: "json"
      headers: 'X-CSRFToken': csrfToken
      success: (resp) ->
        cleanUp()
        displayLc resp

      error: (resp) -> alert resp.responseText or resp


  markPosted = ($rows, postStatus) ->
    # @$rows: jquery object of htmlrowelements
    # @postStatus: object where key is the number in tr id, and value is boolean (whether posted)
    $rows.find(oneRowSelector).addClass('no-check').prop(
      'checked', false).prop('disabled', true).trigger 'change'
    for id, status of postStatus
      $tr = $rows.filter "#tr-#{id}"
      if status
        $tr.addClass('posted').children('.post-status').text 'Successful'
      else
        $tr.addClass('unposted').children('.post-status').text 'Failed'


  $postBtn.click (evt) ->
    evt.preventDefault()
    selectedRows = $("#{rowCheckersSelector}:checked").parents('tr')
    selectedRowIds = ($(el).prop('id').replace('tr-', '') for el in selectedRows)

    $.ajax window.location.pathname,
      type: 'post'
      headers: 'X-CSRFToken': csrfToken
      dataType: "json"
      contentType: 'application/json; charset=utf-8'
      data: JSON.stringify selectedRowIds
      success: (resp) ->
        if kanmii.isObj resp
          markPosted selectedRows, resp
        else
          window.alert 'Posting failed.'
      error: (resp) -> alert resp.responseText or resp
