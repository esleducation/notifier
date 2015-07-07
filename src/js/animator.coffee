assign  = require 'lodash/object/assign'


###
# Animator class
###
module.exports = class Animator

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
