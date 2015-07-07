$       = require './domtastic-subset.coffee'
assign  = require 'lodash/object/assign'


###
# Some settings
###
bemWrapper = 'eegnotifs'
bemItem    = 'eegnotif'


###
# minimal UUID
###
_uuid = 0; uuid = -> ++_uuid


###
# Notification type
###
NotificationType =
	INFO    : 'info'
	SUCCESS : 'success'
	WARN    : 'warn'
	ERROR   : 'error'
	DEBUG   : 'debug'
	CUSTOM  : 'custom'

ActionType =
	DEFAULT : 'default'
	PRIMARY : 'primary'
	DANGER  : 'danger'
	CUSTOM  : 'custom'


###
# Notification class
###
class Animator

	TICK : 17

	options :
		duration : 200
		animation : 'notification'

	constructor : (DOMNode, options = {}) ->
		# Set options
		assign @options, options

		@DOMNode = DOMNode
		@classNameQueue = []
		@timeout = null

		return

	transition : (animationType, finishCallback) ->
		className       = "#{@options.animation}-#{animationType}"
		activeClassName = "#{className}-active"
		@DOMNode.addClass className
		@queueClass activeClassName

		setTimeout =>
			@DOMNode.removeClass "#{className} #{activeClassName}"
			finishCallback() if finishCallback?
		, @options.duration

	queueClass : (className) ->
		@classNameQueue.push className

		if ! @timeout
			@timeout = setTimeout @flushClassNameQueue.bind(@), @TICK

		return

	flushClassNameQueue : ->
		for className in @classNameQueue
			@DOMNode.addClass className

		@classNameQueue.length = 0
		@timeout = null

		return


###
# Notification class
###
class Notification

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

###
# Notifier class
###
class Notifier

		constructor: ->
			# Add notifications wrapper to document
			@wrapper = $("<div class='#{bemWrapper}'></div>").appendTo document.body

			# Prepare empty queue
			@queue = {}

			return


		send: (params) ->
			# Handle simple message form
			if typeof params is 'string'
				params = text : params

			# Create a notification
			notification = new Notification params

			# Keep notification
			id = @register notification

			# Show notif
			notification.delayTimeout = setTimeout =>
				@show notification
			, notification.delay * 1000

			# Send back id for cancellation
			return id


		register: (notification) ->
			@queue[notification.id] = notification

			return notification.id


		show: (notification) ->
			notification.showIn @wrapper

			# Save remove event
			if notification.duration > -1
				notification.displayTimeout = setTimeout =>
					@remove notification.id
				, notification.duration * 1000

			return


		clearAll: (includeDelayed = false) ->
			@remove id for id, notification of @queue when includeDelayed or notification.status > 0


		remove: (id) ->
			if @queue[id]
				clearTimeout @queue[id].delayTimeout
				@queue[id].remove()
				delete @queue[id]
				true
			else
				false


NotifierInstance = new Notifier


# Return an instance of the notifier service
module.exports =
	actionType   : ActionType
	send         : NotifierInstance.send.bind NotifierInstance
	clearAll     : NotifierInstance.clearAll.bind NotifierInstance
	remove       : NotifierInstance.remove.bind NotifierInstance
	type         : NotificationType
