accts =
  USD: '89',
  EUR: '90 EUR',
  GBP: '88 GBP'

makePostData = (data) ->
  [ref, ccy, a, b, c, d, action, amt] = data
  if Number amt.replace /,/g, ''
    if  /DR/.exec action
      drAcct = "CA50010#{accts[ccy]}"
      crAcct = "CL60010#{accts[ccy]}"
    else
      drAcct = "CL60010#{accts[ccy]}"
      crAcct = "CA50010#{accts[ccy]}"

    return [
            [drAcct, kanmii.numberFormat(amt), 'DR', 'TRF',
            "LC ESTB. #{ref}"],

            [crAcct, kanmii.numberFormat(amt), 'CR', 'TRF',
            "LC ESTB. #{ref}"]
           ]
  null

NUM_TDS_PER_ROW = 6

$ ->

  $textarea = $ 'textarea'
  $tbody = $ 'tbody'
  $btn = $ 'button'

  $textarea.on(
    'focusout blur': (evt) ->
      $(this).val (index, oldVal) ->
        if oldVal then return kanmii.strip oldVal else return oldVal
  )

  addRow = (dataList) ->
    $tr = $ '<tr>'
    $tbody.append $tr
    numRows = $tbody.children().size()
    $tr.append(
      $('<td>', text: numRows),
      ($('<td>', text: val, 'tabindex': (index+1) + NUM_TDS_PER_ROW * (numRows-1)) \
      for val, index in dataList)
    )

    $tr


  $btn.eq(1).on(
    'click': (evt) ->
      val = kanmii.strip $textarea.val()
      if val
        $tbody.children().remove()

        $.parse(
          val,

          delimiter: '\t'
          dynamicTyping: false
          header: false
          step: (output, file, inputElem) ->
            postData = makePostData output.results[0].slice 2
            (addRow(data) for data in postData) if postData
            return
        )

        $('td').get(1).focus()
  )

  $btn.first().on(
    'click': (evt) ->
      $textarea.val('')
      $tbody.children().remove()
  )

  $tbody.on(
    'focusin click': (evt) ->
      $el = $ this
      this.style.backgroundColor = '#FDE6CD'
      $el.siblings().css 'background-color', '#FDE6CD'
      kanmii.selectText this

    'focusout': (evt) ->
      $el = $(this)
      this.style.backgroundColor = 'initial'
      $el.siblings().css 'background-color', 'initial'

      if $el.is(':nth-child(3)') #if we are in amount row, format it
        val = kanmii.numberFormat this.innerText
        $el.text(val) if val isnt null

    'dblclick': (evt) ->
      $(this).prop 'contenteditable', true

    ,

    'td:not(:first-child)'
  )

  $btn.last().click (evt) ->
    if $('tbody > tr').size() > 0
      result = '`\t\t\t\tBATCH\n' + kanmii.selectText($('table')[0]).toString()
      saveAs new Blob([result], type: 'application/xls'), 'posting.txt'