PATTERNS =
  LC_RE: /LC CHGS REF\/(ILCL[A-Z]{3}\d{9})(?:\/[A-Z]{3,})?/
  FORMM_RE: /MF[\dA-Z]{7,}\/FM[LB]C (BA|CB)[\s\dA-Z]{8,}(?:\/[A-Z]{3,})?/
  BILLS_RE: /COMM BC [A-Z]{3}[0-9,\.]{2,}\/(FOBC\d{8})(?:\/[A-Z]{3,})?/
  OUT_RE: /TIREF ((?:FCO|OT[EG])\d{9})\/FT TO [^\/]+\/[^\/]+\/\w+/i
  INW_RE: /TIREF (CF[EGC]\d{9})\/TF BY [^\/]+\/[^\/]+\/\w+/i

getQueryParam = (text) ->
  # match form m, return narration
  matched = PATTERNS.FORMM_RE.exec text
  return matched[0] if matched

  # match lc ref, return ref
  matched = PATTERNS.LC_RE.exec text
  return matched[1] if matched

  # match bills ref, return ref
  matched = PATTERNS.BILLS_RE.exec text
  return matched[1] if matched

  # match outward trf ref, return ref
  matched = PATTERNS.OUT_RE.exec text
  return matched[1] if matched

  # match inward trf ref, return ref
  matched = PATTERNS.INW_RE.exec text
  return matched[1] if matched

  null

$ ->
  $textArea = $('#income2-text')
  $trClonable = $ '#tr-clonable'
  $getBtn = $('#get-btn')
  $downloadBtn = $ '#download-btn'
  $tbody = $ 'tbody'
  url = $('form').data 'url'

  displayRow = (rowArray) ->
    $tr = $trClonable.clone()
    $tbody.append $tr
    $tds = $tr.children()

    $tds.filter('.gl').text rowArray[0]
    $tds.filter('.trxn-dt').text rowArray[1]
    $tds.filter('.ref').text rowArray[2]
    $tds.filter('.narr').text rowArray[3]
    $tds.filter('.val-dt').text rowArray[4]
    $tds.filter('.ccy').text rowArray[5]
    $tds.filter('.lcy-amt').text rowArray[6]
    $tds.filter('.fcy-amt').text rowArray[7]
    $tds.filter('.acct').text rowArray[8]

    $tr.show()

  getAcct = (filterParam) ->
    filterParamEncoded = encodeURIComponent(filterParam)
    return $.get "#{url}?filter_param=#{filterParamEncoded}"

  reset = ->
    $trClonable.siblings().remove()
    $downloadBtn.prop 'disabled', true

  $textArea.on(
    'focusout': (evt) ->
      $el = $ this
      $el.val (index, OldVal) ->
        kanmii.strip OldVal

    'change': (evt) ->
      $el = $ this
      val = $el.val()
      if val
        $getBtn.prop 'disabled', false
      else
        $getBtn.prop 'disabled', true
  )

  $getBtn.on(
    'click': (evt) ->
      evt.preventDefault()
      reset()
      incomeText = $textArea.val()
      return if not incomeText

      $.parse(
        incomeText,

        header: false
        dynamicTyping: false
        delimiter: '\t'
        step: (data) ->
          {results, errors} = data
          items = results[0]
          filterParam = getQueryParam items[3]
          if filterParam
            ajaxGet = getAcct(filterParam)
            ajaxGet.done( (resp) ->
              items[8] = resp
              displayRow items
            ).fail (resp) ->
              console.log filterParam
              console.log resp
      )
      $downloadBtn.prop 'disabled', false
  )

  $downloadBtn.on(
    'click': (evt) ->
      if $tbody.children().size() > 1
        result = kanmii.selectText($('table')[0]).toString()
        saveAs new Blob([result], type: 'application/xls'), 'income2.txt'
  )
