$                = require './domtastic-subset.coffee'
ActionType       = require './action-type.coffee'
Animator         = require './animator.coffee'
assign           = require 'lodash/object/assign'
NotificationType = require './notification-type.coffee'
uuid             = require './uuid.coffee'


###
# Some settings
###
bemItem    = 'eegnotif'


###
# Notification class
###
module.exports = class Notification

	defaults :
		actions      : []
		closeOnClick : false                  # NOT IMPLEMENTED
		delay        : 0
		duration     : 6
		icon         : true                   # (font icon (/base64/img url)
		modal        : false
		template     : 'default'
		text         : 'Hello world !'
		type         : NotificationType.INFO
		onShow       : null
		onRemove     : null


	actionDefaults :
		className : ''
		fn        : => @remove()
		label     : 'Button'
		type      : ActionType.DEFAULT


	constructor: (params) ->
		@DOMNode = null
		@status  = 0

		assign @, @defaults, params, id : uuid()


	_constructDOMNode: ->
		classes = [
			bemItem
			"#{bemItem}--#{@type}"
		]

		classes.push "#{bemItem}--icon" if @icon
		classes.push "#{bemItem}--modal" if @modal

		@DOMNode = $ "
			<div class='#{classes.join(' ')}' id='#{bemItem}--#{@id}'>
				<div class='#{bemItem}__content'>#{@text}</div>
			</div>
		"

		@_setActions()
		@_setControls()

		return @DOMNode


	_setControls: ->
		if not @modal
			# Close control
			$("<button type='button' class='#{bemItem}__control--close'><i class='icon-close-circle' /></button>")
				.on 'click', (e) => @remove()
				.appendTo @DOMNode

		return


	_setActions: ->
		if @actions.length
			actions = $("<div class='#{bemItem}__actions' />").appendTo @DOMNode

			for action in @actions
				do (action) =>
					# Set default action params
					action = assign {}, @actionDefaults, action

					$("<button type='button' class='#{bemItem}__action #{bemItem}__action--#{action.type} #{action.className}'>#{action.label}</button>")
						.on 'click', (e) => action.fn.apply @, e
						.appendTo actions


	_getAnimator: ->
		return @DOMAnimator if @DOMAnimator?

		@DOMAnimator = new Animator @getDOMNode()

		return @DOMAnimator


	getDOMNode: -> if @DOMNode? then @DOMNode else @_constructDOMNode()


	showIn: (target) ->
		@status = 1
		@getDOMNode().appendTo target
		@_getAnimator().transition 'enter', =>
			@onShow.apply @ if @onShow?


	remove: ->
		@status = 2
		@_getAnimator().transition 'leave', =>
			@onRemove.apply @ if @onRemove?
			@getDOMNode().remove()
