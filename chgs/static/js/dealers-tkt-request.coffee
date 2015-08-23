$ ->
	$table = $ 'table'
	$nextArrow = $ '.prev-next >div> a'
	MAX_ALLOWED_PER_PAGE = 5

	getTrs = (trs) ->
		if trs.length > MAX_ALLOWED_PER_PAGE
			$currTrs = trs.slice(0, MAX_ALLOWED_PER_PAGE).show()
			$remTrs = trs.slice(MAX_ALLOWED_PER_PAGE).hide()
			return $currTrs: $currTrs, $remTrs: $remTrs
		return $currTrs: $(trs), $remTrs: null

	{$currTrs, $remTrs} = getTrs $ 'tbody>tr'

	$nextArrow.click ->
		$currTrs.hide()

		if $remTrs isnt null
			{$currTrs, $remTrs} = getTrs $remTrs
			$currTrs.children('td:first-child').text (index) ->
				index + 1
		$currTrs.show()

	$('.prev-next').on
		mouseenter: (evt) -> $nextArrow.show()
		,
		mouseleave: (evt) -> $nextArrow.hide()
