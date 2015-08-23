$(->

	$formatOne = $('#id_format1')
	$submitBtn = $('input[type=submit]')
	$downloadBtn = $ '.download-btn'
	$label = $('label')

	rateDataTabs = ($rateData) ->
		if $rateData.length isnt 0
			tabVal = 1
			$rateData.each((index, el) ->
				$(el).attr 'tabindex', tabVal++
				return)

		$rateData.focus -> kanmii.selectText this
		$rateData.click -> kanmii.selectText this
		$rateData.eq(0).focus()

	rateDataTabs($ '.rate-data')


	removeLeadNonDigits = (rateText) ->
		rateText = rateText.trim()
		if (not (/^\d/).test rateText) and (/\d/).test(rateText)
				return rateText.slice (/\d/).exec(rateText).index
		return rateText

	class ProcessFormatOne
		constructor: (@rateText) ->
			@rateList = @rateText.split /\n|\r|\n\r|\r\n/
			@CCY_RE = /\(([a-z]{3})1\/([a-z]{3})\)$/i

		validate: =>
			NUMBER_RE = /^[0-9]+(?:\.[0-9]+)?$/
			matches = []
			matches.push NUMBER_RE.test rate for rate in @rateList[0..1]
			for rate, index in @rateList[2..]
				matches.push if index % 2 is 0 then @CCY_RE.test rate else NUMBER_RE.test rate
			kanmii.all matches

		calculate: =>
			rateObj = {}
			rateObj.NGN = (kanmii.sum(@rateList[0..1]) / 2.0).toFixed 7

			for el, index in @rateList[2..] by 2
				[num, den] = @CCY_RE.exec(el)[1..2]
				rateVal = @rateList[index+3]
				num = num.toUpperCase()
				rateObj[num] = (+rateVal).toFixed(7) if num isnt 'USD'
				rateObj[den.toUpperCase()] = (1.0/rateVal).toFixed(7) if num is 'USD'
			rateObj

	processErr = (errorText) ->
		$('.errorlist').remove()
		$('<ul></ul>', class: 'errorlist', text: errorText).insertBefore $(this)


	$submitBtn.eq(0).on 'click', (evt) ->
		$('.errorlist').remove()
		$('tbody').empty()

		formatOneVal = ''
		$formatOne.val (index, currentVal) ->
			return currentVal if currentVal is ''
			return formatOneVal = removeLeadNonDigits currentVal

		if formatOneVal is ''
			processErr.call this, "This field is required!"
			return false

		fmt1 = new ProcessFormatOne(formatOneVal)

		if not fmt1.validate()
			processErr.call(this, 'The data format is incorrect!')
			false

		else
			rateObj = fmt1.calculate()
			for ccy, rateVal of rateObj
				$tr = $('<tr>')
				$tdCcy = $('<td>', class: "rate-data ccy", text: ccy)
				$tdRateVal = $('<td>', class: "rate-data xchg-rate-val", text: rateVal)
				$tr.append($tdCcy)
					 .append $tdRateVal
				$('tbody').append $tr
				rateDataTabs $ '.rate-data'
			false
		# evt.preventDefault()

	$submitBtn.eq(1).click (evt) ->
		$rateData = $ '.rate-data'
		if $rateData.length is 0
			evt.preventDefault()

	$label.on 'click', (evt) ->
		$label.hide()
		$formatOne[0].focus()

	$formatOne.on(
		'focusin': (evt) ->
			$label.hide()
		,
		'focusout': (evt) ->
			$label.show() if not $formatOne.val()
	)
)