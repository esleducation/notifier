# Notifier javascript umd module
This lightweight (5.8Ko gzipped) dependence-free plugin allows growl-like notifications. It is compatible with requireJS and commonJS (webpack / browserify), or can be used by loading the javascript file directly.

You can [see a demo here](https://rawgit.com/esleducation/notifier/master/demo.html).

# Usage

All Notifications are wrap in a Notifier.
You must `send` Notification object to the Notifier

## Options

- actions      : []
- closeOnClick : false                  # NOT IMPLEMENTED
- delay        : 0
- duration     : 6                      # -1 will be indertemined
- icon         : true                   # (font icon (/base64/img url)
- modal        : false
- center       : false                  # add a eegnotifs--centered class on the wrapper, remove the class on first center close :(
- large        : false                  # add a eegnotifs--large class on the wrapper and a eegnotif--large on the notif, remove the class on first large close :(
- template     : 'default'
- text         : 'Hello world !'
- type         : NotificationType.INFO
- onShow       : null
- onRemove     : null

## Notification Type
NotificationType =
	INFO    : 'info'
	SUCCESS : 'success'
	WARN    : 'warn'
	ERROR   : 'error'
	DEBUG   : 'debug'
	CUSTOM  : 'custom'

## Action Type
ActionType =
	DEFAULT : 'default'
	PRIMARY : 'primary'
	DANGER  : 'danger'
	CUSTOM  : 'custom'

## Notifier API

- send(params)
- register(notification)
- show(notification)
- clearAll()
- remove()

# Easy example

```javascript
Notifier.send({
	type: Notifier.type.SUCCESS,
	icon: false,
	duration: -1,
	text  : 'Fusce maximus elit quis ex.',
});
```
# Full example

```javascript
actionsNotif = Notifier.send({
	type: Notifier.type.WARN,
	text: 'Cras suscipit interdum ipsum nec tincidunt. Duis massa enim, hendrerit eu ante congue.',
	duration: -1,
	large: true,
	modal: true,
	actions: [{
		label : 'Cancel',
		type : Notifier.actionType.CUSTOM,
		className : 'btn--dark',
		fn : function(){
			console.log('cancel');
			this.remove();
		}
	}, {
		label : 'Apply',
		type : Notifier.actionType.PRIMARY,
		fn : function(){
			console.log('apply');
			this.remove();
		}
	}]
});
```


# Code source
All code source ar in the `src` folder.
ALl js are devloped in coffee script

# Gulp tasks
- do a `nom install` on first use
- watch: do a `gulp watch`
- build in dev : `gulp`
- build for prod: `NODE_ENV=production gulp`
