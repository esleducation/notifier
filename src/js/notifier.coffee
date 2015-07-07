$                = require './domtastic-subset.coffee'
Notification     = require './notification.coffee'


###
# Some settings
###
bemWrapper = 'eegnotifs'


###
# Notifier class
###
module.exports = class Notifier

		constructor: ->
			# Add notifications wrapper to document
			@wrapper = $("<div class='#{bemWrapper}'></div>")

			# Prepare empty queue
			@queue = {}

			# Append element on domready
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
