$                = require './domtastic-subset.coffee'
Notification     = require './notification.coffee'

###
# Notifier class
###
module.exports = class Notifier
	
		###
		# Some settings
		###
		bemWrapper: 'eegnotifs'

		constructor: ->
			# Add notifications wrapper to document
			@wrapper = $("<div class='#{@bemWrapper}'></div>")

			# Prepare empty queue
			@queue = {}

			# Append element if ready
			if document.readyState != "loading"
				@wrapper.appendTo document.body
			# Append element on domready
			else
				document.addEventListener 'DOMContentLoaded', =>
					@wrapper.appendTo document.body

			return


		send: (params) ->
			# Handle simple message form
			if typeof params is 'string'
				params = text : params

			# Create a notification
			notification = new Notification params

			# Keep notification
			id = @register notification

			# add specific class to wrapper
			if notification.large
				@wrapper[0].className += " #{@bemWrapper}--large"

			if notification.center
				@wrapper[0].className += " #{@bemWrapper}--centered"

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
