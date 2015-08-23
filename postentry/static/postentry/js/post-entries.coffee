$( ->
	$checkAll = $ 'input[type=checkbox]:first'
	$checkOne = $ 'input[type=checkbox]:not(:first)'
	postingCheck = [] #we keep track of how many post data the server returned as posted
	$tbody = $ 'tbody'
	$manualPostingBtn = $('.post-table>img')
	POSTDATATDSELECTOR = 'td:nth-last-child(-n+7):not(:last-child)'
	$summary = $('.summary-div')
	TOTAL_POST_DATA_TD = 6

	$summary.on(
		"mouseenter": (evt) ->
			$(this).children().show().last().get(0).scrollIntoView(false)

		"mouseleave": (evt) ->
			$(this).children().hide()
	)

	tabVal = 1 # give posting data received from server tabindices
	for el in $(POSTDATATDSELECTOR)
		$(el).prop('tabindex', tabVal++ ) if el.innerText isnt ''

	$('table').checkOneAll 'input[type=checkbox]:not(:first)', 'input[type=checkbox]:first'

	$tbody.on
		'focusin': -> $(this).addClass 'selected'

		'focusout': ->
			$el = $(this)
			$el.removeClass 'selected'
		,
		'tr'

	$tbody.on
		'focusout': ->
			$el = $(this)
			$el.prop 'contenteditable', false

			if $el.is('.manual-posting') and $el.text()
				$el.prop(
					'tabindex',
					parseInt($el.siblings().get(1).innerText) * TOTAL_POST_DATA_TD)

			if $el.is(':nth-child(4)')
				val = kanmii.numberFormat $el.text()
				$el.text(val) if val

		'dblclick': -> $(this).prop 'contenteditable', true

		'focus click': ->
			$(this).removeClass 'text-copied'
			kanmii.selectText this
		,
		POSTDATATDSELECTOR

	# do ajax to post data and recieve object denoting which data was successfully posted
	$('th>span:first').click ->
		[url, csrfToken] = $('.post-table>span:first').text().split '|'
		postIdsArray = (el.value for el in $checkOne.filter ':checked')

		if postIdsArray.length
			posting = $.post(
				url,
				ids: JSON.stringify(postIdsArray)
				csrfmiddlewaretoken: csrfToken
			)

			posting.done (data) ->
				dataObj = JSON.parse data
				$checkOne.each ->
					if dataObj[el.value] is true
						$(this).parent().siblings().last().empty().text 'Posted'
						postingCheck.push true
					return

			posting.fail (error) ->
				alert """
					Error status: #{error.status}
					Error response text: #{error.responseText}
					"""

	# if we are done posting and we have entered correct bacth no,
	# remove elements that dont require printing
	$('th>span:last').click ->
		$batchNoBox = $('#id-batch-no')
		batchNo = $batchNoBox.val()
		if not batchNo or batchNo.length < 4
			$batchNoBox.addClass 'empty-batch-no'
			return

		# confirm is entries sent to server for posting
		if not kanmii.all postingCheck
			if not window.confirm("""
					Entries not marked as posted, are you sure you want to continue?""")
				return

		$('caption').text "Batch #{batchNo}"
		$('.batch-no-div').remove()
		$('tr').children(':last-child').remove()
		$('tr').children(':first-child').remove()
		$manualPostingBtn.remove()
		$summary.remove()

	# add manual post data
	$manualPostingBtn.click (evt) ->
		$tr = $('<tr>')
		$tbody.append $tr
		numRows = $tbody.children().size()
		$tr.append(
			$('<td>'), $('<td>', text: numRows),
			($('<td>', contenteditable: true, tabindex: index + (numRows - 1) * TOTAL_POST_DATA_TD) \
				for index in [1..(TOTAL_POST_DATA_TD - 1)]),
			$('<td>', contenteditable: true, class: 'manual-posting'), $('<td>')
		)

		$prevTr = $tr.prev()
		$trKids = $tr.children(POSTDATATDSELECTOR)
		if $prevTr.size()
			$prevTrKids = $prevTr.children()
			if (parseInt($prevTrKids.eq(1).text()) % 2) isnt 0
				$prevTrKids.filter(POSTDATATDSELECTOR).each (index, el) ->
					$trKids.eq(index).text(el.innerText) if _.contains [1, 3, 4, 5], index
					$trKids.eq(index).text('CR') if (index is 2) and /^d/i.test el.innerText
					$trKids.addClass 'text-copied'
					return
		$trKids.eq(0).focus()
)
