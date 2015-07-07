$                = require './domtastic-subset.coffee'
ActionType       = require './action-type.coffee'
assign           = require 'lodash/object/assign'
Notification     = require './notification.coffee'
NotificationType = require './notification-type.coffee'
Notifier         = require './notifier.coffee'


# Create a notifier instance
NotifierInstance = new Notifier

# Return an instance of the notifier service
module.exports =
	actionType   : ActionType
	send         : NotifierInstance.send.bind NotifierInstance
	clearAll     : NotifierInstance.clearAll.bind NotifierInstance
	remove       : NotifierInstance.remove.bind NotifierInstance
	type         : NotificationType
