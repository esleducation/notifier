(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Notifier"] = factory();
	else
		root["Notifier"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var $, ActionType, Animator, Notification, NotificationType, Notifier, NotifierInstance, _uuid, assign, bemItem, bemWrapper, uuid;
	
	$ = __webpack_require__(1);
	
	assign = __webpack_require__(2);
	
	
	/*
	 * Some settings
	 */
	
	bemWrapper = 'eegnotifs';
	
	bemItem = 'eegnotif';
	
	
	/*
	 * minimal UUID
	 */
	
	_uuid = 0;
	
	uuid = function() {
	  return ++_uuid;
	};
	
	
	/*
	 * Notification type
	 */
	
	NotificationType = {
	  INFO: 'info',
	  SUCCESS: 'success',
	  WARN: 'warn',
	  ERROR: 'error',
	  DEBUG: 'debug',
	  CUSTOM: 'custom'
	};
	
	ActionType = {
	  DEFAULT: 'default',
	  PRIMARY: 'primary',
	  DANGER: 'danger',
	  CUSTOM: 'custom'
	};
	
	
	/*
	 * Notification class
	 */
	
	Animator = (function() {
	  Animator.prototype.TICK = 17;
	
	  Animator.prototype.options = {
	    duration: 200,
	    animation: 'notification'
	  };
	
	  function Animator(DOMNode, options) {
	    if (options == null) {
	      options = {};
	    }
	    assign(this.options, options);
	    this.DOMNode = DOMNode;
	    this.classNameQueue = [];
	    this.timeout = null;
	    return;
	  }
	
	  Animator.prototype.transition = function(animationType, finishCallback) {
	    var activeClassName, className;
	    className = this.options.animation + "-" + animationType;
	    activeClassName = className + "-active";
	    this.DOMNode.addClass(className);
	    this.queueClass(activeClassName);
	    return setTimeout((function(_this) {
	      return function() {
	        _this.DOMNode.removeClass(className + " " + activeClassName);
	        if (finishCallback != null) {
	          return finishCallback();
	        }
	      };
	    })(this), this.options.duration);
	  };
	
	  Animator.prototype.queueClass = function(className) {
	    this.classNameQueue.push(className);
	    if (!this.timeout) {
	      this.timeout = setTimeout(this.flushClassNameQueue.bind(this), this.TICK);
	    }
	  };
	
	  Animator.prototype.flushClassNameQueue = function() {
	    var className, i, len, ref;
	    ref = this.classNameQueue;
	    for (i = 0, len = ref.length; i < len; i++) {
	      className = ref[i];
	      this.DOMNode.addClass(className);
	    }
	    this.classNameQueue.length = 0;
	    this.timeout = null;
	  };
	
	  return Animator;
	
	})();
	
	
	/*
	 * Notification class
	 */
	
	Notification = (function() {
	  Notification.prototype.defaults = {
	    actions: [],
	    closeOnClick: false,
	    delay: 0,
	    duration: 6,
	    icon: true,
	    modal: false,
	    template: 'default',
	    text: 'Hello world !',
	    type: NotificationType.INFO
	  };
	
	  Notification.prototype.actionDefaults = {
	    className: '',
	    fn: function() {
	      return Notification.remove();
	    },
	    label: 'Button',
	    type: ActionType.DEFAULT
	  };
	
	  function Notification(params) {
	    this.DOMNode = null;
	    assign(this, this.defaults, params, {
	      id: uuid()
	    });
	  }
	
	  Notification.prototype._constructDOMNode = function() {
	    var classes;
	    classes = [bemItem, bemItem + "--" + this.type];
	    if (this.icon) {
	      classes.push(bemItem + "--icon");
	    }
	    if (this.modal) {
	      classes.push(bemItem + "--modal");
	    }
	    this.DOMNode = $("<div class='" + (classes.join(' ')) + "' id='" + bemItem + "--" + this.id + "'> <div class='" + bemItem + "__content'>" + this.text + "</div> </div>");
	    this._setActions();
	    this._setControls();
	    return this.DOMNode;
	  };
	
	  Notification.prototype._setControls = function() {
	    if (!this.modal) {
	      $("<button type='button' class='" + bemItem + "__control--close'><i class='icon-close-circle' /></button>").on('click', (function(_this) {
	        return function(e) {
	          return _this.remove();
	        };
	      })(this)).appendTo(this.DOMNode);
	    }
	  };
	
	  Notification.prototype._setActions = function() {
	    var action, actions, i, len, ref, results;
	    if (this.actions.length) {
	      actions = $("<div class='" + bemItem + "__actions' />").appendTo(this.DOMNode);
	      ref = this.actions;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        action = ref[i];
	        results.push((function(_this) {
	          return function(action) {
	            action = assign({}, _this.actionDefaults, action);
	            return $("<button type='button' class='" + bemItem + "__action " + bemItem + "__action--" + action.type + " " + action.className + "'>" + action.label + "</button>").on('click', function(e) {
	              return action.fn.apply(_this, e);
	            }).appendTo(actions);
	          };
	        })(this)(action));
	      }
	      return results;
	    }
	  };
	
	  Notification.prototype._getAnimator = function() {
	    if (this.DOMAnimator != null) {
	      return this.DOMAnimator;
	    }
	    this.DOMAnimator = new Animator(this.getDOMNode());
	    return this.DOMAnimator;
	  };
	
	  Notification.prototype.getDOMNode = function() {
	    if (this.DOMNode != null) {
	      return this.DOMNode;
	    } else {
	      return this._constructDOMNode();
	    }
	  };
	
	  Notification.prototype.showIn = function(target, finishCallback) {
	    this.getDOMNode().appendTo(target);
	    return this._getAnimator().transition('enter', finishCallback);
	  };
	
	  Notification.prototype.remove = function(finishCallback) {
	    return this._getAnimator().transition('leave', (function(_this) {
	      return function() {
	        if (finishCallback != null) {
	          finishCallback();
	        }
	        return _this.getDOMNode().remove();
	      };
	    })(this));
	  };
	
	  return Notification;
	
	})();
	
	
	/*
	 * Notifier class
	 */
	
	Notifier = (function() {
	  function Notifier() {
	    this.wrapper = $("<div class='" + bemWrapper + "'></div>").appendTo(document.body);
	    this.queue = {};
	    return;
	  }
	
	  Notifier.prototype.send = function(params) {
	    var id, notification;
	    notification = new Notification(params);
	    id = this.register(notification);
	    notification.delayTimeout = setTimeout((function(_this) {
	      return function() {
	        return _this.show(notification);
	      };
	    })(this), notification.delay * 1000);
	    return id;
	  };
	
	  Notifier.prototype.cancel = function(id) {
	    if (this.queue[id]) {
	      clearTimeout(this.queue[id].delayTimeout);
	      delete this.queue[id];
	      return true;
	    } else {
	      return false;
	    }
	  };
	
	  Notifier.prototype.register = function(notification) {
	    this.queue[notification.id] = notification;
	    return notification.id;
	  };
	
	  Notifier.prototype.show = function(notification) {
	    notification.showIn(this.wrapper);
	    if (notification.duration > -1) {
	      notification.displayTimeout = setTimeout((function(_this) {
	        return function() {
	          return _this.remove(notification);
	        };
	      })(this), notification.duration * 1000);
	    }
	  };
	
	  Notifier.prototype.remove = function(notification) {
	    notification.remove();
	    if (this.queue[notification.id]) {
	      delete this.queue[notification.id];
	    }
	  };
	
	  return Notifier;
	
	})();
	
	NotifierInstance = new Notifier;
	
	module.exports = {
	  actionType: ActionType,
	  send: NotifierInstance.send.bind(NotifierInstance),
	  cancel: NotifierInstance.cancel.bind(NotifierInstance),
	  type: NotificationType
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var $, dom, domClass, domExtra, event, selector;
	
	selector = __webpack_require__(8);
	
	dom = __webpack_require__(9);
	
	domExtra = __webpack_require__(6);
	
	domClass = __webpack_require__(7);
	
	event = __webpack_require__(10);
	
	$ = selector.$;
	
	$.fn = {};
	
	$.fn.addClass = domClass.addClass;
	
	$.fn.appendTo = domExtra.appendTo;
	
	$.fn.on = event.on;
	
	$.fn.remove = domExtra.remove;
	
	$.fn.removeClass = domClass.removeClass;
	
	module.exports = $;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var assignWith = __webpack_require__(3),
	    baseAssign = __webpack_require__(4),
	    createAssigner = __webpack_require__(5);
	
	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it is invoked to produce the assigned values.
	 * The `customizer` is bound to `thisArg` and invoked with five arguments:
	 * (objectValue, sourceValue, key, object, source).
	 *
	 * **Note:** This method mutates `object` and is based on
	 * [`Object.assign`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign).
	 *
	 * @static
	 * @memberOf _
	 * @alias extend
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	 * // => { 'user': 'fred', 'age': 40 }
	 *
	 * // using a customizer callback
	 * var defaults = _.partialRight(_.assign, function(value, other) {
	 *   return _.isUndefined(value) ? other : value;
	 * });
	 *
	 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	 * // => { 'user': 'barney', 'age': 36 }
	 */
	var assign = createAssigner(function(object, source, customizer) {
	  return customizer
	    ? assignWith(object, source, customizer)
	    : baseAssign(object, source);
	});
	
	module.exports = assign;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(11);
	
	/**
	 * A specialized version of `_.assign` for customizing assigned values without
	 * support for argument juggling, multiple sources, and `this` binding `customizer`
	 * functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} customizer The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 */
	function assignWith(object, source, customizer) {
	  var index = -1,
	      props = keys(source),
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index],
	        value = object[key],
	        result = customizer(value, source[key], key, object, source);
	
	    if ((result === result ? (result !== value) : (value === value)) ||
	        (value === undefined && !(key in object))) {
	      object[key] = result;
	    }
	  }
	  return object;
	}
	
	module.exports = assignWith;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var baseCopy = __webpack_require__(12),
	    keys = __webpack_require__(11);
	
	/**
	 * The base implementation of `_.assign` without support for argument juggling,
	 * multiple sources, and `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return source == null
	    ? object
	    : baseCopy(source, keys(source), object);
	}
	
	module.exports = baseAssign;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var bindCallback = __webpack_require__(13),
	    isIterateeCall = __webpack_require__(14),
	    restParam = __webpack_require__(15);
	
	/**
	 * Creates a function that assigns properties of source object(s) to a given
	 * destination object.
	 *
	 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return restParam(function(object, sources) {
	    var index = -1,
	        length = object == null ? 0 : sources.length,
	        customizer = length > 2 ? sources[length - 2] : undefined,
	        guard = length > 2 ? sources[2] : undefined,
	        thisArg = length > 1 ? sources[length - 1] : undefined;
	
	    if (typeof customizer == 'function') {
	      customizer = bindCallback(customizer, thisArg, 5);
	      length -= 2;
	    } else {
	      customizer = typeof thisArg == 'function' ? thisArg : undefined;
	      length -= (customizer ? 1 : 0);
	    }
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module DOM (extra)
	 */
	
	var _each = __webpack_require__(16);
	
	var _append$before$after = __webpack_require__(9);
	
	var _$ = __webpack_require__(8);
	
	/**
	 * Append each element in the collection to the specified element(s).
	 *
	 * @param {Node|NodeList|Object} element What to append the element(s) to. Clones elements as necessary.
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.item').appendTo(container);
	 */
	
	function appendTo(element) {
	    var context = typeof element === 'string' ? _$.$(element) : element;
	    _append$before$after.append.call(context, this);
	    return this;
	}
	
	/*
	 * Empty each element in the collection.
	 *
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.item').empty();
	 */
	
	function empty() {
	    return _each.each(this, function (element) {
	        element.innerHTML = '';
	    });
	}
	
	/**
	 * Remove the collection from the DOM.
	 *
	 * @return {Array} Array containing the removed elements
	 * @example
	 *     $('.item').remove();
	 */
	
	function remove() {
	    return _each.each(this, function (element) {
	        if (element.parentNode) {
	            element.parentNode.removeChild(element);
	        }
	    });
	}
	
	/**
	 * Replace each element in the collection with the provided new content, and return the array of elements that were replaced.
	 *
	 * @return {Array} Array containing the replaced elements
	 */
	
	function replaceWith() {
	    return _append$before$after.before.apply(this, arguments).remove();
	}
	
	/**
	 * Get the `textContent` from the first, or set the `textContent` of each element in the collection.
	 *
	 * @param {String} [value]
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.item').text('New content');
	 */
	
	function text(value) {
	
	    if (value === undefined) {
	        return this[0].textContent;
	    }
	
	    _each.each(this, function (element) {
	        element.textContent = '' + value;
	    });
	
	    return this;
	}
	
	/**
	 * Get the `value` from the first, or set the `value` of each element in the collection.
	 *
	 * @param {String} [value]
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('input.firstName').value('New value');
	 */
	
	function val(value) {
	
	    if (value === undefined) {
	        return this[0].value;
	    }
	
	    _each.each(this, function (element) {
	        element.value = value;
	    });
	
	    return this;
	}
	
	/*
	 * Export interface
	 */
	
	exports.appendTo = appendTo;
	exports.empty = empty;
	exports.remove = remove;
	exports.replaceWith = replaceWith;
	exports.text = text;
	exports.val = val;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module Class
	 */
	
	var _each2 = __webpack_require__(16);
	
	/**
	 * Add a class to the element(s)
	 *
	 * @param {String} value Space-separated class name(s) to add to the element(s).
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.item').addClass('bar');
	 *     $('.item').addClass('bar foo');
	 */
	
	function addClass(value) {
	    if (value && value.length) {
	        _each2.each(value.split(' '), _each.bind(this, 'add'));
	    }
	    return this;
	}
	
	/**
	 * Remove a class from the element(s)
	 *
	 * @param {String} value Space-separated class name(s) to remove from the element(s).
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.items').removeClass('bar');
	 *     $('.items').removeClass('bar foo');
	 */
	
	function removeClass(value) {
	    if (value && value.length) {
	        _each2.each(value.split(' '), _each.bind(this, 'remove'));
	    }
	    return this;
	}
	
	/**
	 * Toggle a class at the element(s)
	 *
	 * @param {String} value Space-separated class name(s) to toggle at the element(s).
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.item').toggleClass('bar');
	 *     $('.item').toggleClass('bar foo');
	 */
	
	function toggleClass(value) {
	    if (value && value.length) {
	        _each2.each(value.split(' '), _each.bind(this, 'toggle'));
	    }
	    return this;
	}
	
	/**
	 * Check if the element(s) have a class.
	 *
	 * @param {String} value Check if the DOM element contains the class name. When applied to multiple elements,
	 * returns `true` if _any_ of them contains the class name.
	 * @return {Boolean} Whether the element's class attribute contains the class name.
	 * @example
	 *     $('.item').hasClass('bar');
	 */
	
	function hasClass(value) {
	    return (this.nodeType ? [this] : this).some(function (element) {
	        return element.classList.contains(value);
	    });
	}
	
	/**
	 * Specialized iteration, applying `fn` of the classList API to each element.
	 *
	 * @param {String} fnName
	 * @param {String} className
	 * @private
	 */
	
	function _each(fnName, className) {
	    _each2.each(this, function (element) {
	        element.classList[fnName](className);
	    });
	}
	
	/*
	 * Export interface
	 */
	
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.toggleClass = toggleClass;
	exports.hasClass = hasClass;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module Selector
	 */
	
	var _global$each = __webpack_require__(16);
	
	var isPrototypeSet = false,
	    reFragment = /^\s*<(\w+|!)[^>]*>/,
	    reSingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	    reSimpleSelector = /^[\.#]?[\w-]*$/;
	
	/*
	 * Versatile wrapper for `querySelectorAll`.
	 *
	 * @param {String|Node|NodeList|Array} selector Query selector, `Node`, `NodeList`, array of elements, or HTML fragment string.
	 * @param {String|Node|NodeList} context=document The context for the selector to query elements.
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     var $items = $(.items');
	 * @example
	 *     var $element = $(domElement);
	 * @example
	 *     var $list = $(nodeList, document.body);
	 * @example
	 *     var $element = $('<p>evergreen</p>');
	 */
	
	function $(selector) {
	    var context = arguments[1] === undefined ? document : arguments[1];
	
	    var collection;
	
	    if (!selector) {
	
	        collection = document.querySelectorAll(null);
	    } else if (selector instanceof Wrapper) {
	
	        return selector;
	    } else if (typeof selector !== 'string') {
	
	        collection = selector.nodeType || selector === window ? [selector] : selector;
	    } else if (reFragment.test(selector)) {
	
	        collection = createFragment(selector);
	    } else {
	
	        context = typeof context === 'string' ? document.querySelector(context) : context.length ? context[0] : context;
	
	        collection = querySelector(selector, context);
	    }
	
	    return wrap(collection);
	}
	
	/*
	 * Find descendants matching the provided `selector` for each element in the collection.
	 *
	 * @param {String|Node|NodeList|Array} selector Query selector, `Node`, `NodeList`, array of elements, or HTML fragment string.
	 * @return {Object} The wrapped collection
	 * @example
	 *     $('.selector').find('.deep').$('.deepest');
	 */
	
	function find(selector) {
	    var nodes = [];
	    _global$each.each(this, function (node) {
	        _global$each.each(querySelector(selector, node), function (child) {
	            if (nodes.indexOf(child) === -1) {
	                nodes.push(child);
	            }
	        });
	    });
	    return $(nodes);
	}
	
	/*
	 * Returns `true` if the element would be selected by the specified selector string; otherwise, returns `false`.
	 *
	 * @param {Node} element Element to test
	 * @param {String} selector Selector to match against element
	 * @return {Boolean}
	 *
	 * @example
	 *     $.matches(element, '.match');
	 */
	
	var matches = (function () {
	    var context = typeof Element !== 'undefined' ? Element.prototype : _global$each.global,
	        _matches = context.matches || context.matchesSelector || context.mozMatchesSelector || context.msMatchesSelector || context.oMatchesSelector || context.webkitMatchesSelector;
	    return function (element, selector) {
	        return _matches.call(element, selector);
	    };
	})();
	
	/*
	 * Use the faster `getElementById`, `getElementsByClassName` or `getElementsByTagName` over `querySelectorAll` if possible.
	 *
	 * @private
	 * @param {String} selector Query selector.
	 * @param {Node} context The context for the selector to query elements.
	 * @return {Object} NodeList, HTMLCollection, or Array of matching elements (depending on method used).
	 */
	
	function querySelector(selector, context) {
	
	    var isSimpleSelector = reSimpleSelector.test(selector);
	
	    if (isSimpleSelector) {
	        if (selector[0] === '#') {
	            var element = (context.getElementById ? context : document).getElementById(selector.slice(1));
	            return element ? [element] : [];
	        }
	        if (selector[0] === '.') {
	            return context.getElementsByClassName(selector.slice(1));
	        }
	        return context.getElementsByTagName(selector);
	    }
	
	    return context.querySelectorAll(selector);
	}
	
	/*
	 * Create DOM fragment from an HTML string
	 *
	 * @private
	 * @param {String} html String representing HTML.
	 * @return {NodeList}
	 */
	
	function createFragment(html) {
	
	    if (reSingleTag.test(html)) {
	        return [document.createElement(RegExp.$1)];
	    }
	
	    var elements = [],
	        container = document.createElement('div'),
	        children = container.childNodes;
	
	    container.innerHTML = html;
	
	    for (var i = 0, l = children.length; i < l; i++) {
	        elements.push(children[i]);
	    }
	
	    return elements;
	}
	
	/*
	 * Calling `$(selector)` returns a wrapped collection of elements.
	 *
	 * @private
	 * @param {NodeList|Array} collection Element(s) to wrap.
	 * @return (Object) The wrapped collection
	 */
	
	function wrap(collection) {
	
	    if (!isPrototypeSet) {
	        Wrapper.prototype = $.fn;
	        Wrapper.prototype.constructor = Wrapper;
	        isPrototypeSet = true;
	    }
	
	    return new Wrapper(collection);
	}
	
	/*
	 * Constructor for the Object.prototype strategy
	 *
	 * @constructor
	 * @private
	 * @param {NodeList|Array} collection Element(s) to wrap.
	 */
	
	function Wrapper(collection) {
	    var i = 0,
	        length = collection.length;
	    for (; i < length;) {
	        this[i] = collection[i++];
	    }
	    this.length = length;
	}
	
	/*
	 * Export interface
	 */
	
	exports.$ = $;
	exports.find = find;
	exports.matches = matches;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module DOM
	 */
	
	var _toArray = __webpack_require__(16);
	
	var _$ = __webpack_require__(8);
	
	var forEach = Array.prototype.forEach;
	
	/**
	 * Append element(s) to each element in the collection.
	 *
	 * @param {String|Node|NodeList|Object} element What to append to the element(s).
	 * Clones elements as necessary.
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.item').append('<p>more</p>');
	 */
	
	function append(element) {
	    if (this instanceof Node) {
	        if (typeof element === 'string') {
	            this.insertAdjacentHTML('beforeend', element);
	        } else {
	            if (element instanceof Node) {
	                this.appendChild(element);
	            } else {
	                var elements = element instanceof NodeList ? _toArray.toArray(element) : element;
	                forEach.call(elements, this.appendChild.bind(this));
	            }
	        }
	    } else {
	        _each(this, append, element);
	    }
	    return this;
	}
	
	/**
	 * Place element(s) at the beginning of each element in the collection.
	 *
	 * @param {String|Node|NodeList|Object} element What to place at the beginning of the element(s).
	 * Clones elements as necessary.
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.item').prepend('<span>start</span>');
	 */
	
	function prepend(element) {
	    if (this instanceof Node) {
	        if (typeof element === 'string') {
	            this.insertAdjacentHTML('afterbegin', element);
	        } else {
	            if (element instanceof Node) {
	                this.insertBefore(element, this.firstChild);
	            } else {
	                var elements = element instanceof NodeList ? _toArray.toArray(element) : element;
	                forEach.call(elements.reverse(), prepend.bind(this));
	            }
	        }
	    } else {
	        _each(this, prepend, element);
	    }
	    return this;
	}
	
	/**
	 * Place element(s) before each element in the collection.
	 *
	 * @param {String|Node|NodeList|Object} element What to place as sibling(s) before to the element(s).
	 * Clones elements as necessary.
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.items').before('<p>prefix</p>');
	 */
	
	function before(element) {
	    if (this instanceof Node) {
	        if (typeof element === 'string') {
	            this.insertAdjacentHTML('beforebegin', element);
	        } else {
	            if (element instanceof Node) {
	                this.parentNode.insertBefore(element, this);
	            } else {
	                var elements = element instanceof NodeList ? _toArray.toArray(element) : element;
	                forEach.call(elements, before.bind(this));
	            }
	        }
	    } else {
	        _each(this, before, element);
	    }
	    return this;
	}
	
	/**
	 * Place element(s) after each element in the collection.
	 *
	 * @param {String|Node|NodeList|Object} element What to place as sibling(s) after to the element(s). Clones elements as necessary.
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.items').after('<span>suf</span><span>fix</span>');
	 */
	
	function after(element) {
	    if (this instanceof Node) {
	        if (typeof element === 'string') {
	            this.insertAdjacentHTML('afterend', element);
	        } else {
	            if (element instanceof Node) {
	                this.parentNode.insertBefore(element, this.nextSibling);
	            } else {
	                var elements = element instanceof NodeList ? _toArray.toArray(element) : element;
	                forEach.call(elements.reverse(), after.bind(this));
	            }
	        }
	    } else {
	        _each(this, after, element);
	    }
	    return this;
	}
	
	/**
	 * Clone a wrapped object.
	 *
	 * @return {Object} Wrapped collection of cloned nodes.
	 * @example
	 *     $(element).clone();
	 */
	
	function clone() {
	    return _$.$(_clone(this));
	}
	
	/**
	 * Clone an object
	 *
	 * @param {String|Node|NodeList|Array} element The element(s) to clone.
	 * @return {String|Node|NodeList|Array} The cloned element(s)
	 * @private
	 */
	
	function _clone(element) {
	    if (typeof element === 'string') {
	        return element;
	    } else if (element instanceof Node) {
	        return element.cloneNode(true);
	    } else if ('length' in element) {
	        return [].map.call(element, function (el) {
	            return el.cloneNode(true);
	        });
	    }
	    return element;
	}
	
	/**
	 * Specialized iteration, applying `fn` in reversed manner to a clone of each element, but the provided one.
	 *
	 * @param {NodeList|Array} collection
	 * @param {Function} fn
	 * @param {Node} element
	 * @private
	 */
	
	function _each(collection, fn, element) {
	    var l = collection.length;
	    while (l--) {
	        var elm = l === 0 ? element : _clone(element);
	        fn.call(collection[l], elm);
	    }
	}
	
	/*
	 * Export interface
	 */
	
	exports.append = append;
	exports.prepend = prepend;
	exports.before = before;
	exports.after = after;
	exports.clone = clone;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module Events
	 */
	
	var _each = __webpack_require__(16);
	
	var _closest = __webpack_require__(17);
	
	/**
	 * Shorthand for `addEventListener`. Supports event delegation if a filter (`selector`) is provided.
	 *
	 * @param {String} eventNames List of space-separated event types to be added to the element(s)
	 * @param {String} [selector] Selector to filter descendants that delegate the event to this element.
	 * @param {Function} handler Event handler
	 * @param {Boolean} useCapture=false
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.item').on('click', callback);
	 *     $('.container').on('click focus', '.item', handler);
	 */
	
	function on(eventNames, selector, handler, useCapture) {
	
	    if (typeof selector === 'function') {
	        handler = selector;
	        selector = null;
	    }
	
	    var parts, namespace, eventListener;
	
	    eventNames.split(' ').forEach(function (eventName) {
	
	        parts = eventName.split('.');
	        eventName = parts[0] || null;
	        namespace = parts[1] || null;
	
	        eventListener = proxyHandler(handler);
	
	        _each.each(this, function (element) {
	
	            if (selector) {
	                eventListener = delegateHandler.bind(element, selector, eventListener);
	            }
	
	            element.addEventListener(eventName, eventListener, useCapture || false);
	
	            getHandlers(element).push({
	                eventName: eventName,
	                handler: handler,
	                eventListener: eventListener,
	                selector: selector,
	                namespace: namespace
	            });
	        });
	    }, this);
	
	    return this;
	}
	
	/**
	 * Shorthand for `removeEventListener`.
	 *
	 * @param {String} eventNames List of space-separated event types to be removed from the element(s)
	 * @param {String} [selector] Selector to filter descendants that undelegate the event to this element.
	 * @param {Function} handler Event handler
	 * @param {Boolean} useCapture=false
	 * @return {Object} The wrapped collection
	 * @chainable
	 * @example
	 *     $('.item').off('click', callback);
	 *     $('#my-element').off('myEvent myOtherEvent');
	 *     $('.item').off();
	 */
	
	function off(_x, selector, handler, useCapture) {
	    var eventNames = arguments[0] === undefined ? '' : arguments[0];
	
	    if (typeof selector === 'function') {
	        handler = selector;
	        selector = null;
	    }
	
	    var parts, namespace, handlers;
	
	    eventNames.split(' ').forEach(function (eventName) {
	
	        parts = eventName.split('.');
	        eventName = parts[0] || null;
	        namespace = parts[1] || null;
	
	        _each.each(this, function (element) {
	
	            handlers = getHandlers(element);
	
	            _each.each(handlers.filter(function (item) {
	                return (!eventName || item.eventName === eventName) && (!namespace || item.namespace === namespace) && (!handler || item.handler === handler) && (!selector || item.selector === selector);
	            }), function (item) {
	                element.removeEventListener(item.eventName, item.eventListener, useCapture || false);
	                handlers.splice(handlers.indexOf(item), 1);
	            });
	
	            if (!eventName && !namespace && !selector && !handler) {
	                clearHandlers(element);
	            } else if (handlers.length === 0) {
	                clearHandlers(element);
	            }
	        });
	    }, this);
	
	    return this;
	}
	
	/**
	 * Get event handlers from an element
	 *
	 * @private
	 * @param {Node} element
	 * @return {Array}
	 */
	
	var eventKeyProp = '__domtastic_event__';
	var id = 1;
	var handlers = {};
	var unusedKeys = [];
	
	function getHandlers(element) {
	    if (!element[eventKeyProp]) {
	        element[eventKeyProp] = unusedKeys.length === 0 ? ++id : unusedKeys.pop();
	    }
	    var key = element[eventKeyProp];
	    return handlers[key] || (handlers[key] = []);
	}
	
	/**
	 * Clear event handlers for an element
	 *
	 * @private
	 * @param {Node} element
	 */
	
	function clearHandlers(element) {
	    var key = element[eventKeyProp];
	    if (handlers[key]) {
	        handlers[key] = null;
	        element[key] = null;
	        unusedKeys.push(key);
	    }
	}
	
	/**
	 * Function to create a handler that augments the event object with some extra methods,
	 * and executes the callback with the event and the event data (i.e. `event.detail`).
	 *
	 * @private
	 * @param handler Callback to execute as `handler(event, data)`
	 * @return {Function}
	 */
	
	function proxyHandler(handler) {
	    return function (event) {
	        handler.call(this, augmentEvent(event), event.detail);
	    };
	}
	
	/**
	 * Attempt to augment events and implement something closer to DOM Level 3 Events.
	 *
	 * @private
	 * @param {Object} event
	 * @return {Function}
	 */
	
	var augmentEvent = (function () {
	
	    var methodName,
	        eventMethods = {
	        preventDefault: 'isDefaultPrevented',
	        stopImmediatePropagation: 'isImmediatePropagationStopped',
	        stopPropagation: 'isPropagationStopped'
	    },
	        returnTrue = function returnTrue() {
	        return true;
	    },
	        returnFalse = function returnFalse() {
	        return false;
	    };
	
	    return function (event) {
	        if (!event.isDefaultPrevented || event.stopImmediatePropagation || event.stopPropagation) {
	            for (methodName in eventMethods) {
	                (function (methodName, testMethodName, originalMethod) {
	                    event[methodName] = function () {
	                        this[testMethodName] = returnTrue;
	                        return originalMethod && originalMethod.apply(this, arguments);
	                    };
	                    event[testMethodName] = returnFalse;
	                })(methodName, eventMethods[methodName], event[methodName]);
	            }
	            if (event._preventDefault) {
	                event.preventDefault();
	            }
	        }
	        return event;
	    };
	})();
	
	/**
	 * Function to test whether delegated events match the provided `selector` (filter),
	 * if the event propagation was stopped, and then actually call the provided event handler.
	 * Use `this` instead of `event.currentTarget` on the event object.
	 *
	 * @private
	 * @param {String} selector Selector to filter descendants that undelegate the event to this element.
	 * @param {Function} handler Event handler
	 * @param {Event} event
	 */
	
	function delegateHandler(selector, handler, event) {
	    var eventTarget = event._target || event.target,
	        currentTarget = _closest.closest.call([eventTarget], selector, this)[0];
	    if (currentTarget && currentTarget !== this) {
	        if (currentTarget === eventTarget || !(event.isPropagationStopped && event.isPropagationStopped())) {
	            handler.call(currentTarget, event);
	        }
	    }
	}
	
	var bind = on,
	    unbind = off;
	
	/*
	 * Export interface
	 */
	
	exports.on = on;
	exports.off = off;
	exports.bind = bind;
	exports.unbind = unbind;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(18),
	    isArrayLike = __webpack_require__(19),
	    isObject = __webpack_require__(20),
	    shimKeys = __webpack_require__(21);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object == null ? null : object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};
	
	module.exports = keys;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property names to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @returns {Object} Returns `object`.
	 */
	function baseCopy(source, props, object) {
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}
	
	module.exports = baseCopy;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(22);
	
	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}
	
	module.exports = bindCallback;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(19),
	    isIndex = __webpack_require__(23),
	    isObject = __webpack_require__(20);
	
	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	      ? (isArrayLike(object) && isIndex(index, object.length))
	      : (type == 'string' && index in object)) {
	    var other = object[index];
	    return value === value ? (value === other) : (other !== other);
	  }
	  return false;
	}
	
	module.exports = isIterateeCall;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);
	
	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}
	
	module.exports = restParam;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/*
	 * @module Util
	 */
	
	/*
	 * Reference to the global scope
	 * @private
	 */
	
	var global = new Function("return this")();
	
	/**
	 * Convert `NodeList` to `Array`.
	 *
	 * @param {NodeList|Array} collection
	 * @return {Array}
	 * @private
	 */
	
	function toArray(collection) {
	    var length = collection.length,
	        result = new Array(length);
	    for (var i = 0; i < length; i++) {
	        result[i] = collection[i];
	    }
	    return result;
	}
	
	/**
	 * Faster alternative to [].forEach method
	 *
	 * @param {Node|NodeList|Array} collection
	 * @param {Function} callback
	 * @return {Node|NodeList|Array}
	 * @private
	 */
	
	function each(collection, callback, thisArg) {
	    var length = collection.length;
	    if (length !== undefined && collection.nodeType === undefined) {
	        for (var i = 0; i < length; i++) {
	            callback.call(thisArg, collection[i], i, collection);
	        }
	    } else {
	        callback.call(thisArg, collection, 0, collection);
	    }
	    return collection;
	}
	
	/**
	 * Assign enumerable properties from source object(s) to target object
	 *
	 * @method extend
	 * @param {Object} target Object to extend
	 * @param {Object} [source] Object to extend from
	 * @return {Object} Extended object
	 * @example
	 *     $.extend({a: 1}, {b: 2});
	 *     // {a: 1, b: 2}
	 * @example
	 *     $.extend({a: 1}, {b: 2}, {a: 3});
	 *     // {a: 3, b: 2}
	 */
	
	function extend(target) {
	    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        sources[_key - 1] = arguments[_key];
	    }
	
	    sources.forEach(function (src) {
	        for (var prop in src) {
	            target[prop] = src[prop];
	        }
	    });
	    return target;
	}
	
	/**
	 * Return the collection without duplicates
	 *
	 * @param collection Collection to remove duplicates from
	 * @return {Node|NodeList|Array}
	 * @private
	 */
	
	function uniq(collection) {
	    return collection.filter(function (item, index) {
	        return collection.indexOf(item) === index;
	    });
	}
	
	/*
	 * Export interface
	 */
	
	exports.global = global;
	exports.toArray = toArray;
	exports.each = each;
	exports.extend = extend;
	exports.uniq = uniq;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module closest
	 */
	
	var _$$matches = __webpack_require__(8);
	
	var _each$uniq = __webpack_require__(16);
	
	/**
	 * Return the closest element matching the selector (starting by itself) for each element in the collection.
	 *
	 * @param {String} selector Filter
	 * @param {Object} [context] If provided, matching elements must be a descendant of this element
	 * @return {Object} New wrapped collection (containing zero or one element)
	 * @chainable
	 * @example
	 *     $('.selector').closest('.container');
	 */
	
	var closest = (function () {
	
	    function closest(selector, context) {
	        var nodes = [];
	        _each$uniq.each(this, function (node) {
	            while (node && node !== context) {
	                if (_$$matches.matches(node, selector)) {
	                    nodes.push(node);
	                    break;
	                }
	                node = node.parentElement;
	            }
	        });
	        return _$$matches.$(_each$uniq.uniq(nodes));
	    }
	
	    return !Element.prototype.closest ? closest : function (selector, context) {
	        if (!context) {
	            var nodes = [];
	            _each$uniq.each(this, function (node) {
	                var n = node.closest(selector);
	                if (n) {
	                    nodes.push(n);
	                }
	            });
	            return _$$matches.$(_each$uniq.uniq(nodes));
	        } else {
	            return closest.call(this, selector, context);
	        }
	    };
	})();
	
	/*
	 * Export interface
	 */
	
	exports.closest = closest;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(24);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}
	
	module.exports = getNative;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(25),
	    isLength = __webpack_require__(26);
	
	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}
	
	module.exports = isArrayLike;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(27),
	    isArray = __webpack_require__(28),
	    isIndex = __webpack_require__(23),
	    isLength = __webpack_require__(26),
	    keysIn = __webpack_require__(29);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;
	
	  var allowIndexes = !!length && isLength(length) &&
	    (isArray(object) || isArguments(object));
	
	  var index = -1,
	      result = [];
	
	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = shimKeys;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;
	
	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	module.exports = isIndex;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var escapeRegExp = __webpack_require__(30),
	    isObjectLike = __webpack_require__(31);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  escapeRegExp(fnToString.call(hasOwnProperty))
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (objToString.call(value) == funcTag) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = isNative;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(32);
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	module.exports = getLength;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(19),
	    isObjectLike = __webpack_require__(31);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) && objToString.call(value) == argsTag;
	}
	
	module.exports = isArguments;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(18),
	    isLength = __webpack_require__(26),
	    isObjectLike = __webpack_require__(31);
	
	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};
	
	module.exports = isArray;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(27),
	    isArray = __webpack_require__(28),
	    isIndex = __webpack_require__(23),
	    isLength = __webpack_require__(26),
	    isObject = __webpack_require__(20);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;
	
	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;
	
	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keysIn;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(33);
	
	/**
	 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
	 * In addition to special characters the forward slash is escaped to allow for
	 * easier `eval` use and `Function` compilation.
	 */
	var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	    reHasRegExpChars = RegExp(reRegExpChars.source);
	
	/**
	 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
	 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
	 */
	function escapeRegExp(string) {
	  string = baseToString(string);
	  return (string && reHasRegExpChars.test(string))
	    ? string.replace(reRegExpChars, '\\$&')
	    : string;
	}
	
	module.exports = escapeRegExp;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	module.exports = baseProperty;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  if (typeof value == 'string') {
	    return value;
	  }
	  return value == null ? '' : (value + '');
	}
	
	module.exports = baseToString;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA3NDRhMWFhYzA5MDU3ZWQyNTczZiIsIndlYnBhY2s6Ly8vLi9zcmMvbm90aWZpZXIuY29mZmVlIiwid2VicGFjazovLy8uL3NyYy9kb210YXN0aWMtc3Vic2V0LmNvZmZlZSIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9vYmplY3QvYXNzaWduLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2Fzc2lnbldpdGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvYmFzZUFzc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9jcmVhdGVBc3NpZ25lci5qcyIsIndlYnBhY2s6Ly8vLi9+L2RvbXRhc3RpYy9jb21tb25qcy9kb20vZXh0cmEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9kb210YXN0aWMvY29tbW9uanMvZG9tL2NsYXNzLmpzIiwid2VicGFjazovLy8uL34vZG9tdGFzdGljL2NvbW1vbmpzL3NlbGVjdG9yL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vZG9tdGFzdGljL2NvbW1vbmpzL2RvbS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2RvbXRhc3RpYy9jb21tb25qcy9ldmVudC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9vYmplY3Qva2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9iYXNlQ29weS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9iaW5kQ2FsbGJhY2suanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvaXNJdGVyYXRlZUNhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvZnVuY3Rpb24vcmVzdFBhcmFtLmpzIiwid2VicGFjazovLy8uL34vZG9tdGFzdGljL2NvbW1vbmpzL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9kb210YXN0aWMvY29tbW9uanMvc2VsZWN0b3IvY2xvc2VzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9nZXROYXRpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvaXNBcnJheUxpa2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvbGFuZy9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9zaGltS2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC91dGlsaXR5L2lkZW50aXR5LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2lzSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvbGFuZy9pc05hdGl2ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvaXNMZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvbGFuZy9pc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9sYW5nL2lzQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvb2JqZWN0L2tleXNJbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9zdHJpbmcvZXNjYXBlUmVnRXhwLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2lzT2JqZWN0TGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9iYXNlUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvYmFzZVRvU3RyaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVB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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxFQUFFO0FBQ2IsWUFBVyxPQUFPO0FBQ2xCLGNBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN2QkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsRUFBRTtBQUNiLGNBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDeERBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLGNBQWEsRUFBRTtBQUNmO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsRUFBRTtBQUNiLGNBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ25CQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsRUFBRTtBQUNiLGNBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0EsOEJBQTZCLGtCQUFrQixFQUFFO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNuQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxFQUFFO0FBQ2IsY0FBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUIsa0JBQWtCLEVBQUU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLGNBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMvREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0Esb0NBQW1DLFFBQVE7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEIsY0FBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLEVBQUU7QUFDYixjQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixjQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsRUFBRTtBQUNiLGNBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJub3RpZmllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTm90aWZpZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTm90aWZpZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDc0NGExYWFjMDkwNTdlZDI1NzNmXG4gKiovIiwiJCAgICAgICA9IHJlcXVpcmUgJy4vZG9tdGFzdGljLXN1YnNldC5jb2ZmZWUnXG5hc3NpZ24gID0gcmVxdWlyZSAnbG9kYXNoL29iamVjdC9hc3NpZ24nXG5cblxuIyMjXG4jIFNvbWUgc2V0dGluZ3NcbiMjI1xuYmVtV3JhcHBlciA9ICdlZWdub3RpZnMnXG5iZW1JdGVtICAgID0gJ2VlZ25vdGlmJ1xuXG5cbiMjI1xuIyBtaW5pbWFsIFVVSURcbiMjI1xuX3V1aWQgPSAwOyB1dWlkID0gLT4gKytfdXVpZFxuXG5cbiMjI1xuIyBOb3RpZmljYXRpb24gdHlwZVxuIyMjXG5Ob3RpZmljYXRpb25UeXBlID1cblx0SU5GTyAgICA6ICdpbmZvJ1xuXHRTVUNDRVNTIDogJ3N1Y2Nlc3MnXG5cdFdBUk4gICAgOiAnd2Fybidcblx0RVJST1IgICA6ICdlcnJvcidcblx0REVCVUcgICA6ICdkZWJ1Zydcblx0Q1VTVE9NICA6ICdjdXN0b20nXG5cbkFjdGlvblR5cGUgPVxuXHRERUZBVUxUIDogJ2RlZmF1bHQnXG5cdFBSSU1BUlkgOiAncHJpbWFyeSdcblx0REFOR0VSICA6ICdkYW5nZXInXG5cdENVU1RPTSAgOiAnY3VzdG9tJ1xuXG5cbiMjI1xuIyBOb3RpZmljYXRpb24gY2xhc3NcbiMjI1xuY2xhc3MgQW5pbWF0b3JcblxuXHRUSUNLIDogMTdcblxuXHRvcHRpb25zIDpcblx0XHRkdXJhdGlvbiA6IDIwMFxuXHRcdGFuaW1hdGlvbiA6ICdub3RpZmljYXRpb24nXG5cblx0Y29uc3RydWN0b3IgOiAoRE9NTm9kZSwgb3B0aW9ucyA9IHt9KSAtPlxuXHRcdCMgU2V0IG9wdGlvbnNcblx0XHRhc3NpZ24gQG9wdGlvbnMsIG9wdGlvbnNcblxuXHRcdEBET01Ob2RlID0gRE9NTm9kZVxuXHRcdEBjbGFzc05hbWVRdWV1ZSA9IFtdXG5cdFx0QHRpbWVvdXQgPSBudWxsXG5cblx0XHRyZXR1cm5cblxuXHR0cmFuc2l0aW9uIDogKGFuaW1hdGlvblR5cGUsIGZpbmlzaENhbGxiYWNrKSAtPlxuXHRcdGNsYXNzTmFtZSAgICAgICA9IFwiI3tAb3B0aW9ucy5hbmltYXRpb259LSN7YW5pbWF0aW9uVHlwZX1cIlxuXHRcdGFjdGl2ZUNsYXNzTmFtZSA9IFwiI3tjbGFzc05hbWV9LWFjdGl2ZVwiXG5cdFx0QERPTU5vZGUuYWRkQ2xhc3MgY2xhc3NOYW1lXG5cdFx0QHF1ZXVlQ2xhc3MgYWN0aXZlQ2xhc3NOYW1lXG5cblx0XHRzZXRUaW1lb3V0ID0+XG5cdFx0XHRARE9NTm9kZS5yZW1vdmVDbGFzcyBcIiN7Y2xhc3NOYW1lfSAje2FjdGl2ZUNsYXNzTmFtZX1cIlxuXHRcdFx0ZmluaXNoQ2FsbGJhY2soKSBpZiBmaW5pc2hDYWxsYmFjaz9cblx0XHQsIEBvcHRpb25zLmR1cmF0aW9uXG5cblx0cXVldWVDbGFzcyA6IChjbGFzc05hbWUpIC0+XG5cdFx0QGNsYXNzTmFtZVF1ZXVlLnB1c2ggY2xhc3NOYW1lXG5cblx0XHRpZiAhIEB0aW1lb3V0XG5cdFx0XHRAdGltZW91dCA9IHNldFRpbWVvdXQgQGZsdXNoQ2xhc3NOYW1lUXVldWUuYmluZChAKSwgQFRJQ0tcblxuXHRcdHJldHVyblxuXG5cdGZsdXNoQ2xhc3NOYW1lUXVldWUgOiAtPlxuXHRcdGZvciBjbGFzc05hbWUgaW4gQGNsYXNzTmFtZVF1ZXVlXG5cdFx0XHRARE9NTm9kZS5hZGRDbGFzcyBjbGFzc05hbWVcblxuXHRcdEBjbGFzc05hbWVRdWV1ZS5sZW5ndGggPSAwXG5cdFx0QHRpbWVvdXQgPSBudWxsXG5cblx0XHRyZXR1cm5cblxuXG4jIyNcbiMgTm90aWZpY2F0aW9uIGNsYXNzXG4jIyNcbmNsYXNzIE5vdGlmaWNhdGlvblxuXG5cdGRlZmF1bHRzIDpcblx0XHRhY3Rpb25zICAgICAgOiBbXVxuXHRcdGNsb3NlT25DbGljayA6IGZhbHNlICAgICAgICAgICAgICAgICAgIyBOT1QgSU1QTEVNRU5URURcblx0XHRkZWxheSAgICAgICAgOiAwXG5cdFx0ZHVyYXRpb24gICAgIDogNlxuXHRcdGljb24gICAgICAgICA6IHRydWUgICAgICAgICAgICAgICAgICAgIyAoZm9udCBpY29uICgvYmFzZTY0L2ltZyB1cmwpXG5cdFx0bW9kYWwgICAgICAgIDogZmFsc2Vcblx0XHR0ZW1wbGF0ZSAgICAgOiAnZGVmYXVsdCdcblx0XHR0ZXh0ICAgICAgICAgOiAnSGVsbG8gd29ybGQgISdcblx0XHR0eXBlICAgICAgICAgOiBOb3RpZmljYXRpb25UeXBlLklORk9cblxuXG5cdGFjdGlvbkRlZmF1bHRzIDpcblx0XHRjbGFzc05hbWUgOiAnJ1xuXHRcdGZuICAgICAgICA6ID0+IEByZW1vdmUoKVxuXHRcdGxhYmVsICAgICA6ICdCdXR0b24nXG5cdFx0dHlwZSAgICAgIDogQWN0aW9uVHlwZS5ERUZBVUxUXG5cblxuXHRjb25zdHJ1Y3RvcjogKHBhcmFtcykgLT5cblx0XHRARE9NTm9kZSA9IG51bGxcblxuXHRcdGFzc2lnbiBALCBAZGVmYXVsdHMsIHBhcmFtcywgaWQgOiB1dWlkKClcblxuXG5cdF9jb25zdHJ1Y3RET01Ob2RlOiAtPlxuXHRcdGNsYXNzZXMgPSBbXG5cdFx0XHRiZW1JdGVtLFxuXHRcdFx0XCIje2JlbUl0ZW19LS0je0B0eXBlfVwiXG5cdFx0XVxuXG5cdFx0Y2xhc3Nlcy5wdXNoIFwiI3tiZW1JdGVtfS0taWNvblwiIGlmIEBpY29uXG5cdFx0Y2xhc3Nlcy5wdXNoIFwiI3tiZW1JdGVtfS0tbW9kYWxcIiBpZiBAbW9kYWxcblxuXHRcdEBET01Ob2RlID0gJCBcIlxuXHRcdFx0PGRpdiBjbGFzcz0nI3tjbGFzc2VzLmpvaW4oJyAnKX0nIGlkPScje2JlbUl0ZW19LS0je0BpZH0nPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPScje2JlbUl0ZW19X19jb250ZW50Jz4je0B0ZXh0fTwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XCJcblxuXHRcdEBfc2V0QWN0aW9ucygpXG5cdFx0QF9zZXRDb250cm9scygpXG5cblx0XHRyZXR1cm4gQERPTU5vZGVcblxuXG5cdF9zZXRDb250cm9sczogLT5cblx0XHRpZiBub3QgQG1vZGFsXG5cdFx0XHQjIENsb3NlIGNvbnRyb2xcblx0XHRcdCQoXCI8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9JyN7YmVtSXRlbX1fX2NvbnRyb2wtLWNsb3NlJz48aSBjbGFzcz0naWNvbi1jbG9zZS1jaXJjbGUnIC8+PC9idXR0b24+XCIpXG5cdFx0XHRcdC5vbiAnY2xpY2snLCAoZSkgPT4gQHJlbW92ZSgpXG5cdFx0XHRcdC5hcHBlbmRUbyBARE9NTm9kZVxuXG5cdFx0cmV0dXJuXG5cblxuXHRfc2V0QWN0aW9uczogLT5cblx0XHRpZiBAYWN0aW9ucy5sZW5ndGhcblx0XHRcdGFjdGlvbnMgPSAkKFwiPGRpdiBjbGFzcz0nI3tiZW1JdGVtfV9fYWN0aW9ucycgLz5cIikuYXBwZW5kVG8gQERPTU5vZGVcblxuXHRcdFx0Zm9yIGFjdGlvbiBpbiBAYWN0aW9uc1xuXHRcdFx0XHRkbyAoYWN0aW9uKSA9PlxuXHRcdFx0XHRcdCMgU2V0IGRlZmF1bHQgYWN0aW9uIHBhcmFtc1xuXHRcdFx0XHRcdGFjdGlvbiA9IGFzc2lnbiB7fSwgQGFjdGlvbkRlZmF1bHRzLCBhY3Rpb25cblxuXHRcdFx0XHRcdCQoXCI8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9JyN7YmVtSXRlbX1fX2FjdGlvbiAje2JlbUl0ZW19X19hY3Rpb24tLSN7YWN0aW9uLnR5cGV9ICN7YWN0aW9uLmNsYXNzTmFtZX0nPiN7YWN0aW9uLmxhYmVsfTwvYnV0dG9uPlwiKVxuXHRcdFx0XHRcdFx0Lm9uICdjbGljaycsIChlKSA9PiBhY3Rpb24uZm4uYXBwbHkgQCwgZVxuXHRcdFx0XHRcdFx0LmFwcGVuZFRvIGFjdGlvbnNcblxuXG5cdF9nZXRBbmltYXRvcjogLT5cblx0XHRyZXR1cm4gQERPTUFuaW1hdG9yIGlmIEBET01BbmltYXRvcj9cblxuXHRcdEBET01BbmltYXRvciA9IG5ldyBBbmltYXRvciBAZ2V0RE9NTm9kZSgpXG5cblx0XHRyZXR1cm4gQERPTUFuaW1hdG9yXG5cblxuXHRnZXRET01Ob2RlOiAtPiBpZiBARE9NTm9kZT8gdGhlbiBARE9NTm9kZSBlbHNlIEBfY29uc3RydWN0RE9NTm9kZSgpXG5cblxuXHRzaG93SW46ICh0YXJnZXQsIGZpbmlzaENhbGxiYWNrKSAtPlxuXHRcdEBnZXRET01Ob2RlKCkuYXBwZW5kVG8gdGFyZ2V0XG5cdFx0QF9nZXRBbmltYXRvcigpLnRyYW5zaXRpb24gJ2VudGVyJywgZmluaXNoQ2FsbGJhY2tcblxuXG5cdHJlbW92ZTogKGZpbmlzaENhbGxiYWNrKSAtPlxuXHRcdEBfZ2V0QW5pbWF0b3IoKS50cmFuc2l0aW9uICdsZWF2ZScsID0+XG5cdFx0XHRmaW5pc2hDYWxsYmFjaygpIGlmIGZpbmlzaENhbGxiYWNrP1xuXHRcdFx0QGdldERPTU5vZGUoKS5yZW1vdmUoKVxuXG4jIyNcbiMgTm90aWZpZXIgY2xhc3NcbiMjI1xuY2xhc3MgTm90aWZpZXJcblxuXHRcdGNvbnN0cnVjdG9yOiAtPlxuXHRcdFx0IyBBZGQgbm90aWZpY2F0aW9ucyB3cmFwcGVyIHRvIGRvY3VtZW50XG5cdFx0XHRAd3JhcHBlciA9ICQoXCI8ZGl2IGNsYXNzPScje2JlbVdyYXBwZXJ9Jz48L2Rpdj5cIikuYXBwZW5kVG8gZG9jdW1lbnQuYm9keVxuXG5cdFx0XHQjIFByZXBhcmUgZW1wdHkgcXVldWVcblx0XHRcdEBxdWV1ZSA9IHt9XG5cblx0XHRcdHJldHVyblxuXG5cblx0XHRzZW5kOiAocGFyYW1zKSAtPlxuXHRcdFx0IyBDcmVhdGUgYSBub3RpZmljYXRpb25cblx0XHRcdG5vdGlmaWNhdGlvbiA9IG5ldyBOb3RpZmljYXRpb24gcGFyYW1zXG5cblx0XHRcdCMgS2VlcCBub3RpZmljYXRpb25cblx0XHRcdGlkID0gQHJlZ2lzdGVyIG5vdGlmaWNhdGlvblxuXG5cdFx0XHQjIFNob3cgbm90aWZcblx0XHRcdG5vdGlmaWNhdGlvbi5kZWxheVRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG5cdFx0XHRcdEBzaG93IG5vdGlmaWNhdGlvblxuXHRcdFx0LCBub3RpZmljYXRpb24uZGVsYXkgKiAxMDAwXG5cblx0XHRcdCMgU2VuZCBiYWNrIGlkIGZvciBjYW5jZWxsYXRpb25cblx0XHRcdHJldHVybiBpZFxuXG5cblx0XHRjYW5jZWw6IChpZCkgLT5cblx0XHRcdGlmIEBxdWV1ZVtpZF1cblx0XHRcdFx0Y2xlYXJUaW1lb3V0IEBxdWV1ZVtpZF0uZGVsYXlUaW1lb3V0XG5cdFx0XHRcdGRlbGV0ZSBAcXVldWVbaWRdXG5cdFx0XHRcdHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZmFsc2VcblxuXG5cdFx0cmVnaXN0ZXI6IChub3RpZmljYXRpb24pIC0+XG5cdFx0XHRAcXVldWVbbm90aWZpY2F0aW9uLmlkXSA9IG5vdGlmaWNhdGlvblxuXG5cdFx0XHRyZXR1cm4gbm90aWZpY2F0aW9uLmlkXG5cblxuXHRcdHNob3c6IChub3RpZmljYXRpb24pIC0+XG5cdFx0XHRub3RpZmljYXRpb24uc2hvd0luIEB3cmFwcGVyXG5cblx0XHRcdCMgU2F2ZSByZW1vdmUgZXZlbnRcblx0XHRcdGlmIG5vdGlmaWNhdGlvbi5kdXJhdGlvbiA+IC0xXG5cdFx0XHRcdG5vdGlmaWNhdGlvbi5kaXNwbGF5VGltZW91dCA9IHNldFRpbWVvdXQgPT5cblx0XHRcdFx0XHRAcmVtb3ZlIG5vdGlmaWNhdGlvblxuXHRcdFx0XHQsIG5vdGlmaWNhdGlvbi5kdXJhdGlvbiAqIDEwMDBcblxuXHRcdFx0cmV0dXJuXG5cblxuXHRcdHJlbW92ZTogKG5vdGlmaWNhdGlvbikgLT5cblx0XHRcdG5vdGlmaWNhdGlvbi5yZW1vdmUoKVxuXHRcdFx0ZGVsZXRlIEBxdWV1ZVtub3RpZmljYXRpb24uaWRdIGlmIEBxdWV1ZVtub3RpZmljYXRpb24uaWRdXG5cblx0XHRcdHJldHVyblxuXG5cbk5vdGlmaWVySW5zdGFuY2UgPSBuZXcgTm90aWZpZXJcblxuXG4jIFJldHVybiBhbiBpbnN0YW5jZSBvZiB0aGUgbm90aWZpZXIgc2VydmljZVxubW9kdWxlLmV4cG9ydHMgPVxuXHRhY3Rpb25UeXBlICAgOiBBY3Rpb25UeXBlXG5cdHNlbmQgICAgICAgICA6IE5vdGlmaWVySW5zdGFuY2Uuc2VuZC5iaW5kIE5vdGlmaWVySW5zdGFuY2Vcblx0Y2FuY2VsICAgICAgIDogTm90aWZpZXJJbnN0YW5jZS5jYW5jZWwuYmluZCBOb3RpZmllckluc3RhbmNlXG5cdHR5cGUgICAgICAgICA6IE5vdGlmaWNhdGlvblR5cGVcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL25vdGlmaWVyLmNvZmZlZVxuICoqLyIsInNlbGVjdG9yID0gcmVxdWlyZSAnZG9tdGFzdGljL2NvbW1vbmpzL3NlbGVjdG9yJ1xuZG9tICAgICAgPSByZXF1aXJlICdkb210YXN0aWMvY29tbW9uanMvZG9tJ1xuZG9tRXh0cmEgPSByZXF1aXJlICdkb210YXN0aWMvY29tbW9uanMvZG9tL2V4dHJhJ1xuZG9tQ2xhc3MgPSByZXF1aXJlICdkb210YXN0aWMvY29tbW9uanMvZG9tL2NsYXNzJ1xuZXZlbnQgICAgPSByZXF1aXJlICdkb210YXN0aWMvY29tbW9uanMvZXZlbnQnXG5cbiQgICAgICAgICAgICAgICAgPSBzZWxlY3Rvci4kXG4kLmZuICAgICAgICAgICAgID0ge31cbiQuZm4uYWRkQ2xhc3MgICAgPSBkb21DbGFzcy5hZGRDbGFzc1xuJC5mbi5hcHBlbmRUbyAgICA9IGRvbUV4dHJhLmFwcGVuZFRvXG4kLmZuLm9uICAgICAgICAgID0gZXZlbnQub25cbiQuZm4ucmVtb3ZlICAgICAgPSBkb21FeHRyYS5yZW1vdmVcbiQuZm4ucmVtb3ZlQ2xhc3MgPSBkb21DbGFzcy5yZW1vdmVDbGFzc1xuXG5tb2R1bGUuZXhwb3J0cyA9ICRcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RvbXRhc3RpYy1zdWJzZXQuY29mZmVlXG4gKiovIiwidmFyIGFzc2lnbldpdGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9hc3NpZ25XaXRoJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VBc3NpZ24nKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gKiBvYmplY3QuIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqIElmIGBjdXN0b21pemVyYCBpcyBwcm92aWRlZCBpdCBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGFzc2lnbmVkIHZhbHVlcy5cbiAqIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggZml2ZSBhcmd1bWVudHM6XG4gKiAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgYmFzZWQgb25cbiAqIFtgT2JqZWN0LmFzc2lnbmBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QuYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGV4dGVuZFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5hc3NpZ24oeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDQwIH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGRlZmF1bHRzID0gXy5wYXJ0aWFsUmlnaHQoXy5hc3NpZ24sIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICogICByZXR1cm4gXy5pc1VuZGVmaW5lZCh2YWx1ZSkgPyBvdGhlciA6IHZhbHVlO1xuICogfSk7XG4gKlxuICogZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICByZXR1cm4gY3VzdG9taXplclxuICAgID8gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcilcbiAgICA6IGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL29iamVjdC9hc3NpZ24uanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmFzc2lnbmAgZm9yIGN1c3RvbWl6aW5nIGFzc2lnbmVkIHZhbHVlcyB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZywgbXVsdGlwbGUgc291cmNlcywgYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYFxuICogZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbldpdGgob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBwcm9wcyA9IGtleXMoc291cmNlKSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIodmFsdWUsIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKTtcblxuICAgIGlmICgocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkgfHxcbiAgICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbldpdGg7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvYXNzaWduV2l0aC5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBiYXNlQ29weSA9IHJlcXVpcmUoJy4vYmFzZUNvcHknKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmcsXG4gKiBtdWx0aXBsZSBzb3VyY2VzLCBhbmQgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIHNvdXJjZSA9PSBudWxsXG4gICAgPyBvYmplY3RcbiAgICA6IGJhc2VDb3B5KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvYmFzZUFzc2lnbi5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuL2JpbmRDYWxsYmFjaycpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHJlc3RQYXJhbSA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uL3Jlc3RQYXJhbScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGFzc2lnbnMgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0KHMpIHRvIGEgZ2l2ZW5cbiAqIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNyZWF0ZSBgXy5hc3NpZ25gLCBgXy5kZWZhdWx0c2AsIGFuZCBgXy5tZXJnZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiByZXN0UGFyYW0oZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG9iamVjdCA9PSBudWxsID8gMCA6IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbbGVuZ3RoIC0gMl0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQsXG4gICAgICAgIHRoaXNBcmcgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjdXN0b21pemVyID0gYmluZENhbGxiYWNrKGN1c3RvbWl6ZXIsIHRoaXNBcmcsIDUpO1xuICAgICAgbGVuZ3RoIC09IDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSB0eXBlb2YgdGhpc0FyZyA9PSAnZnVuY3Rpb24nID8gdGhpc0FyZyA6IHVuZGVmaW5lZDtcbiAgICAgIGxlbmd0aCAtPSAoY3VzdG9taXplciA/IDEgOiAwKTtcbiAgICB9XG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBc3NpZ25lcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9jcmVhdGVBc3NpZ25lci5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbi8qKlxuICogQG1vZHVsZSBET00gKGV4dHJhKVxuICovXG5cbnZhciBfZWFjaCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIF9hcHBlbmQkYmVmb3JlJGFmdGVyID0gcmVxdWlyZSgnLi9pbmRleCcpO1xuXG52YXIgXyQgPSByZXF1aXJlKCcuLi9zZWxlY3Rvci9pbmRleCcpO1xuXG4vKipcbiAqIEFwcGVuZCBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24gdG8gdGhlIHNwZWNpZmllZCBlbGVtZW50KHMpLlxuICpcbiAqIEBwYXJhbSB7Tm9kZXxOb2RlTGlzdHxPYmplY3R9IGVsZW1lbnQgV2hhdCB0byBhcHBlbmQgdGhlIGVsZW1lbnQocykgdG8uIENsb25lcyBlbGVtZW50cyBhcyBuZWNlc3NhcnkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5hcHBlbmRUbyhjb250YWluZXIpO1xuICovXG5cbmZ1bmN0aW9uIGFwcGVuZFRvKGVsZW1lbnQpIHtcbiAgICB2YXIgY29udGV4dCA9IHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJyA/IF8kLiQoZWxlbWVudCkgOiBlbGVtZW50O1xuICAgIF9hcHBlbmQkYmVmb3JlJGFmdGVyLmFwcGVuZC5jYWxsKGNvbnRleHQsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKlxuICogRW1wdHkgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLmVtcHR5KCk7XG4gKi9cblxuZnVuY3Rpb24gZW1wdHkoKSB7XG4gICAgcmV0dXJuIF9lYWNoLmVhY2godGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGNvbGxlY3Rpb24gZnJvbSB0aGUgRE9NLlxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBBcnJheSBjb250YWluaW5nIHRoZSByZW1vdmVkIGVsZW1lbnRzXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykucmVtb3ZlKCk7XG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgIHJldHVybiBfZWFjaC5lYWNoKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIFJlcGxhY2UgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHByb3ZpZGVkIG5ldyBjb250ZW50LCBhbmQgcmV0dXJuIHRoZSBhcnJheSBvZiBlbGVtZW50cyB0aGF0IHdlcmUgcmVwbGFjZWQuXG4gKlxuICogQHJldHVybiB7QXJyYXl9IEFycmF5IGNvbnRhaW5pbmcgdGhlIHJlcGxhY2VkIGVsZW1lbnRzXG4gKi9cblxuZnVuY3Rpb24gcmVwbGFjZVdpdGgoKSB7XG4gICAgcmV0dXJuIF9hcHBlbmQkYmVmb3JlJGFmdGVyLmJlZm9yZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLnJlbW92ZSgpO1xufVxuXG4vKipcbiAqIEdldCB0aGUgYHRleHRDb250ZW50YCBmcm9tIHRoZSBmaXJzdCwgb3Igc2V0IHRoZSBgdGV4dENvbnRlbnRgIG9mIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gW3ZhbHVlXVxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykudGV4dCgnTmV3IGNvbnRlbnQnKTtcbiAqL1xuXG5mdW5jdGlvbiB0ZXh0KHZhbHVlKSB7XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpc1swXS50ZXh0Q29udGVudDtcbiAgICB9XG5cbiAgICBfZWFjaC5lYWNoKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSAnJyArIHZhbHVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogR2V0IHRoZSBgdmFsdWVgIGZyb20gdGhlIGZpcnN0LCBvciBzZXQgdGhlIGB2YWx1ZWAgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbdmFsdWVdXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnaW5wdXQuZmlyc3ROYW1lJykudmFsdWUoJ05ldyB2YWx1ZScpO1xuICovXG5cbmZ1bmN0aW9uIHZhbCh2YWx1ZSkge1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0udmFsdWU7XG4gICAgfVxuXG4gICAgX2VhY2guZWFjaCh0aGlzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmFwcGVuZFRvID0gYXBwZW5kVG87XG5leHBvcnRzLmVtcHR5ID0gZW1wdHk7XG5leHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcbmV4cG9ydHMucmVwbGFjZVdpdGggPSByZXBsYWNlV2l0aDtcbmV4cG9ydHMudGV4dCA9IHRleHQ7XG5leHBvcnRzLnZhbCA9IHZhbDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9kb210YXN0aWMvY29tbW9uanMvZG9tL2V4dHJhLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuLyoqXG4gKiBAbW9kdWxlIENsYXNzXG4gKi9cblxudmFyIF9lYWNoMiA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxuLyoqXG4gKiBBZGQgYSBjbGFzcyB0byB0aGUgZWxlbWVudChzKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBTcGFjZS1zZXBhcmF0ZWQgY2xhc3MgbmFtZShzKSB0byBhZGQgdG8gdGhlIGVsZW1lbnQocykuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5hZGRDbGFzcygnYmFyJyk7XG4gKiAgICAgJCgnLml0ZW0nKS5hZGRDbGFzcygnYmFyIGZvbycpO1xuICovXG5cbmZ1bmN0aW9uIGFkZENsYXNzKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICBfZWFjaDIuZWFjaCh2YWx1ZS5zcGxpdCgnICcpLCBfZWFjaC5iaW5kKHRoaXMsICdhZGQnKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNsYXNzIGZyb20gdGhlIGVsZW1lbnQocylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgU3BhY2Utc2VwYXJhdGVkIGNsYXNzIG5hbWUocykgdG8gcmVtb3ZlIGZyb20gdGhlIGVsZW1lbnQocykuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW1zJykucmVtb3ZlQ2xhc3MoJ2JhcicpO1xuICogICAgICQoJy5pdGVtcycpLnJlbW92ZUNsYXNzKCdiYXIgZm9vJyk7XG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3ModmFsdWUpIHtcbiAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIF9lYWNoMi5lYWNoKHZhbHVlLnNwbGl0KCcgJyksIF9lYWNoLmJpbmQodGhpcywgJ3JlbW92ZScpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogVG9nZ2xlIGEgY2xhc3MgYXQgdGhlIGVsZW1lbnQocylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgU3BhY2Utc2VwYXJhdGVkIGNsYXNzIG5hbWUocykgdG8gdG9nZ2xlIGF0IHRoZSBlbGVtZW50KHMpLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykudG9nZ2xlQ2xhc3MoJ2JhcicpO1xuICogICAgICQoJy5pdGVtJykudG9nZ2xlQ2xhc3MoJ2JhciBmb28nKTtcbiAqL1xuXG5mdW5jdGlvbiB0b2dnbGVDbGFzcyh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgX2VhY2gyLmVhY2godmFsdWUuc3BsaXQoJyAnKSwgX2VhY2guYmluZCh0aGlzLCAndG9nZ2xlJykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZWxlbWVudChzKSBoYXZlIGEgY2xhc3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIENoZWNrIGlmIHRoZSBET00gZWxlbWVudCBjb250YWlucyB0aGUgY2xhc3MgbmFtZS4gV2hlbiBhcHBsaWVkIHRvIG11bHRpcGxlIGVsZW1lbnRzLFxuICogcmV0dXJucyBgdHJ1ZWAgaWYgX2FueV8gb2YgdGhlbSBjb250YWlucyB0aGUgY2xhc3MgbmFtZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGVsZW1lbnQncyBjbGFzcyBhdHRyaWJ1dGUgY29udGFpbnMgdGhlIGNsYXNzIG5hbWUuXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykuaGFzQ2xhc3MoJ2JhcicpO1xuICovXG5cbmZ1bmN0aW9uIGhhc0NsYXNzKHZhbHVlKSB7XG4gICAgcmV0dXJuICh0aGlzLm5vZGVUeXBlID8gW3RoaXNdIDogdGhpcykuc29tZShmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnModmFsdWUpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFNwZWNpYWxpemVkIGl0ZXJhdGlvbiwgYXBwbHlpbmcgYGZuYCBvZiB0aGUgY2xhc3NMaXN0IEFQSSB0byBlYWNoIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZuTmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBfZWFjaChmbk5hbWUsIGNsYXNzTmFtZSkge1xuICAgIF9lYWNoMi5lYWNoKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0W2ZuTmFtZV0oY2xhc3NOYW1lKTtcbiAgICB9KTtcbn1cblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmFkZENsYXNzID0gYWRkQ2xhc3M7XG5leHBvcnRzLnJlbW92ZUNsYXNzID0gcmVtb3ZlQ2xhc3M7XG5leHBvcnRzLnRvZ2dsZUNsYXNzID0gdG9nZ2xlQ2xhc3M7XG5leHBvcnRzLmhhc0NsYXNzID0gaGFzQ2xhc3M7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZG9tdGFzdGljL2NvbW1vbmpzL2RvbS9jbGFzcy5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbi8qKlxuICogQG1vZHVsZSBTZWxlY3RvclxuICovXG5cbnZhciBfZ2xvYmFsJGVhY2ggPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBpc1Byb3RvdHlwZVNldCA9IGZhbHNlLFxuICAgIHJlRnJhZ21lbnQgPSAvXlxccyo8KFxcdyt8ISlbXj5dKj4vLFxuICAgIHJlU2luZ2xlVGFnID0gL148KFxcdyspXFxzKlxcLz8+KD86PFxcL1xcMT58KSQvLFxuICAgIHJlU2ltcGxlU2VsZWN0b3IgPSAvXltcXC4jXT9bXFx3LV0qJC87XG5cbi8qXG4gKiBWZXJzYXRpbGUgd3JhcHBlciBmb3IgYHF1ZXJ5U2VsZWN0b3JBbGxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8QXJyYXl9IHNlbGVjdG9yIFF1ZXJ5IHNlbGVjdG9yLCBgTm9kZWAsIGBOb2RlTGlzdGAsIGFycmF5IG9mIGVsZW1lbnRzLCBvciBIVE1MIGZyYWdtZW50IHN0cmluZy5cbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R9IGNvbnRleHQ9ZG9jdW1lbnQgVGhlIGNvbnRleHQgZm9yIHRoZSBzZWxlY3RvciB0byBxdWVyeSBlbGVtZW50cy5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICB2YXIgJGl0ZW1zID0gJCguaXRlbXMnKTtcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyICRlbGVtZW50ID0gJChkb21FbGVtZW50KTtcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyICRsaXN0ID0gJChub2RlTGlzdCwgZG9jdW1lbnQuYm9keSk7XG4gKiBAZXhhbXBsZVxuICogICAgIHZhciAkZWxlbWVudCA9ICQoJzxwPmV2ZXJncmVlbjwvcD4nKTtcbiAqL1xuXG5mdW5jdGlvbiAkKHNlbGVjdG9yKSB7XG4gICAgdmFyIGNvbnRleHQgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGRvY3VtZW50IDogYXJndW1lbnRzWzFdO1xuXG4gICAgdmFyIGNvbGxlY3Rpb247XG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwobnVsbCk7XG4gICAgfSBlbHNlIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIFdyYXBwZXIpIHtcblxuICAgICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IHNlbGVjdG9yLm5vZGVUeXBlIHx8IHNlbGVjdG9yID09PSB3aW5kb3cgPyBbc2VsZWN0b3JdIDogc2VsZWN0b3I7XG4gICAgfSBlbHNlIGlmIChyZUZyYWdtZW50LnRlc3Qoc2VsZWN0b3IpKSB7XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IGNyZWF0ZUZyYWdtZW50KHNlbGVjdG9yKTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIGNvbnRleHQgPSB0eXBlb2YgY29udGV4dCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRleHQpIDogY29udGV4dC5sZW5ndGggPyBjb250ZXh0WzBdIDogY29udGV4dDtcblxuICAgICAgICBjb2xsZWN0aW9uID0gcXVlcnlTZWxlY3RvcihzZWxlY3RvciwgY29udGV4dCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXAoY29sbGVjdGlvbik7XG59XG5cbi8qXG4gKiBGaW5kIGRlc2NlbmRhbnRzIG1hdGNoaW5nIHRoZSBwcm92aWRlZCBgc2VsZWN0b3JgIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxBcnJheX0gc2VsZWN0b3IgUXVlcnkgc2VsZWN0b3IsIGBOb2RlYCwgYE5vZGVMaXN0YCwgYXJyYXkgb2YgZWxlbWVudHMsIG9yIEhUTUwgZnJhZ21lbnQgc3RyaW5nLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5zZWxlY3RvcicpLmZpbmQoJy5kZWVwJykuJCgnLmRlZXBlc3QnKTtcbiAqL1xuXG5mdW5jdGlvbiBmaW5kKHNlbGVjdG9yKSB7XG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgX2dsb2JhbCRlYWNoLmVhY2godGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgX2dsb2JhbCRlYWNoLmVhY2gocXVlcnlTZWxlY3RvcihzZWxlY3Rvciwgbm9kZSksIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgaWYgKG5vZGVzLmluZGV4T2YoY2hpbGQpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG5vZGVzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gJChub2Rlcyk7XG59XG5cbi8qXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZWxlbWVudCB3b3VsZCBiZSBzZWxlY3RlZCBieSB0aGUgc3BlY2lmaWVkIHNlbGVjdG9yIHN0cmluZzsgb3RoZXJ3aXNlLCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50IEVsZW1lbnQgdG8gdGVzdFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIFNlbGVjdG9yIHRvIG1hdGNoIGFnYWluc3QgZWxlbWVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICQubWF0Y2hlcyhlbGVtZW50LCAnLm1hdGNoJyk7XG4gKi9cblxudmFyIG1hdGNoZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZXh0ID0gdHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gRWxlbWVudC5wcm90b3R5cGUgOiBfZ2xvYmFsJGVhY2guZ2xvYmFsLFxuICAgICAgICBfbWF0Y2hlcyA9IGNvbnRleHQubWF0Y2hlcyB8fCBjb250ZXh0Lm1hdGNoZXNTZWxlY3RvciB8fCBjb250ZXh0Lm1vek1hdGNoZXNTZWxlY3RvciB8fCBjb250ZXh0Lm1zTWF0Y2hlc1NlbGVjdG9yIHx8IGNvbnRleHQub01hdGNoZXNTZWxlY3RvciB8fCBjb250ZXh0LndlYmtpdE1hdGNoZXNTZWxlY3RvcjtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBfbWF0Y2hlcy5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKTtcbiAgICB9O1xufSkoKTtcblxuLypcbiAqIFVzZSB0aGUgZmFzdGVyIGBnZXRFbGVtZW50QnlJZGAsIGBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lYCBvciBgZ2V0RWxlbWVudHNCeVRhZ05hbWVgIG92ZXIgYHF1ZXJ5U2VsZWN0b3JBbGxgIGlmIHBvc3NpYmxlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgUXVlcnkgc2VsZWN0b3IuXG4gKiBAcGFyYW0ge05vZGV9IGNvbnRleHQgVGhlIGNvbnRleHQgZm9yIHRoZSBzZWxlY3RvciB0byBxdWVyeSBlbGVtZW50cy5cbiAqIEByZXR1cm4ge09iamVjdH0gTm9kZUxpc3QsIEhUTUxDb2xsZWN0aW9uLCBvciBBcnJheSBvZiBtYXRjaGluZyBlbGVtZW50cyAoZGVwZW5kaW5nIG9uIG1ldGhvZCB1c2VkKS5cbiAqL1xuXG5mdW5jdGlvbiBxdWVyeVNlbGVjdG9yKHNlbGVjdG9yLCBjb250ZXh0KSB7XG5cbiAgICB2YXIgaXNTaW1wbGVTZWxlY3RvciA9IHJlU2ltcGxlU2VsZWN0b3IudGVzdChzZWxlY3Rvcik7XG5cbiAgICBpZiAoaXNTaW1wbGVTZWxlY3Rvcikge1xuICAgICAgICBpZiAoc2VsZWN0b3JbMF0gPT09ICcjJykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAoY29udGV4dC5nZXRFbGVtZW50QnlJZCA/IGNvbnRleHQgOiBkb2N1bWVudCkuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3Iuc2xpY2UoMSkpO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQgPyBbZWxlbWVudF0gOiBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0b3JbMF0gPT09ICcuJykge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShzZWxlY3Rvci5zbGljZSgxKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xufVxuXG4vKlxuICogQ3JlYXRlIERPTSBmcmFnbWVudCBmcm9tIGFuIEhUTUwgc3RyaW5nXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sIFN0cmluZyByZXByZXNlbnRpbmcgSFRNTC5cbiAqIEByZXR1cm4ge05vZGVMaXN0fVxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50KGh0bWwpIHtcblxuICAgIGlmIChyZVNpbmdsZVRhZy50ZXN0KGh0bWwpKSB7XG4gICAgICAgIHJldHVybiBbZG9jdW1lbnQuY3JlYXRlRWxlbWVudChSZWdFeHAuJDEpXTtcbiAgICB9XG5cbiAgICB2YXIgZWxlbWVudHMgPSBbXSxcbiAgICAgICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgIGNoaWxkcmVuID0gY29udGFpbmVyLmNoaWxkTm9kZXM7XG5cbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGVsZW1lbnRzLnB1c2goY2hpbGRyZW5baV0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50cztcbn1cblxuLypcbiAqIENhbGxpbmcgYCQoc2VsZWN0b3IpYCByZXR1cm5zIGEgd3JhcHBlZCBjb2xsZWN0aW9uIG9mIGVsZW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGVMaXN0fEFycmF5fSBjb2xsZWN0aW9uIEVsZW1lbnQocykgdG8gd3JhcC5cbiAqIEByZXR1cm4gKE9iamVjdCkgVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICovXG5cbmZ1bmN0aW9uIHdyYXAoY29sbGVjdGlvbikge1xuXG4gICAgaWYgKCFpc1Byb3RvdHlwZVNldCkge1xuICAgICAgICBXcmFwcGVyLnByb3RvdHlwZSA9ICQuZm47XG4gICAgICAgIFdyYXBwZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gV3JhcHBlcjtcbiAgICAgICAgaXNQcm90b3R5cGVTZXQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgV3JhcHBlcihjb2xsZWN0aW9uKTtcbn1cblxuLypcbiAqIENvbnN0cnVjdG9yIGZvciB0aGUgT2JqZWN0LnByb3RvdHlwZSBzdHJhdGVneVxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZUxpc3R8QXJyYXl9IGNvbGxlY3Rpb24gRWxlbWVudChzKSB0byB3cmFwLlxuICovXG5cbmZ1bmN0aW9uIFdyYXBwZXIoY29sbGVjdGlvbikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsZW5ndGg7KSB7XG4gICAgICAgIHRoaXNbaV0gPSBjb2xsZWN0aW9uW2krK107XG4gICAgfVxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xufVxuXG4vKlxuICogRXhwb3J0IGludGVyZmFjZVxuICovXG5cbmV4cG9ydHMuJCA9ICQ7XG5leHBvcnRzLmZpbmQgPSBmaW5kO1xuZXhwb3J0cy5tYXRjaGVzID0gbWF0Y2hlcztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9kb210YXN0aWMvY29tbW9uanMvc2VsZWN0b3IvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG4vKipcbiAqIEBtb2R1bGUgRE9NXG4gKi9cblxudmFyIF90b0FycmF5ID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgXyQgPSByZXF1aXJlKCcuLi9zZWxlY3Rvci9pbmRleCcpO1xuXG52YXIgZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xuXG4vKipcbiAqIEFwcGVuZCBlbGVtZW50KHMpIHRvIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fE9iamVjdH0gZWxlbWVudCBXaGF0IHRvIGFwcGVuZCB0byB0aGUgZWxlbWVudChzKS5cbiAqIENsb25lcyBlbGVtZW50cyBhcyBuZWNlc3NhcnkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5hcHBlbmQoJzxwPm1vcmU8L3A+Jyk7XG4gKi9cblxuZnVuY3Rpb24gYXBwZW5kKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0ID8gX3RvQXJyYXkudG9BcnJheShlbGVtZW50KSA6IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgZm9yRWFjaC5jYWxsKGVsZW1lbnRzLCB0aGlzLmFwcGVuZENoaWxkLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX2VhY2godGhpcywgYXBwZW5kLCBlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogUGxhY2UgZWxlbWVudChzKSBhdCB0aGUgYmVnaW5uaW5nIG9mIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fE9iamVjdH0gZWxlbWVudCBXaGF0IHRvIHBsYWNlIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGVsZW1lbnQocykuXG4gKiBDbG9uZXMgZWxlbWVudHMgYXMgbmVjZXNzYXJ5LlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykucHJlcGVuZCgnPHNwYW4+c3RhcnQ8L3NwYW4+Jyk7XG4gKi9cblxuZnVuY3Rpb24gcHJlcGVuZChlbGVtZW50KSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydEJlZm9yZShlbGVtZW50LCB0aGlzLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBlbGVtZW50IGluc3RhbmNlb2YgTm9kZUxpc3QgPyBfdG9BcnJheS50b0FycmF5KGVsZW1lbnQpIDogZWxlbWVudDtcbiAgICAgICAgICAgICAgICBmb3JFYWNoLmNhbGwoZWxlbWVudHMucmV2ZXJzZSgpLCBwcmVwZW5kLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX2VhY2godGhpcywgcHJlcGVuZCwgZWxlbWVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFBsYWNlIGVsZW1lbnQocykgYmVmb3JlIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fE9iamVjdH0gZWxlbWVudCBXaGF0IHRvIHBsYWNlIGFzIHNpYmxpbmcocykgYmVmb3JlIHRvIHRoZSBlbGVtZW50KHMpLlxuICogQ2xvbmVzIGVsZW1lbnRzIGFzIG5lY2Vzc2FyeS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbXMnKS5iZWZvcmUoJzxwPnByZWZpeDwvcD4nKTtcbiAqL1xuXG5mdW5jdGlvbiBiZWZvcmUoZWxlbWVudCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlYmVnaW4nLCBlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWxlbWVudCwgdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlTGlzdCA/IF90b0FycmF5LnRvQXJyYXkoZWxlbWVudCkgOiBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGZvckVhY2guY2FsbChlbGVtZW50cywgYmVmb3JlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX2VhY2godGhpcywgYmVmb3JlLCBlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogUGxhY2UgZWxlbWVudChzKSBhZnRlciBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxPYmplY3R9IGVsZW1lbnQgV2hhdCB0byBwbGFjZSBhcyBzaWJsaW5nKHMpIGFmdGVyIHRvIHRoZSBlbGVtZW50KHMpLiBDbG9uZXMgZWxlbWVudHMgYXMgbmVjZXNzYXJ5LlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtcycpLmFmdGVyKCc8c3Bhbj5zdWY8L3NwYW4+PHNwYW4+Zml4PC9zcGFuPicpO1xuICovXG5cbmZ1bmN0aW9uIGFmdGVyKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyZW5kJywgZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHRoaXMubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBlbGVtZW50IGluc3RhbmNlb2YgTm9kZUxpc3QgPyBfdG9BcnJheS50b0FycmF5KGVsZW1lbnQpIDogZWxlbWVudDtcbiAgICAgICAgICAgICAgICBmb3JFYWNoLmNhbGwoZWxlbWVudHMucmV2ZXJzZSgpLCBhZnRlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIF9lYWNoKHRoaXMsIGFmdGVyLCBlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ2xvbmUgYSB3cmFwcGVkIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IFdyYXBwZWQgY29sbGVjdGlvbiBvZiBjbG9uZWQgbm9kZXMuXG4gKiBAZXhhbXBsZVxuICogICAgICQoZWxlbWVudCkuY2xvbmUoKTtcbiAqL1xuXG5mdW5jdGlvbiBjbG9uZSgpIHtcbiAgICByZXR1cm4gXyQuJChfY2xvbmUodGhpcykpO1xufVxuXG4vKipcbiAqIENsb25lIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8QXJyYXl9IGVsZW1lbnQgVGhlIGVsZW1lbnQocykgdG8gY2xvbmUuXG4gKiBAcmV0dXJuIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxBcnJheX0gVGhlIGNsb25lZCBlbGVtZW50KHMpXG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIF9jbG9uZShlbGVtZW50KSB7XG4gICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICB9IGVsc2UgaWYgKCdsZW5ndGgnIGluIGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIFtdLm1hcC5jYWxsKGVsZW1lbnQsIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50O1xufVxuXG4vKipcbiAqIFNwZWNpYWxpemVkIGl0ZXJhdGlvbiwgYXBwbHlpbmcgYGZuYCBpbiByZXZlcnNlZCBtYW5uZXIgdG8gYSBjbG9uZSBvZiBlYWNoIGVsZW1lbnQsIGJ1dCB0aGUgcHJvdmlkZWQgb25lLlxuICpcbiAqIEBwYXJhbSB7Tm9kZUxpc3R8QXJyYXl9IGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gX2VhY2goY29sbGVjdGlvbiwgZm4sIGVsZW1lbnQpIHtcbiAgICB2YXIgbCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuICAgIHdoaWxlIChsLS0pIHtcbiAgICAgICAgdmFyIGVsbSA9IGwgPT09IDAgPyBlbGVtZW50IDogX2Nsb25lKGVsZW1lbnQpO1xuICAgICAgICBmbi5jYWxsKGNvbGxlY3Rpb25bbF0sIGVsbSk7XG4gICAgfVxufVxuXG4vKlxuICogRXhwb3J0IGludGVyZmFjZVxuICovXG5cbmV4cG9ydHMuYXBwZW5kID0gYXBwZW5kO1xuZXhwb3J0cy5wcmVwZW5kID0gcHJlcGVuZDtcbmV4cG9ydHMuYmVmb3JlID0gYmVmb3JlO1xuZXhwb3J0cy5hZnRlciA9IGFmdGVyO1xuZXhwb3J0cy5jbG9uZSA9IGNsb25lO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy9kb20vaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG4vKipcbiAqIEBtb2R1bGUgRXZlbnRzXG4gKi9cblxudmFyIF9lYWNoID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgX2Nsb3Nlc3QgPSByZXF1aXJlKCcuLi9zZWxlY3Rvci9jbG9zZXN0Jyk7XG5cbi8qKlxuICogU2hvcnRoYW5kIGZvciBgYWRkRXZlbnRMaXN0ZW5lcmAuIFN1cHBvcnRzIGV2ZW50IGRlbGVnYXRpb24gaWYgYSBmaWx0ZXIgKGBzZWxlY3RvcmApIGlzIHByb3ZpZGVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVzIExpc3Qgb2Ygc3BhY2Utc2VwYXJhdGVkIGV2ZW50IHR5cGVzIHRvIGJlIGFkZGVkIHRvIHRoZSBlbGVtZW50KHMpXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NlbGVjdG9yXSBTZWxlY3RvciB0byBmaWx0ZXIgZGVzY2VuZGFudHMgdGhhdCBkZWxlZ2F0ZSB0aGUgZXZlbnQgdG8gdGhpcyBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBFdmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUNhcHR1cmU9ZmFsc2VcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLm9uKCdjbGljaycsIGNhbGxiYWNrKTtcbiAqICAgICAkKCcuY29udGFpbmVyJykub24oJ2NsaWNrIGZvY3VzJywgJy5pdGVtJywgaGFuZGxlcik7XG4gKi9cblxuZnVuY3Rpb24gb24oZXZlbnROYW1lcywgc2VsZWN0b3IsIGhhbmRsZXIsIHVzZUNhcHR1cmUpIHtcblxuICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaGFuZGxlciA9IHNlbGVjdG9yO1xuICAgICAgICBzZWxlY3RvciA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHBhcnRzLCBuYW1lc3BhY2UsIGV2ZW50TGlzdGVuZXI7XG5cbiAgICBldmVudE5hbWVzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG5cbiAgICAgICAgcGFydHMgPSBldmVudE5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgZXZlbnROYW1lID0gcGFydHNbMF0gfHwgbnVsbDtcbiAgICAgICAgbmFtZXNwYWNlID0gcGFydHNbMV0gfHwgbnVsbDtcblxuICAgICAgICBldmVudExpc3RlbmVyID0gcHJveHlIYW5kbGVyKGhhbmRsZXIpO1xuXG4gICAgICAgIF9lYWNoLmVhY2godGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lciA9IGRlbGVnYXRlSGFuZGxlci5iaW5kKGVsZW1lbnQsIHNlbGVjdG9yLCBldmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRMaXN0ZW5lciwgdXNlQ2FwdHVyZSB8fCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGdldEhhbmRsZXJzKGVsZW1lbnQpLnB1c2goe1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lcjogZXZlbnRMaXN0ZW5lcixcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBuYW1lc3BhY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFNob3J0aGFuZCBmb3IgYHJlbW92ZUV2ZW50TGlzdGVuZXJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVzIExpc3Qgb2Ygc3BhY2Utc2VwYXJhdGVkIGV2ZW50IHR5cGVzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgZWxlbWVudChzKVxuICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcl0gU2VsZWN0b3IgdG8gZmlsdGVyIGRlc2NlbmRhbnRzIHRoYXQgdW5kZWxlZ2F0ZSB0aGUgZXZlbnQgdG8gdGhpcyBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBFdmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUNhcHR1cmU9ZmFsc2VcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLm9mZignY2xpY2snLCBjYWxsYmFjayk7XG4gKiAgICAgJCgnI215LWVsZW1lbnQnKS5vZmYoJ215RXZlbnQgbXlPdGhlckV2ZW50Jyk7XG4gKiAgICAgJCgnLml0ZW0nKS5vZmYoKTtcbiAqL1xuXG5mdW5jdGlvbiBvZmYoX3gsIHNlbGVjdG9yLCBoYW5kbGVyLCB1c2VDYXB0dXJlKSB7XG4gICAgdmFyIGV2ZW50TmFtZXMgPSBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/ICcnIDogYXJndW1lbnRzWzBdO1xuXG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBoYW5kbGVyID0gc2VsZWN0b3I7XG4gICAgICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcGFydHMsIG5hbWVzcGFjZSwgaGFuZGxlcnM7XG5cbiAgICBldmVudE5hbWVzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG5cbiAgICAgICAgcGFydHMgPSBldmVudE5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgZXZlbnROYW1lID0gcGFydHNbMF0gfHwgbnVsbDtcbiAgICAgICAgbmFtZXNwYWNlID0gcGFydHNbMV0gfHwgbnVsbDtcblxuICAgICAgICBfZWFjaC5lYWNoKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cbiAgICAgICAgICAgIGhhbmRsZXJzID0gZ2V0SGFuZGxlcnMoZWxlbWVudCk7XG5cbiAgICAgICAgICAgIF9lYWNoLmVhY2goaGFuZGxlcnMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICghZXZlbnROYW1lIHx8IGl0ZW0uZXZlbnROYW1lID09PSBldmVudE5hbWUpICYmICghbmFtZXNwYWNlIHx8IGl0ZW0ubmFtZXNwYWNlID09PSBuYW1lc3BhY2UpICYmICghaGFuZGxlciB8fCBpdGVtLmhhbmRsZXIgPT09IGhhbmRsZXIpICYmICghc2VsZWN0b3IgfHwgaXRlbS5zZWxlY3RvciA9PT0gc2VsZWN0b3IpO1xuICAgICAgICAgICAgfSksIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGl0ZW0uZXZlbnROYW1lLCBpdGVtLmV2ZW50TGlzdGVuZXIsIHVzZUNhcHR1cmUgfHwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShoYW5kbGVycy5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIWV2ZW50TmFtZSAmJiAhbmFtZXNwYWNlICYmICFzZWxlY3RvciAmJiAhaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGNsZWFySGFuZGxlcnMoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNsZWFySGFuZGxlcnMoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogR2V0IGV2ZW50IGhhbmRsZXJzIGZyb20gYW4gZWxlbWVudFxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbnZhciBldmVudEtleVByb3AgPSAnX19kb210YXN0aWNfZXZlbnRfXyc7XG52YXIgaWQgPSAxO1xudmFyIGhhbmRsZXJzID0ge307XG52YXIgdW51c2VkS2V5cyA9IFtdO1xuXG5mdW5jdGlvbiBnZXRIYW5kbGVycyhlbGVtZW50KSB7XG4gICAgaWYgKCFlbGVtZW50W2V2ZW50S2V5UHJvcF0pIHtcbiAgICAgICAgZWxlbWVudFtldmVudEtleVByb3BdID0gdW51c2VkS2V5cy5sZW5ndGggPT09IDAgPyArK2lkIDogdW51c2VkS2V5cy5wb3AoKTtcbiAgICB9XG4gICAgdmFyIGtleSA9IGVsZW1lbnRbZXZlbnRLZXlQcm9wXTtcbiAgICByZXR1cm4gaGFuZGxlcnNba2V5XSB8fCAoaGFuZGxlcnNba2V5XSA9IFtdKTtcbn1cblxuLyoqXG4gKiBDbGVhciBldmVudCBoYW5kbGVycyBmb3IgYW4gZWxlbWVudFxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBjbGVhckhhbmRsZXJzKGVsZW1lbnQpIHtcbiAgICB2YXIga2V5ID0gZWxlbWVudFtldmVudEtleVByb3BdO1xuICAgIGlmIChoYW5kbGVyc1trZXldKSB7XG4gICAgICAgIGhhbmRsZXJzW2tleV0gPSBudWxsO1xuICAgICAgICBlbGVtZW50W2tleV0gPSBudWxsO1xuICAgICAgICB1bnVzZWRLZXlzLnB1c2goa2V5KTtcbiAgICB9XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gY3JlYXRlIGEgaGFuZGxlciB0aGF0IGF1Z21lbnRzIHRoZSBldmVudCBvYmplY3Qgd2l0aCBzb21lIGV4dHJhIG1ldGhvZHMsXG4gKiBhbmQgZXhlY3V0ZXMgdGhlIGNhbGxiYWNrIHdpdGggdGhlIGV2ZW50IGFuZCB0aGUgZXZlbnQgZGF0YSAoaS5lLiBgZXZlbnQuZGV0YWlsYCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSBoYW5kbGVyIENhbGxiYWNrIHRvIGV4ZWN1dGUgYXMgYGhhbmRsZXIoZXZlbnQsIGRhdGEpYFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gcHJveHlIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhdWdtZW50RXZlbnQoZXZlbnQpLCBldmVudC5kZXRhaWwpO1xuICAgIH07XG59XG5cbi8qKlxuICogQXR0ZW1wdCB0byBhdWdtZW50IGV2ZW50cyBhbmQgaW1wbGVtZW50IHNvbWV0aGluZyBjbG9zZXIgdG8gRE9NIExldmVsIDMgRXZlbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbnZhciBhdWdtZW50RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIG1ldGhvZE5hbWUsXG4gICAgICAgIGV2ZW50TWV0aG9kcyA9IHtcbiAgICAgICAgcHJldmVudERlZmF1bHQ6ICdpc0RlZmF1bHRQcmV2ZW50ZWQnLFxuICAgICAgICBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb246ICdpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCcsXG4gICAgICAgIHN0b3BQcm9wYWdhdGlvbjogJ2lzUHJvcGFnYXRpb25TdG9wcGVkJ1xuICAgIH0sXG4gICAgICAgIHJldHVyblRydWUgPSBmdW5jdGlvbiByZXR1cm5UcnVlKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgICAgICByZXR1cm5GYWxzZSA9IGZ1bmN0aW9uIHJldHVybkZhbHNlKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQgfHwgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIHx8IGV2ZW50LnN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgZm9yIChtZXRob2ROYW1lIGluIGV2ZW50TWV0aG9kcykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAobWV0aG9kTmFtZSwgdGVzdE1ldGhvZE5hbWUsIG9yaWdpbmFsTWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50W21ldGhvZE5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1t0ZXN0TWV0aG9kTmFtZV0gPSByZXR1cm5UcnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsTWV0aG9kICYmIG9yaWdpbmFsTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50W3Rlc3RNZXRob2ROYW1lXSA9IHJldHVybkZhbHNlO1xuICAgICAgICAgICAgICAgIH0pKG1ldGhvZE5hbWUsIGV2ZW50TWV0aG9kc1ttZXRob2ROYW1lXSwgZXZlbnRbbWV0aG9kTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV2ZW50Ll9wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHRlc3Qgd2hldGhlciBkZWxlZ2F0ZWQgZXZlbnRzIG1hdGNoIHRoZSBwcm92aWRlZCBgc2VsZWN0b3JgIChmaWx0ZXIpLFxuICogaWYgdGhlIGV2ZW50IHByb3BhZ2F0aW9uIHdhcyBzdG9wcGVkLCBhbmQgdGhlbiBhY3R1YWxseSBjYWxsIHRoZSBwcm92aWRlZCBldmVudCBoYW5kbGVyLlxuICogVXNlIGB0aGlzYCBpbnN0ZWFkIG9mIGBldmVudC5jdXJyZW50VGFyZ2V0YCBvbiB0aGUgZXZlbnQgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgU2VsZWN0b3IgdG8gZmlsdGVyIGRlc2NlbmRhbnRzIHRoYXQgdW5kZWxlZ2F0ZSB0aGUgZXZlbnQgdG8gdGhpcyBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBFdmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICovXG5cbmZ1bmN0aW9uIGRlbGVnYXRlSGFuZGxlcihzZWxlY3RvciwgaGFuZGxlciwgZXZlbnQpIHtcbiAgICB2YXIgZXZlbnRUYXJnZXQgPSBldmVudC5fdGFyZ2V0IHx8IGV2ZW50LnRhcmdldCxcbiAgICAgICAgY3VycmVudFRhcmdldCA9IF9jbG9zZXN0LmNsb3Nlc3QuY2FsbChbZXZlbnRUYXJnZXRdLCBzZWxlY3RvciwgdGhpcylbMF07XG4gICAgaWYgKGN1cnJlbnRUYXJnZXQgJiYgY3VycmVudFRhcmdldCAhPT0gdGhpcykge1xuICAgICAgICBpZiAoY3VycmVudFRhcmdldCA9PT0gZXZlbnRUYXJnZXQgfHwgIShldmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCAmJiBldmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpKSkge1xuICAgICAgICAgICAgaGFuZGxlci5jYWxsKGN1cnJlbnRUYXJnZXQsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIGJpbmQgPSBvbixcbiAgICB1bmJpbmQgPSBvZmY7XG5cbi8qXG4gKiBFeHBvcnQgaW50ZXJmYWNlXG4gKi9cblxuZXhwb3J0cy5vbiA9IG9uO1xuZXhwb3J0cy5vZmYgPSBvZmY7XG5leHBvcnRzLmJpbmQgPSBiaW5kO1xuZXhwb3J0cy51bmJpbmQgPSB1bmJpbmQ7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZG9tdGFzdGljL2NvbW1vbmpzL2V2ZW50L2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgc2hpbUtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9zaGltS2V5cycpO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBnZXROYXRpdmUoT2JqZWN0LCAna2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xudmFyIGtleXMgPSAhbmF0aXZlS2V5cyA/IHNoaW1LZXlzIDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBDdG9yID0gb2JqZWN0ID09IG51bGwgPyBudWxsIDogb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBpZiAoKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUgPT09IG9iamVjdCkgfHxcbiAgICAgICh0eXBlb2Ygb2JqZWN0ICE9ICdmdW5jdGlvbicgJiYgaXNBcnJheUxpa2Uob2JqZWN0KSkpIHtcbiAgICByZXR1cm4gc2hpbUtleXMob2JqZWN0KTtcbiAgfVxuICByZXR1cm4gaXNPYmplY3Qob2JqZWN0KSA/IG5hdGl2ZUtleXMob2JqZWN0KSA6IFtdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL29iamVjdC9rZXlzLmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUNvcHkoc291cmNlLCBwcm9wcywgb2JqZWN0KSB7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICBvYmplY3Rba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNvcHk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvYmFzZUNvcHkuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9pZGVudGl0eScpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUNhbGxiYWNrYCB3aGljaCBvbmx5IHN1cHBvcnRzIGB0aGlzYCBiaW5kaW5nXG4gKiBhbmQgc3BlY2lmeWluZyB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYmluZC5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcmdDb3VudF0gVGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBiaW5kQ2FsbGJhY2soZnVuYywgdGhpc0FyZywgYXJnQ291bnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHRoaXNBcmcgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmdW5jO1xuICB9XG4gIHN3aXRjaCAoYXJnQ291bnQpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSk7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfTtcbiAgICBjYXNlIDU6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIG90aGVyLCBrZXksIG9iamVjdCwgc291cmNlKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbmRDYWxsYmFjaztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9iaW5kQ2FsbGJhY2suanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdCkpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9pc0l0ZXJhdGVlQ2FsbC5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGVcbiAqIGNyZWF0ZWQgZnVuY3Rpb24gYW5kIGFyZ3VtZW50cyBmcm9tIGBzdGFydGAgYW5kIGJleW9uZCBwcm92aWRlZCBhcyBhbiBhcnJheS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24gdGhlIFtyZXN0IHBhcmFtZXRlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvRnVuY3Rpb25zL3Jlc3RfcGFyYW1ldGVycykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2F5ID0gXy5yZXN0UGFyYW0oZnVuY3Rpb24od2hhdCwgbmFtZXMpIHtcbiAqICAgcmV0dXJuIHdoYXQgKyAnICcgKyBfLmluaXRpYWwobmFtZXMpLmpvaW4oJywgJykgK1xuICogICAgIChfLnNpemUobmFtZXMpID4gMSA/ICcsICYgJyA6ICcnKSArIF8ubGFzdChuYW1lcyk7XG4gKiB9KTtcbiAqXG4gKiBzYXkoJ2hlbGxvJywgJ2ZyZWQnLCAnYmFybmV5JywgJ3BlYmJsZXMnKTtcbiAqIC8vID0+ICdoZWxsbyBmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gcmVzdFBhcmFtKGZ1bmMsIHN0YXJ0KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6ICgrc3RhcnQgfHwgMCksIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgcmVzdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdFtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHN0YXJ0KSB7XG4gICAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpcywgcmVzdCk7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgcmVzdCk7XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSwgcmVzdCk7XG4gICAgfVxuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIGluZGV4ID0gLTE7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gcmVzdDtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc3RQYXJhbTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9mdW5jdGlvbi9yZXN0UGFyYW0uanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbi8qXG4gKiBAbW9kdWxlIFV0aWxcbiAqL1xuXG4vKlxuICogUmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgc2NvcGVcbiAqIEBwcml2YXRlXG4gKi9cblxudmFyIGdsb2JhbCA9IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG5cbi8qKlxuICogQ29udmVydCBgTm9kZUxpc3RgIHRvIGBBcnJheWAuXG4gKlxuICogQHBhcmFtIHtOb2RlTGlzdHxBcnJheX0gY29sbGVjdGlvblxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHRvQXJyYXkoY29sbGVjdGlvbikge1xuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0ID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHRbaV0gPSBjb2xsZWN0aW9uW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZhc3RlciBhbHRlcm5hdGl2ZSB0byBbXS5mb3JFYWNoIG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7Tm9kZXxOb2RlTGlzdHxBcnJheX0gY29sbGVjdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge05vZGV8Tm9kZUxpc3R8QXJyYXl9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIGNvbGxlY3Rpb24ubm9kZVR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNvbGxlY3Rpb25baV0sIGksIGNvbGxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb2xsZWN0aW9uLCAwLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG59XG5cbi8qKlxuICogQXNzaWduIGVudW1lcmFibGUgcHJvcGVydGllcyBmcm9tIHNvdXJjZSBvYmplY3QocykgdG8gdGFyZ2V0IG9iamVjdFxuICpcbiAqIEBtZXRob2QgZXh0ZW5kXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IE9iamVjdCB0byBleHRlbmRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbc291cmNlXSBPYmplY3QgdG8gZXh0ZW5kIGZyb21cbiAqIEByZXR1cm4ge09iamVjdH0gRXh0ZW5kZWQgb2JqZWN0XG4gKiBAZXhhbXBsZVxuICogICAgICQuZXh0ZW5kKHthOiAxfSwge2I6IDJ9KTtcbiAqICAgICAvLyB7YTogMSwgYjogMn1cbiAqIEBleGFtcGxlXG4gKiAgICAgJC5leHRlbmQoe2E6IDF9LCB7YjogMn0sIHthOiAzfSk7XG4gKiAgICAgLy8ge2E6IDMsIGI6IDJ9XG4gKi9cblxuZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBzb3VyY2VzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBzb3VyY2VzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBzb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHNyYykge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNyYykge1xuICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gc3JjW3Byb3BdO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGNvbGxlY3Rpb24gd2l0aG91dCBkdXBsaWNhdGVzXG4gKlxuICogQHBhcmFtIGNvbGxlY3Rpb24gQ29sbGVjdGlvbiB0byByZW1vdmUgZHVwbGljYXRlcyBmcm9tXG4gKiBAcmV0dXJuIHtOb2RlfE5vZGVMaXN0fEFycmF5fVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB1bmlxKGNvbGxlY3Rpb24pIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmluZGV4T2YoaXRlbSkgPT09IGluZGV4O1xuICAgIH0pO1xufVxuXG4vKlxuICogRXhwb3J0IGludGVyZmFjZVxuICovXG5cbmV4cG9ydHMuZ2xvYmFsID0gZ2xvYmFsO1xuZXhwb3J0cy50b0FycmF5ID0gdG9BcnJheTtcbmV4cG9ydHMuZWFjaCA9IGVhY2g7XG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcbmV4cG9ydHMudW5pcSA9IHVuaXE7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZG9tdGFzdGljL2NvbW1vbmpzL3V0aWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuLyoqXG4gKiBAbW9kdWxlIGNsb3Nlc3RcbiAqL1xuXG52YXIgXyQkbWF0Y2hlcyA9IHJlcXVpcmUoJy4vaW5kZXgnKTtcblxudmFyIF9lYWNoJHVuaXEgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbi8qKlxuICogUmV0dXJuIHRoZSBjbG9zZXN0IGVsZW1lbnQgbWF0Y2hpbmcgdGhlIHNlbGVjdG9yIChzdGFydGluZyBieSBpdHNlbGYpIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIEZpbHRlclxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBJZiBwcm92aWRlZCwgbWF0Y2hpbmcgZWxlbWVudHMgbXVzdCBiZSBhIGRlc2NlbmRhbnQgb2YgdGhpcyBlbGVtZW50XG4gKiBAcmV0dXJuIHtPYmplY3R9IE5ldyB3cmFwcGVkIGNvbGxlY3Rpb24gKGNvbnRhaW5pbmcgemVybyBvciBvbmUgZWxlbWVudClcbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLnNlbGVjdG9yJykuY2xvc2VzdCgnLmNvbnRhaW5lcicpO1xuICovXG5cbnZhciBjbG9zZXN0ID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIGZ1bmN0aW9uIGNsb3Nlc3Qoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgIF9lYWNoJHVuaXEuZWFjaCh0aGlzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmIChfJCRtYXRjaGVzLm1hdGNoZXMobm9kZSwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF8kJG1hdGNoZXMuJChfZWFjaCR1bmlxLnVuaXEobm9kZXMpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIUVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgPyBjbG9zZXN0IDogZnVuY3Rpb24gKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgICBfZWFjaCR1bmlxLmVhY2godGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IG5vZGUuY2xvc2VzdChzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMucHVzaChuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBfJCRtYXRjaGVzLiQoX2VhY2gkdW5pcS51bmlxKG5vZGVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY2xvc2VzdC5jYWxsKHRoaXMsIHNlbGVjdG9yLCBjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG4vKlxuICogRXhwb3J0IGludGVyZmFjZVxuICovXG5cbmV4cG9ydHMuY2xvc2VzdCA9IGNsb3Nlc3Q7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZG9tdGFzdGljL2NvbW1vbmpzL3NlbGVjdG9yL2Nsb3Nlc3QuanNcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGlzTmF0aXZlID0gcmVxdWlyZSgnLi4vbGFuZy9pc05hdGl2ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgcmV0dXJuIGlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9nZXROYXRpdmUuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vZ2V0TGVuZ3RoJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2lzQXJyYXlMaWtlLmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvbGFuZy9pc09iamVjdC5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5c0luJyk7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5rZXlzYCB3aGljaCBjcmVhdGVzIGFuIGFycmF5IG9mIHRoZVxuICogb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIHNoaW1LZXlzKG9iamVjdCkge1xuICB2YXIgcHJvcHMgPSBrZXlzSW4ob2JqZWN0KSxcbiAgICAgIHByb3BzTGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gcHJvcHNMZW5ndGggJiYgb2JqZWN0Lmxlbmd0aDtcblxuICB2YXIgYWxsb3dJbmRleGVzID0gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IHByb3BzTGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICBpZiAoKGFsbG93SW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgfHwgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hpbUtleXM7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvc2hpbUtleXMuanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBwcm92aWRlZCB0byBpdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiBfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL3V0aWxpdHkvaWRlbnRpdHkuanNcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhbHVlID0gKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgPyArdmFsdWUgOiAtMTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2lzSW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGVzY2FwZVJlZ0V4cCA9IHJlcXVpcmUoJy4uL3N0cmluZy9lc2NhcGVSZWdFeHAnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSA+IDUpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZm5Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBlc2NhcGVSZWdFeHAoZm5Ub1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KSlcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmF0aXZlKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmF0aXZlKF8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGZ1bmNUYWcpIHtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KGZuVG9TdHJpbmcuY2FsbCh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHJlSXNIb3N0Q3Rvci50ZXN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05hdGl2ZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9sYW5nL2lzTmF0aXZlLmpzXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL2Jhc2VQcm9wZXJ0eScpO1xuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldExlbmd0aDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanNcbiAqKiBtb2R1bGUgaWQgPSAyNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2lzTGVuZ3RoLmpzXG4gKiogbW9kdWxlIGlkID0gMjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9sYW5nL2lzQXJndW1lbnRzLmpzXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0FycmF5ID0gZ2V0TmF0aXZlKEFycmF5LCAnaXNBcnJheScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFycmF5VGFnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2xhbmcvaXNBcnJheS5qc1xuICoqIG1vZHVsZSBpZCA9IDI4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDtcbiAgbGVuZ3RoID0gKGxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKSAmJiBsZW5ndGgpIHx8IDA7XG5cbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgaXNQcm90byA9IHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUgPT09IG9iamVjdCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCksXG4gICAgICBza2lwSW5kZXhlcyA9IGxlbmd0aCA+IDA7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gKGluZGV4ICsgJycpO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShza2lwSW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgJiZcbiAgICAgICAgIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvb2JqZWN0L2tleXNJbi5qc1xuICoqIG1vZHVsZSBpZCA9IDI5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZVRvU3RyaW5nJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBbc3BlY2lhbCBjaGFyYWN0ZXJzXShodHRwOi8vd3d3LnJlZ3VsYXItZXhwcmVzc2lvbnMuaW5mby9jaGFyYWN0ZXJzLmh0bWwjc3BlY2lhbCkuXG4gKiBJbiBhZGRpdGlvbiB0byBzcGVjaWFsIGNoYXJhY3RlcnMgdGhlIGZvcndhcmQgc2xhc2ggaXMgZXNjYXBlZCB0byBhbGxvdyBmb3JcbiAqIGVhc2llciBgZXZhbGAgdXNlIGFuZCBgRnVuY3Rpb25gIGNvbXBpbGF0aW9uLlxuICovXG52YXIgcmVSZWdFeHBDaGFycyA9IC9bLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZyxcbiAgICByZUhhc1JlZ0V4cENoYXJzID0gUmVnRXhwKHJlUmVnRXhwQ2hhcnMuc291cmNlKTtcblxuLyoqXG4gKiBFc2NhcGVzIHRoZSBgUmVnRXhwYCBzcGVjaWFsIGNoYXJhY3RlcnMgXCJcXFwiLCBcIi9cIiwgXCJeXCIsIFwiJFwiLCBcIi5cIiwgXCJ8XCIsIFwiP1wiLFxuICogXCIqXCIsIFwiK1wiLCBcIihcIiwgXCIpXCIsIFwiW1wiLCBcIl1cIiwgXCJ7XCIgYW5kIFwifVwiIGluIGBzdHJpbmdgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGVSZWdFeHAoJ1tsb2Rhc2hdKGh0dHBzOi8vbG9kYXNoLmNvbS8pJyk7XG4gKiAvLyA9PiAnXFxbbG9kYXNoXFxdXFwoaHR0cHM6XFwvXFwvbG9kYXNoXFwuY29tXFwvXFwpJ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gIHN0cmluZyA9IGJhc2VUb1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1JlZ0V4cENoYXJzLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlUmVnRXhwQ2hhcnMsICdcXFxcJCYnKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVzY2FwZVJlZ0V4cDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9zdHJpbmcvZXNjYXBlUmVnRXhwLmpzXG4gKiogbW9kdWxlIGlkID0gMzBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvaXNPYmplY3RMaWtlLmpzXG4gKiogbW9kdWxlIGlkID0gMzFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2Jhc2VQcm9wZXJ0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDMyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQncyBub3Qgb25lLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWRcbiAqIGZvciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUb1N0cmluZztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9iYXNlVG9TdHJpbmcuanNcbiAqKiBtb2R1bGUgaWQgPSAzM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==