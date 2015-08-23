clirecUploadUtils = {}

clirecUploadUtils.ParseData = do ->
  class ParseData
    constructor: (row) ->
      # @row Array = [postDate, valdate, daysOut, details, amount]
      # @nostroVal String. A string integer for the nostro
      # @swiftFlexVal String. For whether entries are stmt or ledger

      postDate = @dateParser row[0]
      valDate = @dateParser row[1]
      amount = kanmii.formattedToNumber "#{row[4]}"

      @error = not Boolean(postDate and valDate and amount)

      @data =
        post_date: postDate
        valdate: valDate
        details: row[3]
        amount: String amount

      @appendLCRef row[3]


    appendLCRef: (details)->
      # extract the lc ref, if one exists, from the details column and append it
      # to parsed data
      ref_patterns = [
        /LCCB\/ZAK\/\d{2}\/\d{0,3}/i
        /ILCL[A-Z]{3}\d{9}/i
        /ITASAL\d+/i
        /SWIFT\s+INV\s+\d+/i
        /AA\d{7}/
        /CFE\d{9}/i
        /CFG\d{9}/i
        /CFC\d{9}/i
        /FCO\d{9}/i
        /OTG\d{9}/i
        /OTE\d{9}/i
        /ITF\d+SBLC?/i
        /ITAC\d+/i
        /UNC\d+[A-Z]+/i
        /FOBC\d{8}/i
      ]

      for pattern in ref_patterns
        ref = pattern.exec details
        if ref
          @data.lc_number = ref[0].toUpperCase()
          break

      # ref = /ILCL[A-Z]{3}\d{9}/i.exec details
      # @data.lc_number = ref[0].toUpperCase() if ref

    dateParser: (val)->
      # @val String: a date string in the format "mmm dd yyyy"

      MMM_NAMES = [
        'jan', 'feb', 'mar', 'apr', 'may', 'jun',
        'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

      valDate = /^([a-z]{3})[^a-z\d]+(\d{2})[^a-z\d]+(\d{4})$/i.exec val
      if valDate
        mon = MMM_NAMES.indexOf(valDate[1].toLowerCase()) + 1
        day = parseInt valDate[2]
        yr = parseInt valDate[3]
        return "#{yr}-#{mon}-#{day}"

      null

  ParseData

clirecUploadUtils.setPluginInitialVal = (attrs) ->
  # for dom elements from modal action forms using ajax select, especially
  # elements that need to take their values from the currently displayed
  # nostro, this function will help with that
  {$el, text, id} = attrs
  opts = $el.data('plugin-options') or {}
  opts.initial = [text, id]
  $el.val id
  $("##{$el.prop('id')}_on_deck").trigger('added', [id, label: text])
  JSON.stringify opts

clirecUploadUtils.getModalActionUrl = (action) ->
  clirecUtilUrls.clirecReconsActionUrl.replace 'XXXXXX', action

clirecUploadUtils.parseUploadText = (uploadedText) ->

  # error thrown when nostro account found in user clirec text
  # differs from that selected by user
  class NostroNoMatchError extends Error
    constructor: (@message) -> @name = 'NostroNoMatchError'

  extractSwiftFlex = (rowContent) ->
    # get whether uploaded data is debit-swift or credit-flex etc
    matches =
      CREDIT_SWIFT:
        pattern: /CREDIT.+(?:SWIFT|STATEMENT)/i
        swift_flex: 'S'
        dr_cr: 'C'

      CREDIT_FLEX:
        pattern: /CREDIT.+(?:FLEXCUBE|LEDGER)/i
        swift_flex: 'F'
        dr_cr: 'C'

      DEBIT_SWIFT:
        pattern: /DEBIT.+(?:SWIFT|STATEMENT)/i
        swift_flex: 'S'
        dr_cr: 'D'

      DEBIT_FLEX:
        pattern: /DEBIT.+(?:FLEXCUBE|LEDGER)/i
        swift_flex: 'F'
        dr_cr: 'D'

    for k, obj of matches
      if obj.pattern.test rowContent
        return [obj.swift_flex, obj.dr_cr]

    [null, null]

  isValidClirec = (row) ->
    row.length >= 5 and \ # the actual length is 5 but we may have comments
    /^[A-Za-z]{3}\s+\d{2},\s+\d{4}$/.test(row[0]) and \
    /^[A-Za-z]{3}\s+\d{2},\s+\d{4}$/.test(row[1]) and \
    /^-?\d+$/.test(row[2]) and \
    /^\d{1,3}(:?,\d{3})*(:?\.\d{2})$/.test row[4]

  nostroNameInText = null
  nostroNumberInText = null

  checkNostro = (value) ->
    name = /RECONCILIATION OF  (.+) A\/C /.exec value
    if name
      nostroNameInText = name[1]
      return new RegExp(name[1]).test clirecUploadUtils.nostroObj.name

    number = /STMT A\/C- (.+) AS AT /.exec value
    if number
      nostroNumberInText = number[1]
      return new RegExp(number[1]).test clirecUploadUtils.nostroObj.number
    false

  malformedData = []
  correctData = []
  swift_flex = null
  dr_cr = null
  nostroOk = false

  try
    $.parse(
      uploadedText
      header: false
      delimiter: "\t"
      dynamicTyping: false
      step: (data) ->
        {results, errors} = data
        if not errors.length and results[0]

          rowx = (kanmii.strip(x) for x in results[0] when x)
          return unless rowx.length > 0
          nostroOk = checkNostro(rowx[0]) unless nostroOk


          if rowx.length is 1 and /(?:DEBIT)|(?:CREDIT)/i.test rowx[0]
            [swift_flex, dr_cr] = extractSwiftFlex rowx[0]

          if isValidClirec rowx
            throw new NostroNoMatchError('Invalid Nostro') unless nostroOk

            if not (swift_flex and dr_cr)
              console.log 'swift_flex not set @ = ', rowx
            else
              # bcos we may have comments on column beyond 5, we truncate to 5
              pData = new clirecUploadUtils.ParseData rowx.slice 0, 5
              if not pData.error
                pData.data.nostro = clirecUploadUtils.nostroObj.id
                pData.data.swift_flex = swift_flex
                pData.data.dr_cr = dr_cr
                # flag to tell server to ignore this data if it was uploaded
                # previously
                pData.data.check_unique = 'check_unique'
                correctData.push pData.data
              else
                malformedData.push rowx
    )

  catch e
    if e.name is 'NostroNoMatchError'
      return [e, [nostroNameInText, nostroNumberInText]]
    else throw e
  [malformedData, correctData]

clirecUploadUtils.setNostroObj = (nostroId) ->
  clirecUploadUtils.nostroObj = {}
  $.ajax
    url : "/adhoc-models/nostro-acct/#{nostroId}/"
    async: false
    success: (resp) ->
      clirecUploadUtils.nostroObj.ccy = resp.ccy
      clirecUploadUtils.nostroObj.ledger_acct = resp.ledger_acct
      clirecUploadUtils.nostroObj.name = resp.name
      clirecUploadUtils.nostroObj.number = resp.number
      clirecUploadUtils.nostroObj.id = resp.id
      clirecUploadUtils.nostroObj.defaultMemoAcct = $('#default-memos').data('memos')[resp.ccy]
    error: (resp) ->
      window.alert 'Can not retrieve nostro details.\nServer Error.\nCheck console for details'
      console.log resp
