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

ActionType =
	DEFAULT : 'default'
	PRIMARY : 'primary'
	DANGER  : 'danger'


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
		modal        : false
		closeOnClick : false                  # NOT IMPLEMENTED
		type         : NotificationType.INFO
		icon         : true                   # (font icon (/base64/img url)
		text         : 'Hello world !'
		template     : 'default'
		duration     : 6
		delay        : 0
		actions      : []


	actionDefaults :
		label : 'Button'
		type  : ActionType.DEFAULT
		fn    : => @remove()


	constructor: (params) ->
		@DOMNode = null

		assign @, @defaults, params, id : uuid()


	_constructDOMNode: ->
		classes = [
			bemItem,
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

					$("<button type='button' class='#{bemItem}__action #{bemItem}__action--#{action.type}'>#{action.label}</button>")
						.on 'click', (e) => action.fn.apply @, e
						.appendTo actions


	_getAnimator: ->
		return @DOMAnimator if @DOMAnimator?

		@DOMAnimator = new Animator @getDOMNode()

		return @DOMAnimator


	getDOMNode: -> if @DOMNode? then @DOMNode else @_constructDOMNode()


	showIn: (target, finishCallback) ->
		@getDOMNode().appendTo target
		@_getAnimator().transition 'enter', finishCallback


	remove: (finishCallback) ->
		@_getAnimator().transition 'leave', =>
			finishCallback() if finishCallback?
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


		cancel: (id) ->
			if @queue[id]
				clearTimeout @queue[id].delayTimeout
				delete @queue[id]
				true
			else
				false


		register: (notification) ->
			@queue[notification.id] = notification

			return notification.id


		show: (notification) ->
			notification.showIn @wrapper

			# Save remove event
			if notification.duration > -1
				notification.displayTimeout = setTimeout =>
					@remove notification
				, notification.duration * 1000

			return


		remove: (notification) ->
			notification.remove()
			delete @queue[notification.id] if @queue[notification.id]

			return


NotifierInstance = new Notifier


# Return an instance of the notifier service
module.exports =
	actionType   : ActionType
	send         : NotifierInstance.send.bind NotifierInstance
	cancel       : NotifierInstance.cancel.bind NotifierInstance
	type         : NotificationType
