$ ->
	$wraps = $ '.wrap'
	$anchors = $ '.prev-next>div>a'

	$wraps.hide()
	$wraps.first().show()

	getId = (direction="next")->
		currId = Number $wraps.not(':hidden').attr 'id'

		if direction is 'next'
			if currId < $wraps.length then (currId + 1) else 1
		else
			if currId is 1 then $wraps.length else currId - 1

	$anchors.first().click (evt)->
		nextWrap = $ "##{getId()}"
		$wraps.hide()
		nextWrap.show()

	$anchors.last().click (evt)->
		nextWrap = $ "##{getId('prev')}"
		$wraps.hide()
		nextWrap.show()

	$('section.content').on(
		mouseenter: ->
			this.contentEditable = true
			this.classList.add 'focused'
		,
		mouseleave: ->
			this.contentEditable = false
			this.classList.remove 'focused'
		, '.bank-info > tbody > tr:nth-child(2) > td'
	)

	$('.prev-next').on
		mouseenter: -> $anchors.css 'display', 'block'

		mouseleave: -> $anchors.hide()
