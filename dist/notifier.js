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
	
	assign = __webpack_require__(9);
	
	
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
	    type: NotificationType.INFO,
	    onShow: null,
	    onRemove: null
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
	    return this._getAnimator().transition('enter', (function(_this) {
	      return function() {
	        if (finishCallback != null) {
	          finishCallback.apply(_this);
	        }
	        if (_this.onShow != null) {
	          return _this.onShow.apply(_this);
	        }
	      };
	    })(this));
	  };
	
	  Notification.prototype.remove = function(finishCallback) {
	    return this._getAnimator().transition('leave', (function(_this) {
	      return function() {
	        if (finishCallback != null) {
	          finishCallback.apply(_this);
	        }
	        if (_this.onRemove != null) {
	          _this.onRemove.apply(_this);
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
	    if (typeof params === 'string') {
	      params = {
	        text: params
	      };
	    }
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
	
	  Notifier.prototype.clearAll = function(includeDelayed) {
	    var id, notification, ref, results;
	    if (includeDelayed == null) {
	      includeDelayed = false;
	    }
	    ref = this.queue;
	    results = [];
	    for (id in ref) {
	      notification = ref[id];
	      if (includeDelayed) {
	        this.cancel(id);
	      }
	      notification.remove();
	      if (this.queue[notification.id]) {
	        results.push(delete this.queue[notification.id]);
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
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
	  clearAll: NotifierInstance.clearAll.bind(NotifierInstance),
	  cancel: NotifierInstance.cancel.bind(NotifierInstance),
	  type: NotificationType
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var $, dom, domClass, domExtra, event, selector;
	
	selector = __webpack_require__(2);
	
	dom = __webpack_require__(4);
	
	domExtra = __webpack_require__(5);
	
	domClass = __webpack_require__(6);
	
	event = __webpack_require__(7);
	
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

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module Selector
	 */
	
	var _global$each = __webpack_require__(3);
	
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
/* 3 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module DOM
	 */
	
	var _toArray = __webpack_require__(3);
	
	var _$ = __webpack_require__(2);
	
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module DOM (extra)
	 */
	
	var _each = __webpack_require__(3);
	
	var _append$before$after = __webpack_require__(4);
	
	var _$ = __webpack_require__(2);
	
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module Class
	 */
	
	var _each2 = __webpack_require__(3);
	
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module Events
	 */
	
	var _each = __webpack_require__(3);
	
	var _closest = __webpack_require__(8);
	
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	/**
	 * @module closest
	 */
	
	var _$$matches = __webpack_require__(2);
	
	var _each$uniq = __webpack_require__(3);
	
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var assignWith = __webpack_require__(10),
	    baseAssign = __webpack_require__(27),
	    createAssigner = __webpack_require__(29);
	
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
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(12),
	    isArrayLike = __webpack_require__(17),
	    isObject = __webpack_require__(21),
	    shimKeys = __webpack_require__(22);
	
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

	var isNative = __webpack_require__(13);
	
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var escapeRegExp = __webpack_require__(14),
	    isObjectLike = __webpack_require__(16);
	
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(15);
	
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
/* 15 */
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


/***/ },
/* 16 */
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(18),
	    isLength = __webpack_require__(20);
	
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(19);
	
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
/* 19 */
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
/* 20 */
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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(23),
	    isArray = __webpack_require__(24),
	    isIndex = __webpack_require__(25),
	    isLength = __webpack_require__(20),
	    keysIn = __webpack_require__(26);
	
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(17),
	    isObjectLike = __webpack_require__(16);
	
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(12),
	    isLength = __webpack_require__(20),
	    isObjectLike = __webpack_require__(16);
	
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
/* 25 */
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(23),
	    isArray = __webpack_require__(24),
	    isIndex = __webpack_require__(25),
	    isLength = __webpack_require__(20),
	    isObject = __webpack_require__(21);
	
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
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var baseCopy = __webpack_require__(28),
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
/* 28 */
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var bindCallback = __webpack_require__(30),
	    isIterateeCall = __webpack_require__(32),
	    restParam = __webpack_require__(33);
	
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(31);
	
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
/* 31 */
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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(17),
	    isIndex = __webpack_require__(25),
	    isObject = __webpack_require__(21);
	
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
/* 33 */
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


/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0MmU3ZGM4YzMxN2Y3MTJkNDFlNSIsIndlYnBhY2s6Ly8vLi9zcmMvbm90aWZpZXIuY29mZmVlIiwid2VicGFjazovLy8uL3NyYy9kb210YXN0aWMtc3Vic2V0LmNvZmZlZSIsIndlYnBhY2s6Ly8vLi9+L2RvbXRhc3RpYy9jb21tb25qcy9zZWxlY3Rvci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2RvbXRhc3RpYy9jb21tb25qcy91dGlsLmpzIiwid2VicGFjazovLy8uL34vZG9tdGFzdGljL2NvbW1vbmpzL2RvbS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2RvbXRhc3RpYy9jb21tb25qcy9kb20vZXh0cmEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9kb210YXN0aWMvY29tbW9uanMvZG9tL2NsYXNzLmpzIiwid2VicGFjazovLy8uL34vZG9tdGFzdGljL2NvbW1vbmpzL2V2ZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL34vZG9tdGFzdGljL2NvbW1vbmpzL3NlbGVjdG9yL2Nsb3Nlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvb2JqZWN0L2Fzc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9hc3NpZ25XaXRoLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL29iamVjdC9rZXlzLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9sYW5nL2lzTmF0aXZlLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL3N0cmluZy9lc2NhcGVSZWdFeHAuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvYmFzZVRvU3RyaW5nLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2lzT2JqZWN0TGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9pc0FycmF5TGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvYmFzZVByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2lzTGVuZ3RoLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2xhbmcvaXNPYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvc2hpbUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvbGFuZy9pc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9sYW5nL2lzQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvaXNJbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9vYmplY3Qva2V5c0luLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2Jhc2VBc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvYmFzZUNvcHkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlQXNzaWduZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvYmluZENhbGxiYWNrLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL3V0aWxpdHkvaWRlbnRpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvaXNJdGVyYXRlZUNhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvZnVuY3Rpb24vcmVzdFBhcmFtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVB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O0FBQ0E7O0FBRUE7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxFQUFFO0FBQ2IsY0FBYSxFQUFFO0FBQ2Y7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLEVBQUU7QUFDYixZQUFXLEVBQUU7QUFDYixZQUFXLEVBQUU7QUFDYixjQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzNCQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLFlBQVcsT0FBTztBQUNsQixjQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoibm90aWZpZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk5vdGlmaWVyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk5vdGlmaWVyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA0MmU3ZGM4YzMxN2Y3MTJkNDFlNVxuICoqLyIsIiQgICAgICAgPSByZXF1aXJlICcuL2RvbXRhc3RpYy1zdWJzZXQuY29mZmVlJ1xuYXNzaWduICA9IHJlcXVpcmUgJ2xvZGFzaC9vYmplY3QvYXNzaWduJ1xuXG5cbiMjI1xuIyBTb21lIHNldHRpbmdzXG4jIyNcbmJlbVdyYXBwZXIgPSAnZWVnbm90aWZzJ1xuYmVtSXRlbSAgICA9ICdlZWdub3RpZidcblxuXG4jIyNcbiMgbWluaW1hbCBVVUlEXG4jIyNcbl91dWlkID0gMDsgdXVpZCA9IC0+ICsrX3V1aWRcblxuXG4jIyNcbiMgTm90aWZpY2F0aW9uIHR5cGVcbiMjI1xuTm90aWZpY2F0aW9uVHlwZSA9XG5cdElORk8gICAgOiAnaW5mbydcblx0U1VDQ0VTUyA6ICdzdWNjZXNzJ1xuXHRXQVJOICAgIDogJ3dhcm4nXG5cdEVSUk9SICAgOiAnZXJyb3InXG5cdERFQlVHICAgOiAnZGVidWcnXG5cdENVU1RPTSAgOiAnY3VzdG9tJ1xuXG5BY3Rpb25UeXBlID1cblx0REVGQVVMVCA6ICdkZWZhdWx0J1xuXHRQUklNQVJZIDogJ3ByaW1hcnknXG5cdERBTkdFUiAgOiAnZGFuZ2VyJ1xuXHRDVVNUT00gIDogJ2N1c3RvbSdcblxuXG4jIyNcbiMgTm90aWZpY2F0aW9uIGNsYXNzXG4jIyNcbmNsYXNzIEFuaW1hdG9yXG5cblx0VElDSyA6IDE3XG5cblx0b3B0aW9ucyA6XG5cdFx0ZHVyYXRpb24gOiAyMDBcblx0XHRhbmltYXRpb24gOiAnbm90aWZpY2F0aW9uJ1xuXG5cdGNvbnN0cnVjdG9yIDogKERPTU5vZGUsIG9wdGlvbnMgPSB7fSkgLT5cblx0XHQjIFNldCBvcHRpb25zXG5cdFx0YXNzaWduIEBvcHRpb25zLCBvcHRpb25zXG5cblx0XHRARE9NTm9kZSA9IERPTU5vZGVcblx0XHRAY2xhc3NOYW1lUXVldWUgPSBbXVxuXHRcdEB0aW1lb3V0ID0gbnVsbFxuXG5cdFx0cmV0dXJuXG5cblx0dHJhbnNpdGlvbiA6IChhbmltYXRpb25UeXBlLCBmaW5pc2hDYWxsYmFjaykgLT5cblx0XHRjbGFzc05hbWUgICAgICAgPSBcIiN7QG9wdGlvbnMuYW5pbWF0aW9ufS0je2FuaW1hdGlvblR5cGV9XCJcblx0XHRhY3RpdmVDbGFzc05hbWUgPSBcIiN7Y2xhc3NOYW1lfS1hY3RpdmVcIlxuXHRcdEBET01Ob2RlLmFkZENsYXNzIGNsYXNzTmFtZVxuXHRcdEBxdWV1ZUNsYXNzIGFjdGl2ZUNsYXNzTmFtZVxuXG5cdFx0c2V0VGltZW91dCA9PlxuXHRcdFx0QERPTU5vZGUucmVtb3ZlQ2xhc3MgXCIje2NsYXNzTmFtZX0gI3thY3RpdmVDbGFzc05hbWV9XCJcblx0XHRcdGZpbmlzaENhbGxiYWNrKCkgaWYgZmluaXNoQ2FsbGJhY2s/XG5cdFx0LCBAb3B0aW9ucy5kdXJhdGlvblxuXG5cdHF1ZXVlQ2xhc3MgOiAoY2xhc3NOYW1lKSAtPlxuXHRcdEBjbGFzc05hbWVRdWV1ZS5wdXNoIGNsYXNzTmFtZVxuXG5cdFx0aWYgISBAdGltZW91dFxuXHRcdFx0QHRpbWVvdXQgPSBzZXRUaW1lb3V0IEBmbHVzaENsYXNzTmFtZVF1ZXVlLmJpbmQoQCksIEBUSUNLXG5cblx0XHRyZXR1cm5cblxuXHRmbHVzaENsYXNzTmFtZVF1ZXVlIDogLT5cblx0XHRmb3IgY2xhc3NOYW1lIGluIEBjbGFzc05hbWVRdWV1ZVxuXHRcdFx0QERPTU5vZGUuYWRkQ2xhc3MgY2xhc3NOYW1lXG5cblx0XHRAY2xhc3NOYW1lUXVldWUubGVuZ3RoID0gMFxuXHRcdEB0aW1lb3V0ID0gbnVsbFxuXG5cdFx0cmV0dXJuXG5cblxuIyMjXG4jIE5vdGlmaWNhdGlvbiBjbGFzc1xuIyMjXG5jbGFzcyBOb3RpZmljYXRpb25cblxuXHRkZWZhdWx0cyA6XG5cdFx0YWN0aW9ucyAgICAgIDogW11cblx0XHRjbG9zZU9uQ2xpY2sgOiBmYWxzZSAgICAgICAgICAgICAgICAgICMgTk9UIElNUExFTUVOVEVEXG5cdFx0ZGVsYXkgICAgICAgIDogMFxuXHRcdGR1cmF0aW9uICAgICA6IDZcblx0XHRpY29uICAgICAgICAgOiB0cnVlICAgICAgICAgICAgICAgICAgICMgKGZvbnQgaWNvbiAoL2Jhc2U2NC9pbWcgdXJsKVxuXHRcdG1vZGFsICAgICAgICA6IGZhbHNlXG5cdFx0dGVtcGxhdGUgICAgIDogJ2RlZmF1bHQnXG5cdFx0dGV4dCAgICAgICAgIDogJ0hlbGxvIHdvcmxkICEnXG5cdFx0dHlwZSAgICAgICAgIDogTm90aWZpY2F0aW9uVHlwZS5JTkZPXG5cdFx0b25TaG93ICAgICAgIDogbnVsbFxuXHRcdG9uUmVtb3ZlICAgICA6IG51bGxcblxuXG5cdGFjdGlvbkRlZmF1bHRzIDpcblx0XHRjbGFzc05hbWUgOiAnJ1xuXHRcdGZuICAgICAgICA6ID0+IEByZW1vdmUoKVxuXHRcdGxhYmVsICAgICA6ICdCdXR0b24nXG5cdFx0dHlwZSAgICAgIDogQWN0aW9uVHlwZS5ERUZBVUxUXG5cblxuXHRjb25zdHJ1Y3RvcjogKHBhcmFtcykgLT5cblx0XHRARE9NTm9kZSA9IG51bGxcblxuXHRcdGFzc2lnbiBALCBAZGVmYXVsdHMsIHBhcmFtcywgaWQgOiB1dWlkKClcblxuXG5cdF9jb25zdHJ1Y3RET01Ob2RlOiAtPlxuXHRcdGNsYXNzZXMgPSBbXG5cdFx0XHRiZW1JdGVtLFxuXHRcdFx0XCIje2JlbUl0ZW19LS0je0B0eXBlfVwiXG5cdFx0XVxuXG5cdFx0Y2xhc3Nlcy5wdXNoIFwiI3tiZW1JdGVtfS0taWNvblwiIGlmIEBpY29uXG5cdFx0Y2xhc3Nlcy5wdXNoIFwiI3tiZW1JdGVtfS0tbW9kYWxcIiBpZiBAbW9kYWxcblxuXHRcdEBET01Ob2RlID0gJCBcIlxuXHRcdFx0PGRpdiBjbGFzcz0nI3tjbGFzc2VzLmpvaW4oJyAnKX0nIGlkPScje2JlbUl0ZW19LS0je0BpZH0nPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPScje2JlbUl0ZW19X19jb250ZW50Jz4je0B0ZXh0fTwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XCJcblxuXHRcdEBfc2V0QWN0aW9ucygpXG5cdFx0QF9zZXRDb250cm9scygpXG5cblx0XHRyZXR1cm4gQERPTU5vZGVcblxuXG5cdF9zZXRDb250cm9sczogLT5cblx0XHRpZiBub3QgQG1vZGFsXG5cdFx0XHQjIENsb3NlIGNvbnRyb2xcblx0XHRcdCQoXCI8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9JyN7YmVtSXRlbX1fX2NvbnRyb2wtLWNsb3NlJz48aSBjbGFzcz0naWNvbi1jbG9zZS1jaXJjbGUnIC8+PC9idXR0b24+XCIpXG5cdFx0XHRcdC5vbiAnY2xpY2snLCAoZSkgPT4gQHJlbW92ZSgpXG5cdFx0XHRcdC5hcHBlbmRUbyBARE9NTm9kZVxuXG5cdFx0cmV0dXJuXG5cblxuXHRfc2V0QWN0aW9uczogLT5cblx0XHRpZiBAYWN0aW9ucy5sZW5ndGhcblx0XHRcdGFjdGlvbnMgPSAkKFwiPGRpdiBjbGFzcz0nI3tiZW1JdGVtfV9fYWN0aW9ucycgLz5cIikuYXBwZW5kVG8gQERPTU5vZGVcblxuXHRcdFx0Zm9yIGFjdGlvbiBpbiBAYWN0aW9uc1xuXHRcdFx0XHRkbyAoYWN0aW9uKSA9PlxuXHRcdFx0XHRcdCMgU2V0IGRlZmF1bHQgYWN0aW9uIHBhcmFtc1xuXHRcdFx0XHRcdGFjdGlvbiA9IGFzc2lnbiB7fSwgQGFjdGlvbkRlZmF1bHRzLCBhY3Rpb25cblxuXHRcdFx0XHRcdCQoXCI8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9JyN7YmVtSXRlbX1fX2FjdGlvbiAje2JlbUl0ZW19X19hY3Rpb24tLSN7YWN0aW9uLnR5cGV9ICN7YWN0aW9uLmNsYXNzTmFtZX0nPiN7YWN0aW9uLmxhYmVsfTwvYnV0dG9uPlwiKVxuXHRcdFx0XHRcdFx0Lm9uICdjbGljaycsIChlKSA9PiBhY3Rpb24uZm4uYXBwbHkgQCwgZVxuXHRcdFx0XHRcdFx0LmFwcGVuZFRvIGFjdGlvbnNcblxuXG5cdF9nZXRBbmltYXRvcjogLT5cblx0XHRyZXR1cm4gQERPTUFuaW1hdG9yIGlmIEBET01BbmltYXRvcj9cblxuXHRcdEBET01BbmltYXRvciA9IG5ldyBBbmltYXRvciBAZ2V0RE9NTm9kZSgpXG5cblx0XHRyZXR1cm4gQERPTUFuaW1hdG9yXG5cblxuXHRnZXRET01Ob2RlOiAtPiBpZiBARE9NTm9kZT8gdGhlbiBARE9NTm9kZSBlbHNlIEBfY29uc3RydWN0RE9NTm9kZSgpXG5cblxuXHRzaG93SW46ICh0YXJnZXQsIGZpbmlzaENhbGxiYWNrKSAtPlxuXHRcdEBnZXRET01Ob2RlKCkuYXBwZW5kVG8gdGFyZ2V0XG5cdFx0QF9nZXRBbmltYXRvcigpLnRyYW5zaXRpb24gJ2VudGVyJywgPT5cblx0XHRcdGZpbmlzaENhbGxiYWNrLmFwcGx5IEAgaWYgZmluaXNoQ2FsbGJhY2s/XG5cdFx0XHRAb25TaG93LmFwcGx5IEAgaWYgQG9uU2hvdz9cblxuXG5cdHJlbW92ZTogKGZpbmlzaENhbGxiYWNrKSAtPlxuXHRcdEBfZ2V0QW5pbWF0b3IoKS50cmFuc2l0aW9uICdsZWF2ZScsID0+XG5cdFx0XHRmaW5pc2hDYWxsYmFjay5hcHBseSBAIGlmIGZpbmlzaENhbGxiYWNrP1xuXHRcdFx0QG9uUmVtb3ZlLmFwcGx5IEAgaWYgQG9uUmVtb3ZlP1xuXHRcdFx0QGdldERPTU5vZGUoKS5yZW1vdmUoKVxuXG4jIyNcbiMgTm90aWZpZXIgY2xhc3NcbiMjI1xuY2xhc3MgTm90aWZpZXJcblxuXHRcdGNvbnN0cnVjdG9yOiAtPlxuXHRcdFx0IyBBZGQgbm90aWZpY2F0aW9ucyB3cmFwcGVyIHRvIGRvY3VtZW50XG5cdFx0XHRAd3JhcHBlciA9ICQoXCI8ZGl2IGNsYXNzPScje2JlbVdyYXBwZXJ9Jz48L2Rpdj5cIikuYXBwZW5kVG8gZG9jdW1lbnQuYm9keVxuXG5cdFx0XHQjIFByZXBhcmUgZW1wdHkgcXVldWVcblx0XHRcdEBxdWV1ZSA9IHt9XG5cblx0XHRcdHJldHVyblxuXG5cblx0XHRzZW5kOiAocGFyYW1zKSAtPlxuXHRcdFx0IyBIYW5kbGUgc2ltcGxlIG1lc3NhZ2UgZm9ybVxuXHRcdFx0aWYgdHlwZW9mIHBhcmFtcyBpcyAnc3RyaW5nJ1xuXHRcdFx0XHRwYXJhbXMgPSB0ZXh0IDogcGFyYW1zXG5cblx0XHRcdCMgQ3JlYXRlIGEgbm90aWZpY2F0aW9uXG5cdFx0XHRub3RpZmljYXRpb24gPSBuZXcgTm90aWZpY2F0aW9uIHBhcmFtc1xuXG5cdFx0XHQjIEtlZXAgbm90aWZpY2F0aW9uXG5cdFx0XHRpZCA9IEByZWdpc3RlciBub3RpZmljYXRpb25cblxuXHRcdFx0IyBTaG93IG5vdGlmXG5cdFx0XHRub3RpZmljYXRpb24uZGVsYXlUaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuXHRcdFx0XHRAc2hvdyBub3RpZmljYXRpb25cblx0XHRcdCwgbm90aWZpY2F0aW9uLmRlbGF5ICogMTAwMFxuXG5cdFx0XHQjIFNlbmQgYmFjayBpZCBmb3IgY2FuY2VsbGF0aW9uXG5cdFx0XHRyZXR1cm4gaWRcblxuXG5cdFx0Y2FuY2VsOiAoaWQpIC0+XG5cdFx0XHRpZiBAcXVldWVbaWRdXG5cdFx0XHRcdGNsZWFyVGltZW91dCBAcXVldWVbaWRdLmRlbGF5VGltZW91dFxuXHRcdFx0XHRkZWxldGUgQHF1ZXVlW2lkXVxuXHRcdFx0XHR0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZhbHNlXG5cblxuXHRcdHJlZ2lzdGVyOiAobm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0QHF1ZXVlW25vdGlmaWNhdGlvbi5pZF0gPSBub3RpZmljYXRpb25cblxuXHRcdFx0cmV0dXJuIG5vdGlmaWNhdGlvbi5pZFxuXG5cblx0XHRzaG93OiAobm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0bm90aWZpY2F0aW9uLnNob3dJbiBAd3JhcHBlclxuXG5cdFx0XHQjIFNhdmUgcmVtb3ZlIGV2ZW50XG5cdFx0XHRpZiBub3RpZmljYXRpb24uZHVyYXRpb24gPiAtMVxuXHRcdFx0XHRub3RpZmljYXRpb24uZGlzcGxheVRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG5cdFx0XHRcdFx0QHJlbW92ZSBub3RpZmljYXRpb25cblx0XHRcdFx0LCBub3RpZmljYXRpb24uZHVyYXRpb24gKiAxMDAwXG5cblx0XHRcdHJldHVyblxuXG5cdFx0Y2xlYXJBbGw6IChpbmNsdWRlRGVsYXllZCA9IGZhbHNlKSAtPlxuXHRcdFx0Zm9yIGlkLCBub3RpZmljYXRpb24gb2YgQHF1ZXVlXG5cdFx0XHRcdEBjYW5jZWwgaWQgaWYgaW5jbHVkZURlbGF5ZWRcblx0XHRcdFx0bm90aWZpY2F0aW9uLnJlbW92ZSgpXG5cdFx0XHRcdGRlbGV0ZSBAcXVldWVbbm90aWZpY2F0aW9uLmlkXSBpZiBAcXVldWVbbm90aWZpY2F0aW9uLmlkXVxuXG5cblxuXHRcdHJlbW92ZTogKG5vdGlmaWNhdGlvbikgLT5cblx0XHRcdG5vdGlmaWNhdGlvbi5yZW1vdmUoKVxuXHRcdFx0ZGVsZXRlIEBxdWV1ZVtub3RpZmljYXRpb24uaWRdIGlmIEBxdWV1ZVtub3RpZmljYXRpb24uaWRdXG5cblx0XHRcdHJldHVyblxuXG5cbk5vdGlmaWVySW5zdGFuY2UgPSBuZXcgTm90aWZpZXJcblxuXG4jIFJldHVybiBhbiBpbnN0YW5jZSBvZiB0aGUgbm90aWZpZXIgc2VydmljZVxubW9kdWxlLmV4cG9ydHMgPVxuXHRhY3Rpb25UeXBlICAgOiBBY3Rpb25UeXBlXG5cdHNlbmQgICAgICAgICA6IE5vdGlmaWVySW5zdGFuY2Uuc2VuZC5iaW5kIE5vdGlmaWVySW5zdGFuY2Vcblx0Y2xlYXJBbGwgICAgIDogTm90aWZpZXJJbnN0YW5jZS5jbGVhckFsbC5iaW5kIE5vdGlmaWVySW5zdGFuY2Vcblx0Y2FuY2VsICAgICAgIDogTm90aWZpZXJJbnN0YW5jZS5jYW5jZWwuYmluZCBOb3RpZmllckluc3RhbmNlXG5cdHR5cGUgICAgICAgICA6IE5vdGlmaWNhdGlvblR5cGVcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL25vdGlmaWVyLmNvZmZlZVxuICoqLyIsInNlbGVjdG9yID0gcmVxdWlyZSAnZG9tdGFzdGljL2NvbW1vbmpzL3NlbGVjdG9yJ1xuZG9tICAgICAgPSByZXF1aXJlICdkb210YXN0aWMvY29tbW9uanMvZG9tJ1xuZG9tRXh0cmEgPSByZXF1aXJlICdkb210YXN0aWMvY29tbW9uanMvZG9tL2V4dHJhJ1xuZG9tQ2xhc3MgPSByZXF1aXJlICdkb210YXN0aWMvY29tbW9uanMvZG9tL2NsYXNzJ1xuZXZlbnQgICAgPSByZXF1aXJlICdkb210YXN0aWMvY29tbW9uanMvZXZlbnQnXG5cbiQgICAgICAgICAgICAgICAgPSBzZWxlY3Rvci4kXG4kLmZuICAgICAgICAgICAgID0ge31cbiQuZm4uYWRkQ2xhc3MgICAgPSBkb21DbGFzcy5hZGRDbGFzc1xuJC5mbi5hcHBlbmRUbyAgICA9IGRvbUV4dHJhLmFwcGVuZFRvXG4kLmZuLm9uICAgICAgICAgID0gZXZlbnQub25cbiQuZm4ucmVtb3ZlICAgICAgPSBkb21FeHRyYS5yZW1vdmVcbiQuZm4ucmVtb3ZlQ2xhc3MgPSBkb21DbGFzcy5yZW1vdmVDbGFzc1xuXG5tb2R1bGUuZXhwb3J0cyA9ICRcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RvbXRhc3RpYy1zdWJzZXQuY29mZmVlXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuLyoqXG4gKiBAbW9kdWxlIFNlbGVjdG9yXG4gKi9cblxudmFyIF9nbG9iYWwkZWFjaCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIGlzUHJvdG90eXBlU2V0ID0gZmFsc2UsXG4gICAgcmVGcmFnbWVudCA9IC9eXFxzKjwoXFx3K3whKVtePl0qPi8sXG4gICAgcmVTaW5nbGVUYWcgPSAvXjwoXFx3KylcXHMqXFwvPz4oPzo8XFwvXFwxPnwpJC8sXG4gICAgcmVTaW1wbGVTZWxlY3RvciA9IC9eW1xcLiNdP1tcXHctXSokLztcblxuLypcbiAqIFZlcnNhdGlsZSB3cmFwcGVyIGZvciBgcXVlcnlTZWxlY3RvckFsbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxBcnJheX0gc2VsZWN0b3IgUXVlcnkgc2VsZWN0b3IsIGBOb2RlYCwgYE5vZGVMaXN0YCwgYXJyYXkgb2YgZWxlbWVudHMsIG9yIEhUTUwgZnJhZ21lbnQgc3RyaW5nLlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdH0gY29udGV4dD1kb2N1bWVudCBUaGUgY29udGV4dCBmb3IgdGhlIHNlbGVjdG9yIHRvIHF1ZXJ5IGVsZW1lbnRzLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgIHZhciAkaXRlbXMgPSAkKC5pdGVtcycpO1xuICogQGV4YW1wbGVcbiAqICAgICB2YXIgJGVsZW1lbnQgPSAkKGRvbUVsZW1lbnQpO1xuICogQGV4YW1wbGVcbiAqICAgICB2YXIgJGxpc3QgPSAkKG5vZGVMaXN0LCBkb2N1bWVudC5ib2R5KTtcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyICRlbGVtZW50ID0gJCgnPHA+ZXZlcmdyZWVuPC9wPicpO1xuICovXG5cbmZ1bmN0aW9uICQoc2VsZWN0b3IpIHtcbiAgICB2YXIgY29udGV4dCA9IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQgOiBhcmd1bWVudHNbMV07XG5cbiAgICB2YXIgY29sbGVjdGlvbjtcblxuICAgIGlmICghc2VsZWN0b3IpIHtcblxuICAgICAgICBjb2xsZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChudWxsKTtcbiAgICB9IGVsc2UgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgV3JhcHBlcikge1xuXG4gICAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcblxuICAgICAgICBjb2xsZWN0aW9uID0gc2VsZWN0b3Iubm9kZVR5cGUgfHwgc2VsZWN0b3IgPT09IHdpbmRvdyA/IFtzZWxlY3Rvcl0gOiBzZWxlY3RvcjtcbiAgICB9IGVsc2UgaWYgKHJlRnJhZ21lbnQudGVzdChzZWxlY3RvcikpIHtcblxuICAgICAgICBjb2xsZWN0aW9uID0gY3JlYXRlRnJhZ21lbnQoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgY29udGV4dCA9IHR5cGVvZiBjb250ZXh0ID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGV4dCkgOiBjb250ZXh0Lmxlbmd0aCA/IGNvbnRleHRbMF0gOiBjb250ZXh0O1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSBxdWVyeVNlbGVjdG9yKHNlbGVjdG9yLCBjb250ZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gd3JhcChjb2xsZWN0aW9uKTtcbn1cblxuLypcbiAqIEZpbmQgZGVzY2VuZGFudHMgbWF0Y2hpbmcgdGhlIHByb3ZpZGVkIGBzZWxlY3RvcmAgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fEFycmF5fSBzZWxlY3RvciBRdWVyeSBzZWxlY3RvciwgYE5vZGVgLCBgTm9kZUxpc3RgLCBhcnJheSBvZiBlbGVtZW50cywgb3IgSFRNTCBmcmFnbWVudCBzdHJpbmcuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLnNlbGVjdG9yJykuZmluZCgnLmRlZXAnKS4kKCcuZGVlcGVzdCcpO1xuICovXG5cbmZ1bmN0aW9uIGZpbmQoc2VsZWN0b3IpIHtcbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICBfZ2xvYmFsJGVhY2guZWFjaCh0aGlzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBfZ2xvYmFsJGVhY2guZWFjaChxdWVyeVNlbGVjdG9yKHNlbGVjdG9yLCBub2RlKSwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICBpZiAobm9kZXMuaW5kZXhPZihjaGlsZCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgbm9kZXMucHVzaChjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiAkKG5vZGVzKTtcbn1cblxuLypcbiAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBlbGVtZW50IHdvdWxkIGJlIHNlbGVjdGVkIGJ5IHRoZSBzcGVjaWZpZWQgc2VsZWN0b3Igc3RyaW5nOyBvdGhlcndpc2UsIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnQgRWxlbWVudCB0byB0ZXN0XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgU2VsZWN0b3IgdG8gbWF0Y2ggYWdhaW5zdCBlbGVtZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgJC5tYXRjaGVzKGVsZW1lbnQsICcubWF0Y2gnKTtcbiAqL1xuXG52YXIgbWF0Y2hlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBFbGVtZW50LnByb3RvdHlwZSA6IF9nbG9iYWwkZWFjaC5nbG9iYWwsXG4gICAgICAgIF9tYXRjaGVzID0gY29udGV4dC5tYXRjaGVzIHx8IGNvbnRleHQubWF0Y2hlc1NlbGVjdG9yIHx8IGNvbnRleHQubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGNvbnRleHQubXNNYXRjaGVzU2VsZWN0b3IgfHwgY29udGV4dC5vTWF0Y2hlc1NlbGVjdG9yIHx8IGNvbnRleHQud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIF9tYXRjaGVzLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpO1xuICAgIH07XG59KSgpO1xuXG4vKlxuICogVXNlIHRoZSBmYXN0ZXIgYGdldEVsZW1lbnRCeUlkYCwgYGdldEVsZW1lbnRzQnlDbGFzc05hbWVgIG9yIGBnZXRFbGVtZW50c0J5VGFnTmFtZWAgb3ZlciBgcXVlcnlTZWxlY3RvckFsbGAgaWYgcG9zc2libGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciBRdWVyeSBzZWxlY3Rvci5cbiAqIEBwYXJhbSB7Tm9kZX0gY29udGV4dCBUaGUgY29udGV4dCBmb3IgdGhlIHNlbGVjdG9yIHRvIHF1ZXJ5IGVsZW1lbnRzLlxuICogQHJldHVybiB7T2JqZWN0fSBOb2RlTGlzdCwgSFRNTENvbGxlY3Rpb24sIG9yIEFycmF5IG9mIG1hdGNoaW5nIGVsZW1lbnRzIChkZXBlbmRpbmcgb24gbWV0aG9kIHVzZWQpLlxuICovXG5cbmZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IsIGNvbnRleHQpIHtcblxuICAgIHZhciBpc1NpbXBsZVNlbGVjdG9yID0gcmVTaW1wbGVTZWxlY3Rvci50ZXN0KHNlbGVjdG9yKTtcblxuICAgIGlmIChpc1NpbXBsZVNlbGVjdG9yKSB7XG4gICAgICAgIGlmIChzZWxlY3RvclswXSA9PT0gJyMnKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IChjb250ZXh0LmdldEVsZW1lbnRCeUlkID8gY29udGV4dCA6IGRvY3VtZW50KS5nZXRFbGVtZW50QnlJZChzZWxlY3Rvci5zbGljZSgxKSk7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudCA/IFtlbGVtZW50XSA6IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxlY3RvclswXSA9PT0gJy4nKSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHNlbGVjdG9yLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZShzZWxlY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG59XG5cbi8qXG4gKiBDcmVhdGUgRE9NIGZyYWdtZW50IGZyb20gYW4gSFRNTCBzdHJpbmdcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWwgU3RyaW5nIHJlcHJlc2VudGluZyBIVE1MLlxuICogQHJldHVybiB7Tm9kZUxpc3R9XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnQoaHRtbCkge1xuXG4gICAgaWYgKHJlU2luZ2xlVGFnLnRlc3QoaHRtbCkpIHtcbiAgICAgICAgcmV0dXJuIFtkb2N1bWVudC5jcmVhdGVFbGVtZW50KFJlZ0V4cC4kMSldO1xuICAgIH1cblxuICAgIHZhciBlbGVtZW50cyA9IFtdLFxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgY2hpbGRyZW4gPSBjb250YWluZXIuY2hpbGROb2RlcztcblxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgZWxlbWVudHMucHVzaChjaGlsZHJlbltpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnRzO1xufVxuXG4vKlxuICogQ2FsbGluZyBgJChzZWxlY3RvcilgIHJldHVybnMgYSB3cmFwcGVkIGNvbGxlY3Rpb24gb2YgZWxlbWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZUxpc3R8QXJyYXl9IGNvbGxlY3Rpb24gRWxlbWVudChzKSB0byB3cmFwLlxuICogQHJldHVybiAoT2JqZWN0KSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKi9cblxuZnVuY3Rpb24gd3JhcChjb2xsZWN0aW9uKSB7XG5cbiAgICBpZiAoIWlzUHJvdG90eXBlU2V0KSB7XG4gICAgICAgIFdyYXBwZXIucHJvdG90eXBlID0gJC5mbjtcbiAgICAgICAgV3JhcHBlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBXcmFwcGVyO1xuICAgICAgICBpc1Byb3RvdHlwZVNldCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBXcmFwcGVyKGNvbGxlY3Rpb24pO1xufVxuXG4vKlxuICogQ29uc3RydWN0b3IgZm9yIHRoZSBPYmplY3QucHJvdG90eXBlIHN0cmF0ZWd5XG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlTGlzdHxBcnJheX0gY29sbGVjdGlvbiBFbGVtZW50KHMpIHRvIHdyYXAuXG4gKi9cblxuZnVuY3Rpb24gV3JhcHBlcihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgICBmb3IgKDsgaSA8IGxlbmd0aDspIHtcbiAgICAgICAgdGhpc1tpXSA9IGNvbGxlY3Rpb25baSsrXTtcbiAgICB9XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG59XG5cbi8qXG4gKiBFeHBvcnQgaW50ZXJmYWNlXG4gKi9cblxuZXhwb3J0cy4kID0gJDtcbmV4cG9ydHMuZmluZCA9IGZpbmQ7XG5leHBvcnRzLm1hdGNoZXMgPSBtYXRjaGVzO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy9zZWxlY3Rvci9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG4vKlxuICogQG1vZHVsZSBVdGlsXG4gKi9cblxuLypcbiAqIFJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIHNjb3BlXG4gKiBAcHJpdmF0ZVxuICovXG5cbnZhciBnbG9iYWwgPSBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xuXG4vKipcbiAqIENvbnZlcnQgYE5vZGVMaXN0YCB0byBgQXJyYXlgLlxuICpcbiAqIEBwYXJhbSB7Tm9kZUxpc3R8QXJyYXl9IGNvbGxlY3Rpb25cbiAqIEByZXR1cm4ge0FycmF5fVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB0b0FycmF5KGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgIHJlc3VsdCA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0W2ldID0gY29sbGVjdGlvbltpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gW10uZm9yRWFjaCBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge05vZGV8Tm9kZUxpc3R8QXJyYXl9IGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtOb2RlfE5vZGVMaXN0fEFycmF5fVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBlYWNoKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggIT09IHVuZGVmaW5lZCAmJiBjb2xsZWN0aW9uLm5vZGVUeXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb2xsZWN0aW9uW2ldLCBpLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29sbGVjdGlvbiwgMCwgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xufVxuXG4vKipcbiAqIEFzc2lnbiBlbnVtZXJhYmxlIHByb3BlcnRpZXMgZnJvbSBzb3VyY2Ugb2JqZWN0KHMpIHRvIHRhcmdldCBvYmplY3RcbiAqXG4gKiBAbWV0aG9kIGV4dGVuZFxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBPYmplY3QgdG8gZXh0ZW5kXG4gKiBAcGFyYW0ge09iamVjdH0gW3NvdXJjZV0gT2JqZWN0IHRvIGV4dGVuZCBmcm9tXG4gKiBAcmV0dXJuIHtPYmplY3R9IEV4dGVuZGVkIG9iamVjdFxuICogQGV4YW1wbGVcbiAqICAgICAkLmV4dGVuZCh7YTogMX0sIHtiOiAyfSk7XG4gKiAgICAgLy8ge2E6IDEsIGI6IDJ9XG4gKiBAZXhhbXBsZVxuICogICAgICQuZXh0ZW5kKHthOiAxfSwge2I6IDJ9LCB7YTogM30pO1xuICogICAgIC8vIHthOiAzLCBiOiAyfVxuICovXG5cbmZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgc291cmNlcyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgc291cmNlc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzcmMpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzcmMpIHtcbiAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHNyY1twcm9wXTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBjb2xsZWN0aW9uIHdpdGhvdXQgZHVwbGljYXRlc1xuICpcbiAqIEBwYXJhbSBjb2xsZWN0aW9uIENvbGxlY3Rpb24gdG8gcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbVxuICogQHJldHVybiB7Tm9kZXxOb2RlTGlzdHxBcnJheX1cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdW5pcShjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmlsdGVyKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSBpbmRleDtcbiAgICB9KTtcbn1cblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmdsb2JhbCA9IGdsb2JhbDtcbmV4cG9ydHMudG9BcnJheSA9IHRvQXJyYXk7XG5leHBvcnRzLmVhY2ggPSBlYWNoO1xuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG5leHBvcnRzLnVuaXEgPSB1bmlxO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy91dGlsLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuLyoqXG4gKiBAbW9kdWxlIERPTVxuICovXG5cbnZhciBfdG9BcnJheSA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIF8kID0gcmVxdWlyZSgnLi4vc2VsZWN0b3IvaW5kZXgnKTtcblxudmFyIGZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcblxuLyoqXG4gKiBBcHBlbmQgZWxlbWVudChzKSB0byBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxPYmplY3R9IGVsZW1lbnQgV2hhdCB0byBhcHBlbmQgdG8gdGhlIGVsZW1lbnQocykuXG4gKiBDbG9uZXMgZWxlbWVudHMgYXMgbmVjZXNzYXJ5LlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykuYXBwZW5kKCc8cD5tb3JlPC9wPicpO1xuICovXG5cbmZ1bmN0aW9uIGFwcGVuZChlbGVtZW50KSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlTGlzdCA/IF90b0FycmF5LnRvQXJyYXkoZWxlbWVudCkgOiBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGZvckVhY2guY2FsbChlbGVtZW50cywgdGhpcy5hcHBlbmRDaGlsZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIF9lYWNoKHRoaXMsIGFwcGVuZCwgZWxlbWVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFBsYWNlIGVsZW1lbnQocykgYXQgdGhlIGJlZ2lubmluZyBvZiBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxPYmplY3R9IGVsZW1lbnQgV2hhdCB0byBwbGFjZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBlbGVtZW50KHMpLlxuICogQ2xvbmVzIGVsZW1lbnRzIGFzIG5lY2Vzc2FyeS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLnByZXBlbmQoJzxzcGFuPnN0YXJ0PC9zcGFuPicpO1xuICovXG5cbmZ1bmN0aW9uIHByZXBlbmQoZWxlbWVudCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRCZWZvcmUoZWxlbWVudCwgdGhpcy5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0ID8gX3RvQXJyYXkudG9BcnJheShlbGVtZW50KSA6IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgZm9yRWFjaC5jYWxsKGVsZW1lbnRzLnJldmVyc2UoKSwgcHJlcGVuZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIF9lYWNoKHRoaXMsIHByZXBlbmQsIGVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBQbGFjZSBlbGVtZW50KHMpIGJlZm9yZSBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxPYmplY3R9IGVsZW1lbnQgV2hhdCB0byBwbGFjZSBhcyBzaWJsaW5nKHMpIGJlZm9yZSB0byB0aGUgZWxlbWVudChzKS5cbiAqIENsb25lcyBlbGVtZW50cyBhcyBuZWNlc3NhcnkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW1zJykuYmVmb3JlKCc8cD5wcmVmaXg8L3A+Jyk7XG4gKi9cblxuZnVuY3Rpb24gYmVmb3JlKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWJlZ2luJywgZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBlbGVtZW50IGluc3RhbmNlb2YgTm9kZUxpc3QgPyBfdG9BcnJheS50b0FycmF5KGVsZW1lbnQpIDogZWxlbWVudDtcbiAgICAgICAgICAgICAgICBmb3JFYWNoLmNhbGwoZWxlbWVudHMsIGJlZm9yZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIF9lYWNoKHRoaXMsIGJlZm9yZSwgZWxlbWVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFBsYWNlIGVsZW1lbnQocykgYWZ0ZXIgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8T2JqZWN0fSBlbGVtZW50IFdoYXQgdG8gcGxhY2UgYXMgc2libGluZyhzKSBhZnRlciB0byB0aGUgZWxlbWVudChzKS4gQ2xvbmVzIGVsZW1lbnRzIGFzIG5lY2Vzc2FyeS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbXMnKS5hZnRlcignPHNwYW4+c3VmPC9zcGFuPjxzcGFuPmZpeDwvc3Bhbj4nKTtcbiAqL1xuXG5mdW5jdGlvbiBhZnRlcihlbGVtZW50KSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmVuZCcsIGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbGVtZW50LCB0aGlzLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0ID8gX3RvQXJyYXkudG9BcnJheShlbGVtZW50KSA6IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgZm9yRWFjaC5jYWxsKGVsZW1lbnRzLnJldmVyc2UoKSwgYWZ0ZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBfZWFjaCh0aGlzLCBhZnRlciwgZWxlbWVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENsb25lIGEgd3JhcHBlZCBvYmplY3QuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBXcmFwcGVkIGNvbGxlY3Rpb24gb2YgY2xvbmVkIG5vZGVzLlxuICogQGV4YW1wbGVcbiAqICAgICAkKGVsZW1lbnQpLmNsb25lKCk7XG4gKi9cblxuZnVuY3Rpb24gY2xvbmUoKSB7XG4gICAgcmV0dXJuIF8kLiQoX2Nsb25lKHRoaXMpKTtcbn1cblxuLyoqXG4gKiBDbG9uZSBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fEFycmF5fSBlbGVtZW50IFRoZSBlbGVtZW50KHMpIHRvIGNsb25lLlxuICogQHJldHVybiB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8QXJyYXl9IFRoZSBjbG9uZWQgZWxlbWVudChzKVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBfY2xvbmUoZWxlbWVudCkge1xuICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgfSBlbHNlIGlmICgnbGVuZ3RoJyBpbiBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBbXS5tYXAuY2FsbChlbGVtZW50LCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBTcGVjaWFsaXplZCBpdGVyYXRpb24sIGFwcGx5aW5nIGBmbmAgaW4gcmV2ZXJzZWQgbWFubmVyIHRvIGEgY2xvbmUgb2YgZWFjaCBlbGVtZW50LCBidXQgdGhlIHByb3ZpZGVkIG9uZS5cbiAqXG4gKiBAcGFyYW0ge05vZGVMaXN0fEFycmF5fSBjb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIF9lYWNoKGNvbGxlY3Rpb24sIGZuLCBlbGVtZW50KSB7XG4gICAgdmFyIGwgPSBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgICB3aGlsZSAobC0tKSB7XG4gICAgICAgIHZhciBlbG0gPSBsID09PSAwID8gZWxlbWVudCA6IF9jbG9uZShlbGVtZW50KTtcbiAgICAgICAgZm4uY2FsbChjb2xsZWN0aW9uW2xdLCBlbG0pO1xuICAgIH1cbn1cblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmFwcGVuZCA9IGFwcGVuZDtcbmV4cG9ydHMucHJlcGVuZCA9IHByZXBlbmQ7XG5leHBvcnRzLmJlZm9yZSA9IGJlZm9yZTtcbmV4cG9ydHMuYWZ0ZXIgPSBhZnRlcjtcbmV4cG9ydHMuY2xvbmUgPSBjbG9uZTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9kb210YXN0aWMvY29tbW9uanMvZG9tL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuLyoqXG4gKiBAbW9kdWxlIERPTSAoZXh0cmEpXG4gKi9cblxudmFyIF9lYWNoID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgX2FwcGVuZCRiZWZvcmUkYWZ0ZXIgPSByZXF1aXJlKCcuL2luZGV4Jyk7XG5cbnZhciBfJCA9IHJlcXVpcmUoJy4uL3NlbGVjdG9yL2luZGV4Jyk7XG5cbi8qKlxuICogQXBwZW5kIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbiB0byB0aGUgc3BlY2lmaWVkIGVsZW1lbnQocykuXG4gKlxuICogQHBhcmFtIHtOb2RlfE5vZGVMaXN0fE9iamVjdH0gZWxlbWVudCBXaGF0IHRvIGFwcGVuZCB0aGUgZWxlbWVudChzKSB0by4gQ2xvbmVzIGVsZW1lbnRzIGFzIG5lY2Vzc2FyeS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gKi9cblxuZnVuY3Rpb24gYXBwZW5kVG8oZWxlbWVudCkge1xuICAgIHZhciBjb250ZXh0ID0gdHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnID8gXyQuJChlbGVtZW50KSA6IGVsZW1lbnQ7XG4gICAgX2FwcGVuZCRiZWZvcmUkYWZ0ZXIuYXBwZW5kLmNhbGwoY29udGV4dCwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qXG4gKiBFbXB0eSBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykuZW1wdHkoKTtcbiAqL1xuXG5mdW5jdGlvbiBlbXB0eSgpIHtcbiAgICByZXR1cm4gX2VhY2guZWFjaCh0aGlzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgY29sbGVjdGlvbiBmcm9tIHRoZSBET00uXG4gKlxuICogQHJldHVybiB7QXJyYXl9IEFycmF5IGNvbnRhaW5pbmcgdGhlIHJlbW92ZWQgZWxlbWVudHNcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5yZW1vdmUoKTtcbiAqL1xuXG5mdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgcmV0dXJuIF9lYWNoLmVhY2godGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogUmVwbGFjZSBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgbmV3IGNvbnRlbnQsIGFuZCByZXR1cm4gdGhlIGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgd2VyZSByZXBsYWNlZC5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgY29udGFpbmluZyB0aGUgcmVwbGFjZWQgZWxlbWVudHNcbiAqL1xuXG5mdW5jdGlvbiByZXBsYWNlV2l0aCgpIHtcbiAgICByZXR1cm4gX2FwcGVuZCRiZWZvcmUkYWZ0ZXIuYmVmb3JlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykucmVtb3ZlKCk7XG59XG5cbi8qKlxuICogR2V0IHRoZSBgdGV4dENvbnRlbnRgIGZyb20gdGhlIGZpcnN0LCBvciBzZXQgdGhlIGB0ZXh0Q29udGVudGAgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbdmFsdWVdXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS50ZXh0KCdOZXcgY29udGVudCcpO1xuICovXG5cbmZ1bmN0aW9uIHRleHQodmFsdWUpIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzWzBdLnRleHRDb250ZW50O1xuICAgIH1cblxuICAgIF9lYWNoLmVhY2godGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9ICcnICsgdmFsdWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGB2YWx1ZWAgZnJvbSB0aGUgZmlyc3QsIG9yIHNldCB0aGUgYHZhbHVlYCBvZiBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFt2YWx1ZV1cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCdpbnB1dC5maXJzdE5hbWUnKS52YWx1ZSgnTmV3IHZhbHVlJyk7XG4gKi9cblxuZnVuY3Rpb24gdmFsKHZhbHVlKSB7XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpc1swXS52YWx1ZTtcbiAgICB9XG5cbiAgICBfZWFjaC5lYWNoKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKlxuICogRXhwb3J0IGludGVyZmFjZVxuICovXG5cbmV4cG9ydHMuYXBwZW5kVG8gPSBhcHBlbmRUbztcbmV4cG9ydHMuZW1wdHkgPSBlbXB0eTtcbmV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuZXhwb3J0cy5yZXBsYWNlV2l0aCA9IHJlcGxhY2VXaXRoO1xuZXhwb3J0cy50ZXh0ID0gdGV4dDtcbmV4cG9ydHMudmFsID0gdmFsO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy9kb20vZXh0cmEuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG4vKipcbiAqIEBtb2R1bGUgQ2xhc3NcbiAqL1xuXG52YXIgX2VhY2gyID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG4vKipcbiAqIEFkZCBhIGNsYXNzIHRvIHRoZSBlbGVtZW50KHMpXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFNwYWNlLXNlcGFyYXRlZCBjbGFzcyBuYW1lKHMpIHRvIGFkZCB0byB0aGUgZWxlbWVudChzKS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLmFkZENsYXNzKCdiYXInKTtcbiAqICAgICAkKCcuaXRlbScpLmFkZENsYXNzKCdiYXIgZm9vJyk7XG4gKi9cblxuZnVuY3Rpb24gYWRkQ2xhc3ModmFsdWUpIHtcbiAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIF9lYWNoMi5lYWNoKHZhbHVlLnNwbGl0KCcgJyksIF9lYWNoLmJpbmQodGhpcywgJ2FkZCcpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2xhc3MgZnJvbSB0aGUgZWxlbWVudChzKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBTcGFjZS1zZXBhcmF0ZWQgY2xhc3MgbmFtZShzKSB0byByZW1vdmUgZnJvbSB0aGUgZWxlbWVudChzKS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbXMnKS5yZW1vdmVDbGFzcygnYmFyJyk7XG4gKiAgICAgJCgnLml0ZW1zJykucmVtb3ZlQ2xhc3MoJ2JhciBmb28nKTtcbiAqL1xuXG5mdW5jdGlvbiByZW1vdmVDbGFzcyh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgX2VhY2gyLmVhY2godmFsdWUuc3BsaXQoJyAnKSwgX2VhY2guYmluZCh0aGlzLCAncmVtb3ZlJykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBUb2dnbGUgYSBjbGFzcyBhdCB0aGUgZWxlbWVudChzKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBTcGFjZS1zZXBhcmF0ZWQgY2xhc3MgbmFtZShzKSB0byB0b2dnbGUgYXQgdGhlIGVsZW1lbnQocykuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS50b2dnbGVDbGFzcygnYmFyJyk7XG4gKiAgICAgJCgnLml0ZW0nKS50b2dnbGVDbGFzcygnYmFyIGZvbycpO1xuICovXG5cbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICBfZWFjaDIuZWFjaCh2YWx1ZS5zcGxpdCgnICcpLCBfZWFjaC5iaW5kKHRoaXMsICd0b2dnbGUnKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBlbGVtZW50KHMpIGhhdmUgYSBjbGFzcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgQ2hlY2sgaWYgdGhlIERPTSBlbGVtZW50IGNvbnRhaW5zIHRoZSBjbGFzcyBuYW1lLiBXaGVuIGFwcGxpZWQgdG8gbXVsdGlwbGUgZWxlbWVudHMsXG4gKiByZXR1cm5zIGB0cnVlYCBpZiBfYW55XyBvZiB0aGVtIGNvbnRhaW5zIHRoZSBjbGFzcyBuYW1lLlxuICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgZWxlbWVudCdzIGNsYXNzIGF0dHJpYnV0ZSBjb250YWlucyB0aGUgY2xhc3MgbmFtZS5cbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5oYXNDbGFzcygnYmFyJyk7XG4gKi9cblxuZnVuY3Rpb24gaGFzQ2xhc3ModmFsdWUpIHtcbiAgICByZXR1cm4gKHRoaXMubm9kZVR5cGUgPyBbdGhpc10gOiB0aGlzKS5zb21lKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyh2YWx1ZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogU3BlY2lhbGl6ZWQgaXRlcmF0aW9uLCBhcHBseWluZyBgZm5gIG9mIHRoZSBjbGFzc0xpc3QgQVBJIHRvIGVhY2ggZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZm5OYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lXG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIF9lYWNoKGZuTmFtZSwgY2xhc3NOYW1lKSB7XG4gICAgX2VhY2gyLmVhY2godGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3RbZm5OYW1lXShjbGFzc05hbWUpO1xuICAgIH0pO1xufVxuXG4vKlxuICogRXhwb3J0IGludGVyZmFjZVxuICovXG5cbmV4cG9ydHMuYWRkQ2xhc3MgPSBhZGRDbGFzcztcbmV4cG9ydHMucmVtb3ZlQ2xhc3MgPSByZW1vdmVDbGFzcztcbmV4cG9ydHMudG9nZ2xlQ2xhc3MgPSB0b2dnbGVDbGFzcztcbmV4cG9ydHMuaGFzQ2xhc3MgPSBoYXNDbGFzcztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9kb210YXN0aWMvY29tbW9uanMvZG9tL2NsYXNzLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuLyoqXG4gKiBAbW9kdWxlIEV2ZW50c1xuICovXG5cbnZhciBfZWFjaCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIF9jbG9zZXN0ID0gcmVxdWlyZSgnLi4vc2VsZWN0b3IvY2xvc2VzdCcpO1xuXG4vKipcbiAqIFNob3J0aGFuZCBmb3IgYGFkZEV2ZW50TGlzdGVuZXJgLiBTdXBwb3J0cyBldmVudCBkZWxlZ2F0aW9uIGlmIGEgZmlsdGVyIChgc2VsZWN0b3JgKSBpcyBwcm92aWRlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lcyBMaXN0IG9mIHNwYWNlLXNlcGFyYXRlZCBldmVudCB0eXBlcyB0byBiZSBhZGRlZCB0byB0aGUgZWxlbWVudChzKVxuICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcl0gU2VsZWN0b3IgdG8gZmlsdGVyIGRlc2NlbmRhbnRzIHRoYXQgZGVsZWdhdGUgdGhlIGV2ZW50IHRvIHRoaXMgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgRXZlbnQgaGFuZGxlclxuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlPWZhbHNlXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5vbignY2xpY2snLCBjYWxsYmFjayk7XG4gKiAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljayBmb2N1cycsICcuaXRlbScsIGhhbmRsZXIpO1xuICovXG5cbmZ1bmN0aW9uIG9uKGV2ZW50TmFtZXMsIHNlbGVjdG9yLCBoYW5kbGVyLCB1c2VDYXB0dXJlKSB7XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICAgICAgc2VsZWN0b3IgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBwYXJ0cywgbmFtZXNwYWNlLCBldmVudExpc3RlbmVyO1xuXG4gICAgZXZlbnROYW1lcy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuXG4gICAgICAgIHBhcnRzID0gZXZlbnROYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgIGV2ZW50TmFtZSA9IHBhcnRzWzBdIHx8IG51bGw7XG4gICAgICAgIG5hbWVzcGFjZSA9IHBhcnRzWzFdIHx8IG51bGw7XG5cbiAgICAgICAgZXZlbnRMaXN0ZW5lciA9IHByb3h5SGFuZGxlcihoYW5kbGVyKTtcblxuICAgICAgICBfZWFjaC5lYWNoKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cbiAgICAgICAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgIGV2ZW50TGlzdGVuZXIgPSBkZWxlZ2F0ZUhhbmRsZXIuYmluZChlbGVtZW50LCBzZWxlY3RvciwgZXZlbnRMaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50TGlzdGVuZXIsIHVzZUNhcHR1cmUgfHwgZmFsc2UpO1xuXG4gICAgICAgICAgICBnZXRIYW5kbGVycyhlbGVtZW50KS5wdXNoKHtcbiAgICAgICAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgICAgICAgICAgICAgIGV2ZW50TGlzdGVuZXI6IGV2ZW50TGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBTaG9ydGhhbmQgZm9yIGByZW1vdmVFdmVudExpc3RlbmVyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lcyBMaXN0IG9mIHNwYWNlLXNlcGFyYXRlZCBldmVudCB0eXBlcyB0byBiZSByZW1vdmVkIGZyb20gdGhlIGVsZW1lbnQocylcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc2VsZWN0b3JdIFNlbGVjdG9yIHRvIGZpbHRlciBkZXNjZW5kYW50cyB0aGF0IHVuZGVsZWdhdGUgdGhlIGV2ZW50IHRvIHRoaXMgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgRXZlbnQgaGFuZGxlclxuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlPWZhbHNlXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5vZmYoJ2NsaWNrJywgY2FsbGJhY2spO1xuICogICAgICQoJyNteS1lbGVtZW50Jykub2ZmKCdteUV2ZW50IG15T3RoZXJFdmVudCcpO1xuICogICAgICQoJy5pdGVtJykub2ZmKCk7XG4gKi9cblxuZnVuY3Rpb24gb2ZmKF94LCBzZWxlY3RvciwgaGFuZGxlciwgdXNlQ2FwdHVyZSkge1xuICAgIHZhciBldmVudE5hbWVzID0gYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyAnJyA6IGFyZ3VtZW50c1swXTtcblxuICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaGFuZGxlciA9IHNlbGVjdG9yO1xuICAgICAgICBzZWxlY3RvciA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHBhcnRzLCBuYW1lc3BhY2UsIGhhbmRsZXJzO1xuXG4gICAgZXZlbnROYW1lcy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuXG4gICAgICAgIHBhcnRzID0gZXZlbnROYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgIGV2ZW50TmFtZSA9IHBhcnRzWzBdIHx8IG51bGw7XG4gICAgICAgIG5hbWVzcGFjZSA9IHBhcnRzWzFdIHx8IG51bGw7XG5cbiAgICAgICAgX2VhY2guZWFjaCh0aGlzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuXG4gICAgICAgICAgICBoYW5kbGVycyA9IGdldEhhbmRsZXJzKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBfZWFjaC5lYWNoKGhhbmRsZXJzLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIWV2ZW50TmFtZSB8fCBpdGVtLmV2ZW50TmFtZSA9PT0gZXZlbnROYW1lKSAmJiAoIW5hbWVzcGFjZSB8fCBpdGVtLm5hbWVzcGFjZSA9PT0gbmFtZXNwYWNlKSAmJiAoIWhhbmRsZXIgfHwgaXRlbS5oYW5kbGVyID09PSBoYW5kbGVyKSAmJiAoIXNlbGVjdG9yIHx8IGl0ZW0uc2VsZWN0b3IgPT09IHNlbGVjdG9yKTtcbiAgICAgICAgICAgIH0pLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihpdGVtLmV2ZW50TmFtZSwgaXRlbS5ldmVudExpc3RlbmVyLCB1c2VDYXB0dXJlIHx8IGZhbHNlKTtcbiAgICAgICAgICAgICAgICBoYW5kbGVycy5zcGxpY2UoaGFuZGxlcnMuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCFldmVudE5hbWUgJiYgIW5hbWVzcGFjZSAmJiAhc2VsZWN0b3IgJiYgIWhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBjbGVhckhhbmRsZXJzKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYW5kbGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjbGVhckhhbmRsZXJzKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIEdldCBldmVudCBoYW5kbGVycyBmcm9tIGFuIGVsZW1lbnRcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG52YXIgZXZlbnRLZXlQcm9wID0gJ19fZG9tdGFzdGljX2V2ZW50X18nO1xudmFyIGlkID0gMTtcbnZhciBoYW5kbGVycyA9IHt9O1xudmFyIHVudXNlZEtleXMgPSBbXTtcblxuZnVuY3Rpb24gZ2V0SGFuZGxlcnMoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudFtldmVudEtleVByb3BdKSB7XG4gICAgICAgIGVsZW1lbnRbZXZlbnRLZXlQcm9wXSA9IHVudXNlZEtleXMubGVuZ3RoID09PSAwID8gKytpZCA6IHVudXNlZEtleXMucG9wKCk7XG4gICAgfVxuICAgIHZhciBrZXkgPSBlbGVtZW50W2V2ZW50S2V5UHJvcF07XG4gICAgcmV0dXJuIGhhbmRsZXJzW2tleV0gfHwgKGhhbmRsZXJzW2tleV0gPSBbXSk7XG59XG5cbi8qKlxuICogQ2xlYXIgZXZlbnQgaGFuZGxlcnMgZm9yIGFuIGVsZW1lbnRcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gY2xlYXJIYW5kbGVycyhlbGVtZW50KSB7XG4gICAgdmFyIGtleSA9IGVsZW1lbnRbZXZlbnRLZXlQcm9wXTtcbiAgICBpZiAoaGFuZGxlcnNba2V5XSkge1xuICAgICAgICBoYW5kbGVyc1trZXldID0gbnVsbDtcbiAgICAgICAgZWxlbWVudFtrZXldID0gbnVsbDtcbiAgICAgICAgdW51c2VkS2V5cy5wdXNoKGtleSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGNyZWF0ZSBhIGhhbmRsZXIgdGhhdCBhdWdtZW50cyB0aGUgZXZlbnQgb2JqZWN0IHdpdGggc29tZSBleHRyYSBtZXRob2RzLFxuICogYW5kIGV4ZWN1dGVzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBldmVudCBhbmQgdGhlIGV2ZW50IGRhdGEgKGkuZS4gYGV2ZW50LmRldGFpbGApLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0gaGFuZGxlciBDYWxsYmFjayB0byBleGVjdXRlIGFzIGBoYW5kbGVyKGV2ZW50LCBkYXRhKWBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIHByb3h5SGFuZGxlcihoYW5kbGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXVnbWVudEV2ZW50KGV2ZW50KSwgZXZlbnQuZGV0YWlsKTtcbiAgICB9O1xufVxuXG4vKipcbiAqIEF0dGVtcHQgdG8gYXVnbWVudCBldmVudHMgYW5kIGltcGxlbWVudCBzb21ldGhpbmcgY2xvc2VyIHRvIERPTSBMZXZlbCAzIEV2ZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG52YXIgYXVnbWVudEV2ZW50ID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBtZXRob2ROYW1lLFxuICAgICAgICBldmVudE1ldGhvZHMgPSB7XG4gICAgICAgIHByZXZlbnREZWZhdWx0OiAnaXNEZWZhdWx0UHJldmVudGVkJyxcbiAgICAgICAgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOiAnaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQnLFxuICAgICAgICBzdG9wUHJvcGFnYXRpb246ICdpc1Byb3BhZ2F0aW9uU3RvcHBlZCdcbiAgICB9LFxuICAgICAgICByZXR1cm5UcnVlID0gZnVuY3Rpb24gcmV0dXJuVHJ1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAgICAgcmV0dXJuRmFsc2UgPSBmdW5jdGlvbiByZXR1cm5GYWxzZSgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkIHx8IGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiB8fCBldmVudC5zdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgIGZvciAobWV0aG9kTmFtZSBpbiBldmVudE1ldGhvZHMpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKG1ldGhvZE5hbWUsIHRlc3RNZXRob2ROYW1lLCBvcmlnaW5hbE1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudFttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbdGVzdE1ldGhvZE5hbWVdID0gcmV0dXJuVHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbE1ldGhvZCAmJiBvcmlnaW5hbE1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBldmVudFt0ZXN0TWV0aG9kTmFtZV0gPSByZXR1cm5GYWxzZTtcbiAgICAgICAgICAgICAgICB9KShtZXRob2ROYW1lLCBldmVudE1ldGhvZHNbbWV0aG9kTmFtZV0sIGV2ZW50W21ldGhvZE5hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChldmVudC5fcHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBldmVudDtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byB0ZXN0IHdoZXRoZXIgZGVsZWdhdGVkIGV2ZW50cyBtYXRjaCB0aGUgcHJvdmlkZWQgYHNlbGVjdG9yYCAoZmlsdGVyKSxcbiAqIGlmIHRoZSBldmVudCBwcm9wYWdhdGlvbiB3YXMgc3RvcHBlZCwgYW5kIHRoZW4gYWN0dWFsbHkgY2FsbCB0aGUgcHJvdmlkZWQgZXZlbnQgaGFuZGxlci5cbiAqIFVzZSBgdGhpc2AgaW5zdGVhZCBvZiBgZXZlbnQuY3VycmVudFRhcmdldGAgb24gdGhlIGV2ZW50IG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIFNlbGVjdG9yIHRvIGZpbHRlciBkZXNjZW5kYW50cyB0aGF0IHVuZGVsZWdhdGUgdGhlIGV2ZW50IHRvIHRoaXMgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgRXZlbnQgaGFuZGxlclxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqL1xuXG5mdW5jdGlvbiBkZWxlZ2F0ZUhhbmRsZXIoc2VsZWN0b3IsIGhhbmRsZXIsIGV2ZW50KSB7XG4gICAgdmFyIGV2ZW50VGFyZ2V0ID0gZXZlbnQuX3RhcmdldCB8fCBldmVudC50YXJnZXQsXG4gICAgICAgIGN1cnJlbnRUYXJnZXQgPSBfY2xvc2VzdC5jbG9zZXN0LmNhbGwoW2V2ZW50VGFyZ2V0XSwgc2VsZWN0b3IsIHRoaXMpWzBdO1xuICAgIGlmIChjdXJyZW50VGFyZ2V0ICYmIGN1cnJlbnRUYXJnZXQgIT09IHRoaXMpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRUYXJnZXQgPT09IGV2ZW50VGFyZ2V0IHx8ICEoZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQgJiYgZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSkpIHtcbiAgICAgICAgICAgIGhhbmRsZXIuY2FsbChjdXJyZW50VGFyZ2V0LCBldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciBiaW5kID0gb24sXG4gICAgdW5iaW5kID0gb2ZmO1xuXG4vKlxuICogRXhwb3J0IGludGVyZmFjZVxuICovXG5cbmV4cG9ydHMub24gPSBvbjtcbmV4cG9ydHMub2ZmID0gb2ZmO1xuZXhwb3J0cy5iaW5kID0gYmluZDtcbmV4cG9ydHMudW5iaW5kID0gdW5iaW5kO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy9ldmVudC9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbi8qKlxuICogQG1vZHVsZSBjbG9zZXN0XG4gKi9cblxudmFyIF8kJG1hdGNoZXMgPSByZXF1aXJlKCcuL2luZGV4Jyk7XG5cbnZhciBfZWFjaCR1bmlxID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG4vKipcbiAqIFJldHVybiB0aGUgY2xvc2VzdCBlbGVtZW50IG1hdGNoaW5nIHRoZSBzZWxlY3RvciAoc3RhcnRpbmcgYnkgaXRzZWxmKSBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciBGaWx0ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gSWYgcHJvdmlkZWQsIG1hdGNoaW5nIGVsZW1lbnRzIG11c3QgYmUgYSBkZXNjZW5kYW50IG9mIHRoaXMgZWxlbWVudFxuICogQHJldHVybiB7T2JqZWN0fSBOZXcgd3JhcHBlZCBjb2xsZWN0aW9uIChjb250YWluaW5nIHplcm8gb3Igb25lIGVsZW1lbnQpXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5zZWxlY3RvcicpLmNsb3Nlc3QoJy5jb250YWluZXInKTtcbiAqL1xuXG52YXIgY2xvc2VzdCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICBfZWFjaCR1bmlxLmVhY2godGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoXyQkbWF0Y2hlcy5tYXRjaGVzKG5vZGUsIHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfJCRtYXRjaGVzLiQoX2VhY2gkdW5pcS51bmlxKG5vZGVzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICFFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ID8gY2xvc2VzdCA6IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGV4dCkge1xuICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgICAgX2VhY2gkdW5pcS5lYWNoKHRoaXMsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSBub2RlLmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIGlmIChuKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLnB1c2gobik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gXyQkbWF0Y2hlcy4kKF9lYWNoJHVuaXEudW5pcShub2RlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNsb3Nlc3QuY2FsbCh0aGlzLCBzZWxlY3RvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmNsb3Nlc3QgPSBjbG9zZXN0O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy9zZWxlY3Rvci9jbG9zZXN0LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGFzc2lnbldpdGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9hc3NpZ25XaXRoJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VBc3NpZ24nKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gKiBvYmplY3QuIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqIElmIGBjdXN0b21pemVyYCBpcyBwcm92aWRlZCBpdCBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGFzc2lnbmVkIHZhbHVlcy5cbiAqIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggZml2ZSBhcmd1bWVudHM6XG4gKiAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgYmFzZWQgb25cbiAqIFtgT2JqZWN0LmFzc2lnbmBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QuYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGV4dGVuZFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5hc3NpZ24oeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDQwIH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGRlZmF1bHRzID0gXy5wYXJ0aWFsUmlnaHQoXy5hc3NpZ24sIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICogICByZXR1cm4gXy5pc1VuZGVmaW5lZCh2YWx1ZSkgPyBvdGhlciA6IHZhbHVlO1xuICogfSk7XG4gKlxuICogZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICByZXR1cm4gY3VzdG9taXplclxuICAgID8gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcilcbiAgICA6IGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL29iamVjdC9hc3NpZ24uanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmFzc2lnbmAgZm9yIGN1c3RvbWl6aW5nIGFzc2lnbmVkIHZhbHVlcyB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZywgbXVsdGlwbGUgc291cmNlcywgYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYFxuICogZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbldpdGgob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBwcm9wcyA9IGtleXMoc291cmNlKSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIodmFsdWUsIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKTtcblxuICAgIGlmICgocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkgfHxcbiAgICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbldpdGg7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvYXNzaWduV2l0aC5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvZ2V0TmF0aXZlJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpLFxuICAgIHNoaW1LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvc2hpbUtleXMnKTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbnZhciBrZXlzID0gIW5hdGl2ZUtleXMgPyBzaGltS2V5cyA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgQ3RvciA9IG9iamVjdCA9PSBudWxsID8gbnVsbCA6IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QpIHx8XG4gICAgICAodHlwZW9mIG9iamVjdCAhPSAnZnVuY3Rpb24nICYmIGlzQXJyYXlMaWtlKG9iamVjdCkpKSB7XG4gICAgcmV0dXJuIHNoaW1LZXlzKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgPyBuYXRpdmVLZXlzKG9iamVjdCkgOiBbXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9vYmplY3Qva2V5cy5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNOYXRpdmUgPSByZXF1aXJlKCcuLi9sYW5nL2lzTmF0aXZlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICByZXR1cm4gaXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2dldE5hdGl2ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgZXNjYXBlUmVnRXhwID0gcmVxdWlyZSgnLi4vc3RyaW5nL2VzY2FwZVJlZ0V4cCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGVzY2FwZVJlZ0V4cChmblRvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAob2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZykge1xuICAgIHJldHVybiByZUlzTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVJc0hvc3RDdG9yLnRlc3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmF0aXZlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2xhbmcvaXNOYXRpdmUuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VUb1N0cmluZycpO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgW3NwZWNpYWwgY2hhcmFjdGVyc10oaHR0cDovL3d3dy5yZWd1bGFyLWV4cHJlc3Npb25zLmluZm8vY2hhcmFjdGVycy5odG1sI3NwZWNpYWwpLlxuICogSW4gYWRkaXRpb24gdG8gc3BlY2lhbCBjaGFyYWN0ZXJzIHRoZSBmb3J3YXJkIHNsYXNoIGlzIGVzY2FwZWQgdG8gYWxsb3cgZm9yXG4gKiBlYXNpZXIgYGV2YWxgIHVzZSBhbmQgYEZ1bmN0aW9uYCBjb21waWxhdGlvbi5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhcnMgPSAvWy4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2csXG4gICAgcmVIYXNSZWdFeHBDaGFycyA9IFJlZ0V4cChyZVJlZ0V4cENoYXJzLnNvdXJjZSk7XG5cbi8qKlxuICogRXNjYXBlcyB0aGUgYFJlZ0V4cGAgc3BlY2lhbCBjaGFyYWN0ZXJzIFwiXFxcIiwgXCIvXCIsIFwiXlwiLCBcIiRcIiwgXCIuXCIsIFwifFwiLCBcIj9cIixcbiAqIFwiKlwiLCBcIitcIiwgXCIoXCIsIFwiKVwiLCBcIltcIiwgXCJdXCIsIFwie1wiIGFuZCBcIn1cIiBpbiBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZXNjYXBlUmVnRXhwKCdbbG9kYXNoXShodHRwczovL2xvZGFzaC5jb20vKScpO1xuICogLy8gPT4gJ1xcW2xvZGFzaFxcXVxcKGh0dHBzOlxcL1xcL2xvZGFzaFxcLmNvbVxcL1xcKSdcbiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICBzdHJpbmcgPSBiYXNlVG9TdHJpbmcoc3RyaW5nKTtcbiAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNSZWdFeHBDaGFycy50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVJlZ0V4cENoYXJzLCAnXFxcXCQmJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlc2NhcGVSZWdFeHA7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvc3RyaW5nL2VzY2FwZVJlZ0V4cC5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQncyBub3Qgb25lLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWRcbiAqIGZvciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUb1N0cmluZztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9iYXNlVG9TdHJpbmcuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9pc09iamVjdExpa2UuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vZ2V0TGVuZ3RoJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2lzQXJyYXlMaWtlLmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL2Jhc2VQcm9wZXJ0eScpO1xuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldExlbmd0aDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvYmFzZVByb3BlcnR5LmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9pc0xlbmd0aC5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2xhbmcvaXNPYmplY3QuanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIG9mIGBPYmplY3Qua2V5c2Agd2hpY2ggY3JlYXRlcyBhbiBhcnJheSBvZiB0aGVcbiAqIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBzaGltS2V5cyhvYmplY3QpIHtcbiAgdmFyIHByb3BzID0ga2V5c0luKG9iamVjdCksXG4gICAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IHByb3BzTGVuZ3RoICYmIG9iamVjdC5sZW5ndGg7XG5cbiAgdmFyIGFsbG93SW5kZXhlcyA9ICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBwcm9wc0xlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgaWYgKChhbGxvd0luZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpIHx8IGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoaW1LZXlzO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL3NoaW1LZXlzLmpzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9sYW5nL2lzQXJndW1lbnRzLmpzXG4gKiogbW9kdWxlIGlkID0gMjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0FycmF5ID0gZ2V0TmF0aXZlKEFycmF5LCAnaXNBcnJheScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFycmF5VGFnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2xhbmcvaXNBcnJheS5qc1xuICoqIG1vZHVsZSBpZCA9IDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXlxcZCskLztcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvaXNJbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDtcbiAgbGVuZ3RoID0gKGxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKSAmJiBsZW5ndGgpIHx8IDA7XG5cbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgaXNQcm90byA9IHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUgPT09IG9iamVjdCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCksXG4gICAgICBza2lwSW5kZXhlcyA9IGxlbmd0aCA+IDA7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gKGluZGV4ICsgJycpO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShza2lwSW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgJiZcbiAgICAgICAgIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvb2JqZWN0L2tleXNJbi5qc1xuICoqIG1vZHVsZSBpZCA9IDI2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgYmFzZUNvcHkgPSByZXF1aXJlKCcuL2Jhc2VDb3B5JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLFxuICogbXVsdGlwbGUgc291cmNlcywgYW5kIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBzb3VyY2UgPT0gbnVsbFxuICAgID8gb2JqZWN0XG4gICAgOiBiYXNlQ29weShzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2Jhc2VBc3NpZ24uanNcbiAqKiBtb2R1bGUgaWQgPSAyN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQ29weShzb3VyY2UsIHByb3BzLCBvYmplY3QpIHtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgIG9iamVjdFtrZXldID0gc291cmNlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ29weTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9iYXNlQ29weS5qc1xuICoqIG1vZHVsZSBpZCA9IDI4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgYmluZENhbGxiYWNrID0gcmVxdWlyZSgnLi9iaW5kQ2FsbGJhY2snKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vaXNJdGVyYXRlZUNhbGwnKSxcbiAgICByZXN0UGFyYW0gPSByZXF1aXJlKCcuLi9mdW5jdGlvbi9yZXN0UGFyYW0nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBhc3NpZ25zIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byBhIGdpdmVuXG4gKiBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBjcmVhdGUgYF8uYXNzaWduYCwgYF8uZGVmYXVsdHNgLCBhbmQgYF8ubWVyZ2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gcmVzdFBhcmFtKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPT0gbnVsbCA/IDAgOiBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzW2xlbmd0aCAtIDJdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkLFxuICAgICAgICB0aGlzQXJnID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY3VzdG9taXplciA9IGJpbmRDYWxsYmFjayhjdXN0b21pemVyLCB0aGlzQXJnLCA1KTtcbiAgICAgIGxlbmd0aCAtPSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXN0b21pemVyID0gdHlwZW9mIHRoaXNBcmcgPT0gJ2Z1bmN0aW9uJyA/IHRoaXNBcmcgOiB1bmRlZmluZWQ7XG4gICAgICBsZW5ndGggLT0gKGN1c3RvbWl6ZXIgPyAxIDogMCk7XG4gICAgfVxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXNzaWduZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlQXNzaWduZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9pZGVudGl0eScpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUNhbGxiYWNrYCB3aGljaCBvbmx5IHN1cHBvcnRzIGB0aGlzYCBiaW5kaW5nXG4gKiBhbmQgc3BlY2lmeWluZyB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYmluZC5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcmdDb3VudF0gVGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBiaW5kQ2FsbGJhY2soZnVuYywgdGhpc0FyZywgYXJnQ291bnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHRoaXNBcmcgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmdW5jO1xuICB9XG4gIHN3aXRjaCAoYXJnQ291bnQpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSk7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfTtcbiAgICBjYXNlIDU6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIG90aGVyLCBrZXksIG9iamVjdCwgc291cmNlKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbmRDYWxsYmFjaztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9iaW5kQ2FsbGJhY2suanNcbiAqKiBtb2R1bGUgaWQgPSAzMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBwcm92aWRlZCB0byBpdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiBfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL3V0aWxpdHkvaWRlbnRpdHkuanNcbiAqKiBtb2R1bGUgaWQgPSAzMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdCkpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9pc0l0ZXJhdGVlQ2FsbC5qc1xuICoqIG1vZHVsZSBpZCA9IDMyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGVcbiAqIGNyZWF0ZWQgZnVuY3Rpb24gYW5kIGFyZ3VtZW50cyBmcm9tIGBzdGFydGAgYW5kIGJleW9uZCBwcm92aWRlZCBhcyBhbiBhcnJheS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24gdGhlIFtyZXN0IHBhcmFtZXRlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvRnVuY3Rpb25zL3Jlc3RfcGFyYW1ldGVycykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2F5ID0gXy5yZXN0UGFyYW0oZnVuY3Rpb24od2hhdCwgbmFtZXMpIHtcbiAqICAgcmV0dXJuIHdoYXQgKyAnICcgKyBfLmluaXRpYWwobmFtZXMpLmpvaW4oJywgJykgK1xuICogICAgIChfLnNpemUobmFtZXMpID4gMSA/ICcsICYgJyA6ICcnKSArIF8ubGFzdChuYW1lcyk7XG4gKiB9KTtcbiAqXG4gKiBzYXkoJ2hlbGxvJywgJ2ZyZWQnLCAnYmFybmV5JywgJ3BlYmJsZXMnKTtcbiAqIC8vID0+ICdoZWxsbyBmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gcmVzdFBhcmFtKGZ1bmMsIHN0YXJ0KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6ICgrc3RhcnQgfHwgMCksIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgcmVzdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdFtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHN0YXJ0KSB7XG4gICAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpcywgcmVzdCk7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgcmVzdCk7XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSwgcmVzdCk7XG4gICAgfVxuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIGluZGV4ID0gLTE7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gcmVzdDtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc3RQYXJhbTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9mdW5jdGlvbi9yZXN0UGFyYW0uanNcbiAqKiBtb2R1bGUgaWQgPSAzM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==