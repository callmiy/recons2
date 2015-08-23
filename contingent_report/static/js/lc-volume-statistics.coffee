$.fn.insertAt = (el, nextPos) ->
	children = this.children()
	this.append el
	if not children.length
		this

	for c in children
		$c = $(c)
		$c.before(this.children().last()) if (Number nextPos) < (Number $c.data('pos'))

	this

$ ->
	'use strict'

	SELECTED_ID = 'selected'
	AVAILABLE_ID = 'available'
	$available = $ "##{AVAILABLE_ID}"
	$selected = $ "##{SELECTED_ID}"

	makeOption = (selection, $par, parId, pos) ->
		optionId = "#{parId}-#{selection}"
		[yr, mon] = selection.split '-'
		if not $("##{optionId}").length
			$par.insertAt(
				$('<option>', id: optionId, text: "#{yr} - #{mon}", value: selection, 'data-pos': pos), pos)

	removeOption = (selection, parId) ->
		$option = $ "##{parId}-#{selection}"
		$option.remove() if $option.length

	makeOptions = (selectedValues) ->
		for selection in selectedValues
			makeOption selection, $selected, SELECTED_ID, $("##{AVAILABLE_ID}-#{selection}").data 'pos'
			removeOption selection, AVAILABLE_ID

	removeOptions = (selectedValues) ->
		for selection in selectedValues
			makeOption selection, $available, AVAILABLE_ID, $("##{SELECTED_ID}-#{selection}").data 'pos'
			removeOption selection, SELECTED_ID

	$('#select-one').click (evt) ->
		evt.preventDefault()
		selectedValues = $available.val()
		makeOptions(selectedValues) if (selectedValues and selectedValues.length)

	$('#deselect-one').click (evt) ->
		evt.preventDefault()
		selectedValues = $selected.val()
		removeOptions(selectedValues) if (selectedValues and selectedValues.length)

	$('#select-all').click (evt) ->
		evt.preventDefault()
		makeOptions (el.value for el in $available.children())

	$('#deselect-all').click (evt) ->
		evt.preventDefault()
		removeOptions (el.value for el in $selected.children())

	$('button[type=submit]').click (evt) ->
		evt.preventDefault()
		$selectedOptions = $selected.children()
		if $selectedOptions.length
			$('input[name=selected-yrs-mons').val (el.value for el in $selectedOptions).join ','
			$('form').submit()
		else
			alert 'No selection made!'
