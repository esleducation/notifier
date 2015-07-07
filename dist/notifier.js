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
	          return _this.remove(notification.id);
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
	
	  Notifier.prototype.remove = function(id) {
	    if (this.queue[id]) {
	      this.queue[id].remove();
	      delete this.queue[id];
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
	  remove: NotifierInstance.remove.bind(NotifierInstance),
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

	/**
	 * @module Selector
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
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
	    (0, _util.each)(this, function (node) {
	        (0, _util.each)(querySelector(selector, node), function (child) {
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
	    var context = typeof Element !== 'undefined' ? Element.prototype : _util.global,
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
/***/ function(module, exports) {

	/*
	 * @module Util
	 */
	
	/*
	 * Reference to the global scope
	 * @private
	 */
	
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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

	/**
	 * @module DOM
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
	var _selectorIndex = __webpack_require__(2);
	
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
	                var elements = element instanceof NodeList ? (0, _util.toArray)(element) : element;
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
	                var elements = element instanceof NodeList ? (0, _util.toArray)(element) : element;
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
	                var elements = element instanceof NodeList ? (0, _util.toArray)(element) : element;
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
	                var elements = element instanceof NodeList ? (0, _util.toArray)(element) : element;
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
	    return (0, _selectorIndex.$)(_clone(this));
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

	/**
	 * @module DOM (extra)
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
	var _index = __webpack_require__(4);
	
	var _selectorIndex = __webpack_require__(2);
	
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
	    var context = typeof element === 'string' ? (0, _selectorIndex.$)(element) : element;
	    _index.append.call(context, this);
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
	    return (0, _util.each)(this, function (element) {
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
	    return (0, _util.each)(this, function (element) {
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
	    return _index.before.apply(this, arguments).remove();
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
	
	    (0, _util.each)(this, function (element) {
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
	
	    (0, _util.each)(this, function (element) {
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

	/**
	 * @module Class
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
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
	        (0, _util.each)(value.split(' '), _each.bind(this, 'add'));
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
	        (0, _util.each)(value.split(' '), _each.bind(this, 'remove'));
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
	        (0, _util.each)(value.split(' '), _each.bind(this, 'toggle'));
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
	    (0, _util.each)(this, function (element) {
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

	/**
	 * @module Events
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
	var _selectorClosest = __webpack_require__(8);
	
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
	
	        (0, _util.each)(this, function (element) {
	
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
	
	function off(eventNames, selector, handler, useCapture) {
	    if (eventNames === undefined) eventNames = '';
	
	    if (typeof selector === 'function') {
	        handler = selector;
	        selector = null;
	    }
	
	    var parts, namespace, handlers;
	
	    eventNames.split(' ').forEach(function (eventName) {
	
	        parts = eventName.split('.');
	        eventName = parts[0] || null;
	        namespace = parts[1] || null;
	
	        (0, _util.each)(this, function (element) {
	
	            handlers = getHandlers(element);
	
	            (0, _util.each)(handlers.filter(function (item) {
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
	        currentTarget = _selectorClosest.closest.call([eventTarget], selector, this)[0];
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

	/**
	 * @module closest
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _index = __webpack_require__(2);
	
	var _util = __webpack_require__(3);
	
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
	        (0, _util.each)(this, function (node) {
	            while (node && node !== context) {
	                if ((0, _index.matches)(node, selector)) {
	                    nodes.push(node);
	                    break;
	                }
	                node = node.parentElement;
	            }
	        });
	        return (0, _index.$)((0, _util.uniq)(nodes));
	    }
	
	    return !Element.prototype.closest ? closest : function (selector, context) {
	        if (!context) {
	            var nodes = [];
	            (0, _util.each)(this, function (node) {
	                var n = node.closest(selector);
	                if (n) {
	                    nodes.push(n);
	                }
	            });
	            return (0, _index.$)((0, _util.uniq)(nodes));
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
	    baseAssign = __webpack_require__(26),
	    createAssigner = __webpack_require__(28);
	
	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it is invoked to produce the assigned values.
	 * The `customizer` is bound to `thisArg` and invoked with five arguments:
	 * (objectValue, sourceValue, key, object, source).
	 *
	 * **Note:** This method mutates `object` and is based on
	 * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
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
	    isObject = __webpack_require__(15),
	    shimKeys = __webpack_require__(21);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
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
	  var Ctor = object == null ? undefined : object.constructor;
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

	var isFunction = __webpack_require__(14),
	    isObjectLike = __webpack_require__(16);
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
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
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = isNative;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(15);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 15 */
/***/ function(module, exports) {

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
/* 16 */
/***/ function(module, exports) {

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
/***/ function(module, exports) {

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
/***/ function(module, exports) {

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
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

	var isArguments = __webpack_require__(22),
	    isArray = __webpack_require__(23),
	    isIndex = __webpack_require__(24),
	    isLength = __webpack_require__(20),
	    keysIn = __webpack_require__(25);
	
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

	var isArrayLike = __webpack_require__(17),
	    isObjectLike = __webpack_require__(16);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
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
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}
	
	module.exports = isArguments;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(12),
	    isLength = __webpack_require__(20),
	    isObjectLike = __webpack_require__(16);
	
	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
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
/* 24 */
/***/ function(module, exports) {

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(22),
	    isArray = __webpack_require__(23),
	    isIndex = __webpack_require__(24),
	    isLength = __webpack_require__(20),
	    isObject = __webpack_require__(15);
	
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var baseCopy = __webpack_require__(27),
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
/* 27 */
/***/ function(module, exports) {

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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var bindCallback = __webpack_require__(29),
	    isIterateeCall = __webpack_require__(31),
	    restParam = __webpack_require__(32);
	
	/**
	 * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(30);
	
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
/* 30 */
/***/ function(module, exports) {

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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(17),
	    isIndex = __webpack_require__(24),
	    isObject = __webpack_require__(15);
	
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
/* 32 */
/***/ function(module, exports) {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxM2M2MTVjMzUwZmI2NTQxNjdlZSIsIndlYnBhY2s6Ly8vLi9zcmMvbm90aWZpZXIuY29mZmVlIiwid2VicGFjazovLy8uL3NyYy9kb210YXN0aWMtc3Vic2V0LmNvZmZlZSIsIndlYnBhY2s6Ly8vLi9+L2RvbXRhc3RpYy9jb21tb25qcy9zZWxlY3Rvci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2RvbXRhc3RpYy9jb21tb25qcy91dGlsLmpzIiwid2VicGFjazovLy8uL34vZG9tdGFzdGljL2NvbW1vbmpzL2RvbS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2RvbXRhc3RpYy9jb21tb25qcy9kb20vZXh0cmEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9kb210YXN0aWMvY29tbW9uanMvZG9tL2NsYXNzLmpzIiwid2VicGFjazovLy8uL34vZG9tdGFzdGljL2NvbW1vbmpzL2V2ZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL34vZG9tdGFzdGljL2NvbW1vbmpzL3NlbGVjdG9yL2Nsb3Nlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvb2JqZWN0L2Fzc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9hc3NpZ25XaXRoLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL29iamVjdC9rZXlzLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9sYW5nL2lzTmF0aXZlLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2xhbmcvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9sYW5nL2lzT2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2lzT2JqZWN0TGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9pc0FycmF5TGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaW50ZXJuYWwvYmFzZVByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2lzTGVuZ3RoLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL3NoaW1LZXlzLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2xhbmcvaXNBcmd1bWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvbGFuZy9pc0FycmF5LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2lzSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvb2JqZWN0L2tleXNJbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pbnRlcm5hbC9iYXNlQXNzaWduLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2Jhc2VDb3B5LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2JpbmRDYWxsYmFjay5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC91dGlsaXR5L2lkZW50aXR5LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL2Z1bmN0aW9uL3Jlc3RQYXJhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVB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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLEVBQUU7QUFDYixZQUFXLEVBQUU7QUFDYixZQUFXLEVBQUU7QUFDYixjQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzNCQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLFlBQVcsT0FBTztBQUNsQixjQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoibm90aWZpZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk5vdGlmaWVyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk5vdGlmaWVyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAxM2M2MTVjMzUwZmI2NTQxNjdlZVxuICoqLyIsIiQgICAgICAgPSByZXF1aXJlICcuL2RvbXRhc3RpYy1zdWJzZXQuY29mZmVlJ1xuYXNzaWduICA9IHJlcXVpcmUgJ2xvZGFzaC9vYmplY3QvYXNzaWduJ1xuXG5cbiMjI1xuIyBTb21lIHNldHRpbmdzXG4jIyNcbmJlbVdyYXBwZXIgPSAnZWVnbm90aWZzJ1xuYmVtSXRlbSAgICA9ICdlZWdub3RpZidcblxuXG4jIyNcbiMgbWluaW1hbCBVVUlEXG4jIyNcbl91dWlkID0gMDsgdXVpZCA9IC0+ICsrX3V1aWRcblxuXG4jIyNcbiMgTm90aWZpY2F0aW9uIHR5cGVcbiMjI1xuTm90aWZpY2F0aW9uVHlwZSA9XG5cdElORk8gICAgOiAnaW5mbydcblx0U1VDQ0VTUyA6ICdzdWNjZXNzJ1xuXHRXQVJOICAgIDogJ3dhcm4nXG5cdEVSUk9SICAgOiAnZXJyb3InXG5cdERFQlVHICAgOiAnZGVidWcnXG5cdENVU1RPTSAgOiAnY3VzdG9tJ1xuXG5BY3Rpb25UeXBlID1cblx0REVGQVVMVCA6ICdkZWZhdWx0J1xuXHRQUklNQVJZIDogJ3ByaW1hcnknXG5cdERBTkdFUiAgOiAnZGFuZ2VyJ1xuXHRDVVNUT00gIDogJ2N1c3RvbSdcblxuXG4jIyNcbiMgTm90aWZpY2F0aW9uIGNsYXNzXG4jIyNcbmNsYXNzIEFuaW1hdG9yXG5cblx0VElDSyA6IDE3XG5cblx0b3B0aW9ucyA6XG5cdFx0ZHVyYXRpb24gOiAyMDBcblx0XHRhbmltYXRpb24gOiAnbm90aWZpY2F0aW9uJ1xuXG5cdGNvbnN0cnVjdG9yIDogKERPTU5vZGUsIG9wdGlvbnMgPSB7fSkgLT5cblx0XHQjIFNldCBvcHRpb25zXG5cdFx0YXNzaWduIEBvcHRpb25zLCBvcHRpb25zXG5cblx0XHRARE9NTm9kZSA9IERPTU5vZGVcblx0XHRAY2xhc3NOYW1lUXVldWUgPSBbXVxuXHRcdEB0aW1lb3V0ID0gbnVsbFxuXG5cdFx0cmV0dXJuXG5cblx0dHJhbnNpdGlvbiA6IChhbmltYXRpb25UeXBlLCBmaW5pc2hDYWxsYmFjaykgLT5cblx0XHRjbGFzc05hbWUgICAgICAgPSBcIiN7QG9wdGlvbnMuYW5pbWF0aW9ufS0je2FuaW1hdGlvblR5cGV9XCJcblx0XHRhY3RpdmVDbGFzc05hbWUgPSBcIiN7Y2xhc3NOYW1lfS1hY3RpdmVcIlxuXHRcdEBET01Ob2RlLmFkZENsYXNzIGNsYXNzTmFtZVxuXHRcdEBxdWV1ZUNsYXNzIGFjdGl2ZUNsYXNzTmFtZVxuXG5cdFx0c2V0VGltZW91dCA9PlxuXHRcdFx0QERPTU5vZGUucmVtb3ZlQ2xhc3MgXCIje2NsYXNzTmFtZX0gI3thY3RpdmVDbGFzc05hbWV9XCJcblx0XHRcdGZpbmlzaENhbGxiYWNrKCkgaWYgZmluaXNoQ2FsbGJhY2s/XG5cdFx0LCBAb3B0aW9ucy5kdXJhdGlvblxuXG5cdHF1ZXVlQ2xhc3MgOiAoY2xhc3NOYW1lKSAtPlxuXHRcdEBjbGFzc05hbWVRdWV1ZS5wdXNoIGNsYXNzTmFtZVxuXG5cdFx0aWYgISBAdGltZW91dFxuXHRcdFx0QHRpbWVvdXQgPSBzZXRUaW1lb3V0IEBmbHVzaENsYXNzTmFtZVF1ZXVlLmJpbmQoQCksIEBUSUNLXG5cblx0XHRyZXR1cm5cblxuXHRmbHVzaENsYXNzTmFtZVF1ZXVlIDogLT5cblx0XHRmb3IgY2xhc3NOYW1lIGluIEBjbGFzc05hbWVRdWV1ZVxuXHRcdFx0QERPTU5vZGUuYWRkQ2xhc3MgY2xhc3NOYW1lXG5cblx0XHRAY2xhc3NOYW1lUXVldWUubGVuZ3RoID0gMFxuXHRcdEB0aW1lb3V0ID0gbnVsbFxuXG5cdFx0cmV0dXJuXG5cblxuIyMjXG4jIE5vdGlmaWNhdGlvbiBjbGFzc1xuIyMjXG5jbGFzcyBOb3RpZmljYXRpb25cblxuXHRkZWZhdWx0cyA6XG5cdFx0YWN0aW9ucyAgICAgIDogW11cblx0XHRjbG9zZU9uQ2xpY2sgOiBmYWxzZSAgICAgICAgICAgICAgICAgICMgTk9UIElNUExFTUVOVEVEXG5cdFx0ZGVsYXkgICAgICAgIDogMFxuXHRcdGR1cmF0aW9uICAgICA6IDZcblx0XHRpY29uICAgICAgICAgOiB0cnVlICAgICAgICAgICAgICAgICAgICMgKGZvbnQgaWNvbiAoL2Jhc2U2NC9pbWcgdXJsKVxuXHRcdG1vZGFsICAgICAgICA6IGZhbHNlXG5cdFx0dGVtcGxhdGUgICAgIDogJ2RlZmF1bHQnXG5cdFx0dGV4dCAgICAgICAgIDogJ0hlbGxvIHdvcmxkICEnXG5cdFx0dHlwZSAgICAgICAgIDogTm90aWZpY2F0aW9uVHlwZS5JTkZPXG5cdFx0b25TaG93ICAgICAgIDogbnVsbFxuXHRcdG9uUmVtb3ZlICAgICA6IG51bGxcblxuXG5cdGFjdGlvbkRlZmF1bHRzIDpcblx0XHRjbGFzc05hbWUgOiAnJ1xuXHRcdGZuICAgICAgICA6ID0+IEByZW1vdmUoKVxuXHRcdGxhYmVsICAgICA6ICdCdXR0b24nXG5cdFx0dHlwZSAgICAgIDogQWN0aW9uVHlwZS5ERUZBVUxUXG5cblxuXHRjb25zdHJ1Y3RvcjogKHBhcmFtcykgLT5cblx0XHRARE9NTm9kZSA9IG51bGxcblxuXHRcdGFzc2lnbiBALCBAZGVmYXVsdHMsIHBhcmFtcywgaWQgOiB1dWlkKClcblxuXG5cdF9jb25zdHJ1Y3RET01Ob2RlOiAtPlxuXHRcdGNsYXNzZXMgPSBbXG5cdFx0XHRiZW1JdGVtLFxuXHRcdFx0XCIje2JlbUl0ZW19LS0je0B0eXBlfVwiXG5cdFx0XVxuXG5cdFx0Y2xhc3Nlcy5wdXNoIFwiI3tiZW1JdGVtfS0taWNvblwiIGlmIEBpY29uXG5cdFx0Y2xhc3Nlcy5wdXNoIFwiI3tiZW1JdGVtfS0tbW9kYWxcIiBpZiBAbW9kYWxcblxuXHRcdEBET01Ob2RlID0gJCBcIlxuXHRcdFx0PGRpdiBjbGFzcz0nI3tjbGFzc2VzLmpvaW4oJyAnKX0nIGlkPScje2JlbUl0ZW19LS0je0BpZH0nPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPScje2JlbUl0ZW19X19jb250ZW50Jz4je0B0ZXh0fTwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XCJcblxuXHRcdEBfc2V0QWN0aW9ucygpXG5cdFx0QF9zZXRDb250cm9scygpXG5cblx0XHRyZXR1cm4gQERPTU5vZGVcblxuXG5cdF9zZXRDb250cm9sczogLT5cblx0XHRpZiBub3QgQG1vZGFsXG5cdFx0XHQjIENsb3NlIGNvbnRyb2xcblx0XHRcdCQoXCI8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9JyN7YmVtSXRlbX1fX2NvbnRyb2wtLWNsb3NlJz48aSBjbGFzcz0naWNvbi1jbG9zZS1jaXJjbGUnIC8+PC9idXR0b24+XCIpXG5cdFx0XHRcdC5vbiAnY2xpY2snLCAoZSkgPT4gQHJlbW92ZSgpXG5cdFx0XHRcdC5hcHBlbmRUbyBARE9NTm9kZVxuXG5cdFx0cmV0dXJuXG5cblxuXHRfc2V0QWN0aW9uczogLT5cblx0XHRpZiBAYWN0aW9ucy5sZW5ndGhcblx0XHRcdGFjdGlvbnMgPSAkKFwiPGRpdiBjbGFzcz0nI3tiZW1JdGVtfV9fYWN0aW9ucycgLz5cIikuYXBwZW5kVG8gQERPTU5vZGVcblxuXHRcdFx0Zm9yIGFjdGlvbiBpbiBAYWN0aW9uc1xuXHRcdFx0XHRkbyAoYWN0aW9uKSA9PlxuXHRcdFx0XHRcdCMgU2V0IGRlZmF1bHQgYWN0aW9uIHBhcmFtc1xuXHRcdFx0XHRcdGFjdGlvbiA9IGFzc2lnbiB7fSwgQGFjdGlvbkRlZmF1bHRzLCBhY3Rpb25cblxuXHRcdFx0XHRcdCQoXCI8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9JyN7YmVtSXRlbX1fX2FjdGlvbiAje2JlbUl0ZW19X19hY3Rpb24tLSN7YWN0aW9uLnR5cGV9ICN7YWN0aW9uLmNsYXNzTmFtZX0nPiN7YWN0aW9uLmxhYmVsfTwvYnV0dG9uPlwiKVxuXHRcdFx0XHRcdFx0Lm9uICdjbGljaycsIChlKSA9PiBhY3Rpb24uZm4uYXBwbHkgQCwgZVxuXHRcdFx0XHRcdFx0LmFwcGVuZFRvIGFjdGlvbnNcblxuXG5cdF9nZXRBbmltYXRvcjogLT5cblx0XHRyZXR1cm4gQERPTUFuaW1hdG9yIGlmIEBET01BbmltYXRvcj9cblxuXHRcdEBET01BbmltYXRvciA9IG5ldyBBbmltYXRvciBAZ2V0RE9NTm9kZSgpXG5cblx0XHRyZXR1cm4gQERPTUFuaW1hdG9yXG5cblxuXHRnZXRET01Ob2RlOiAtPiBpZiBARE9NTm9kZT8gdGhlbiBARE9NTm9kZSBlbHNlIEBfY29uc3RydWN0RE9NTm9kZSgpXG5cblxuXHRzaG93SW46ICh0YXJnZXQsIGZpbmlzaENhbGxiYWNrKSAtPlxuXHRcdEBnZXRET01Ob2RlKCkuYXBwZW5kVG8gdGFyZ2V0XG5cdFx0QF9nZXRBbmltYXRvcigpLnRyYW5zaXRpb24gJ2VudGVyJywgPT5cblx0XHRcdGZpbmlzaENhbGxiYWNrLmFwcGx5IEAgaWYgZmluaXNoQ2FsbGJhY2s/XG5cdFx0XHRAb25TaG93LmFwcGx5IEAgaWYgQG9uU2hvdz9cblxuXG5cdHJlbW92ZTogKGZpbmlzaENhbGxiYWNrKSAtPlxuXHRcdEBfZ2V0QW5pbWF0b3IoKS50cmFuc2l0aW9uICdsZWF2ZScsID0+XG5cdFx0XHRmaW5pc2hDYWxsYmFjay5hcHBseSBAIGlmIGZpbmlzaENhbGxiYWNrP1xuXHRcdFx0QG9uUmVtb3ZlLmFwcGx5IEAgaWYgQG9uUmVtb3ZlP1xuXHRcdFx0QGdldERPTU5vZGUoKS5yZW1vdmUoKVxuXG4jIyNcbiMgTm90aWZpZXIgY2xhc3NcbiMjI1xuY2xhc3MgTm90aWZpZXJcblxuXHRcdGNvbnN0cnVjdG9yOiAtPlxuXHRcdFx0IyBBZGQgbm90aWZpY2F0aW9ucyB3cmFwcGVyIHRvIGRvY3VtZW50XG5cdFx0XHRAd3JhcHBlciA9ICQoXCI8ZGl2IGNsYXNzPScje2JlbVdyYXBwZXJ9Jz48L2Rpdj5cIikuYXBwZW5kVG8gZG9jdW1lbnQuYm9keVxuXG5cdFx0XHQjIFByZXBhcmUgZW1wdHkgcXVldWVcblx0XHRcdEBxdWV1ZSA9IHt9XG5cblx0XHRcdHJldHVyblxuXG5cblx0XHRzZW5kOiAocGFyYW1zKSAtPlxuXHRcdFx0IyBIYW5kbGUgc2ltcGxlIG1lc3NhZ2UgZm9ybVxuXHRcdFx0aWYgdHlwZW9mIHBhcmFtcyBpcyAnc3RyaW5nJ1xuXHRcdFx0XHRwYXJhbXMgPSB0ZXh0IDogcGFyYW1zXG5cblx0XHRcdCMgQ3JlYXRlIGEgbm90aWZpY2F0aW9uXG5cdFx0XHRub3RpZmljYXRpb24gPSBuZXcgTm90aWZpY2F0aW9uIHBhcmFtc1xuXG5cdFx0XHQjIEtlZXAgbm90aWZpY2F0aW9uXG5cdFx0XHRpZCA9IEByZWdpc3RlciBub3RpZmljYXRpb25cblxuXHRcdFx0IyBTaG93IG5vdGlmXG5cdFx0XHRub3RpZmljYXRpb24uZGVsYXlUaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuXHRcdFx0XHRAc2hvdyBub3RpZmljYXRpb25cblx0XHRcdCwgbm90aWZpY2F0aW9uLmRlbGF5ICogMTAwMFxuXG5cdFx0XHQjIFNlbmQgYmFjayBpZCBmb3IgY2FuY2VsbGF0aW9uXG5cdFx0XHRyZXR1cm4gaWRcblxuXG5cdFx0Y2FuY2VsOiAoaWQpIC0+XG5cdFx0XHRpZiBAcXVldWVbaWRdXG5cdFx0XHRcdGNsZWFyVGltZW91dCBAcXVldWVbaWRdLmRlbGF5VGltZW91dFxuXHRcdFx0XHRkZWxldGUgQHF1ZXVlW2lkXVxuXHRcdFx0XHR0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZhbHNlXG5cblxuXHRcdHJlZ2lzdGVyOiAobm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0QHF1ZXVlW25vdGlmaWNhdGlvbi5pZF0gPSBub3RpZmljYXRpb25cblxuXHRcdFx0cmV0dXJuIG5vdGlmaWNhdGlvbi5pZFxuXG5cblx0XHRzaG93OiAobm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0bm90aWZpY2F0aW9uLnNob3dJbiBAd3JhcHBlclxuXG5cdFx0XHQjIFNhdmUgcmVtb3ZlIGV2ZW50XG5cdFx0XHRpZiBub3RpZmljYXRpb24uZHVyYXRpb24gPiAtMVxuXHRcdFx0XHRub3RpZmljYXRpb24uZGlzcGxheVRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG5cdFx0XHRcdFx0QHJlbW92ZSBub3RpZmljYXRpb24uaWRcblx0XHRcdFx0LCBub3RpZmljYXRpb24uZHVyYXRpb24gKiAxMDAwXG5cblx0XHRcdHJldHVyblxuXG5cdFx0Y2xlYXJBbGw6IChpbmNsdWRlRGVsYXllZCA9IGZhbHNlKSAtPlxuXHRcdFx0Zm9yIGlkLCBub3RpZmljYXRpb24gb2YgQHF1ZXVlXG5cdFx0XHRcdEBjYW5jZWwgaWQgaWYgaW5jbHVkZURlbGF5ZWRcblx0XHRcdFx0bm90aWZpY2F0aW9uLnJlbW92ZSgpXG5cdFx0XHRcdGRlbGV0ZSBAcXVldWVbbm90aWZpY2F0aW9uLmlkXSBpZiBAcXVldWVbbm90aWZpY2F0aW9uLmlkXVxuXG5cblxuXHRcdHJlbW92ZTogKGlkKSAtPlxuXHRcdFx0aWYgQHF1ZXVlW2lkXVxuXHRcdFx0XHRAcXVldWVbaWRdLnJlbW92ZSgpXG5cdFx0XHRcdGRlbGV0ZSBAcXVldWVbaWRdXG5cblx0XHRcdHJldHVyblxuXG5cbk5vdGlmaWVySW5zdGFuY2UgPSBuZXcgTm90aWZpZXJcblxuXG4jIFJldHVybiBhbiBpbnN0YW5jZSBvZiB0aGUgbm90aWZpZXIgc2VydmljZVxubW9kdWxlLmV4cG9ydHMgPVxuXHRhY3Rpb25UeXBlICAgOiBBY3Rpb25UeXBlXG5cdHNlbmQgICAgICAgICA6IE5vdGlmaWVySW5zdGFuY2Uuc2VuZC5iaW5kIE5vdGlmaWVySW5zdGFuY2Vcblx0Y2xlYXJBbGwgICAgIDogTm90aWZpZXJJbnN0YW5jZS5jbGVhckFsbC5iaW5kIE5vdGlmaWVySW5zdGFuY2Vcblx0Y2FuY2VsICAgICAgIDogTm90aWZpZXJJbnN0YW5jZS5jYW5jZWwuYmluZCBOb3RpZmllckluc3RhbmNlXG5cdHJlbW92ZSAgICAgICA6IE5vdGlmaWVySW5zdGFuY2UucmVtb3ZlLmJpbmQgTm90aWZpZXJJbnN0YW5jZVxuXHR0eXBlICAgICAgICAgOiBOb3RpZmljYXRpb25UeXBlXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9ub3RpZmllci5jb2ZmZWVcbiAqKi8iLCJzZWxlY3RvciA9IHJlcXVpcmUgJ2RvbXRhc3RpYy9jb21tb25qcy9zZWxlY3RvcidcbmRvbSAgICAgID0gcmVxdWlyZSAnZG9tdGFzdGljL2NvbW1vbmpzL2RvbSdcbmRvbUV4dHJhID0gcmVxdWlyZSAnZG9tdGFzdGljL2NvbW1vbmpzL2RvbS9leHRyYSdcbmRvbUNsYXNzID0gcmVxdWlyZSAnZG9tdGFzdGljL2NvbW1vbmpzL2RvbS9jbGFzcydcbmV2ZW50ICAgID0gcmVxdWlyZSAnZG9tdGFzdGljL2NvbW1vbmpzL2V2ZW50J1xuXG4kICAgICAgICAgICAgICAgID0gc2VsZWN0b3IuJFxuJC5mbiAgICAgICAgICAgICA9IHt9XG4kLmZuLmFkZENsYXNzICAgID0gZG9tQ2xhc3MuYWRkQ2xhc3NcbiQuZm4uYXBwZW5kVG8gICAgPSBkb21FeHRyYS5hcHBlbmRUb1xuJC5mbi5vbiAgICAgICAgICA9IGV2ZW50Lm9uXG4kLmZuLnJlbW92ZSAgICAgID0gZG9tRXh0cmEucmVtb3ZlXG4kLmZuLnJlbW92ZUNsYXNzID0gZG9tQ2xhc3MucmVtb3ZlQ2xhc3NcblxubW9kdWxlLmV4cG9ydHMgPSAkXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kb210YXN0aWMtc3Vic2V0LmNvZmZlZVxuICoqLyIsIi8qKlxuICogQG1vZHVsZSBTZWxlY3RvclxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgaXNQcm90b3R5cGVTZXQgPSBmYWxzZSxcbiAgICByZUZyYWdtZW50ID0gL15cXHMqPChcXHcrfCEpW14+XSo+LyxcbiAgICByZVNpbmdsZVRhZyA9IC9ePChcXHcrKVxccypcXC8/Pig/OjxcXC9cXDE+fCkkLyxcbiAgICByZVNpbXBsZVNlbGVjdG9yID0gL15bXFwuI10/W1xcdy1dKiQvO1xuXG4vKlxuICogVmVyc2F0aWxlIHdyYXBwZXIgZm9yIGBxdWVyeVNlbGVjdG9yQWxsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fEFycmF5fSBzZWxlY3RvciBRdWVyeSBzZWxlY3RvciwgYE5vZGVgLCBgTm9kZUxpc3RgLCBhcnJheSBvZiBlbGVtZW50cywgb3IgSFRNTCBmcmFnbWVudCBzdHJpbmcuXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fSBjb250ZXh0PWRvY3VtZW50IFRoZSBjb250ZXh0IGZvciB0aGUgc2VsZWN0b3IgdG8gcXVlcnkgZWxlbWVudHMuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyICRpdGVtcyA9ICQoLml0ZW1zJyk7XG4gKiBAZXhhbXBsZVxuICogICAgIHZhciAkZWxlbWVudCA9ICQoZG9tRWxlbWVudCk7XG4gKiBAZXhhbXBsZVxuICogICAgIHZhciAkbGlzdCA9ICQobm9kZUxpc3QsIGRvY3VtZW50LmJvZHkpO1xuICogQGV4YW1wbGVcbiAqICAgICB2YXIgJGVsZW1lbnQgPSAkKCc8cD5ldmVyZ3JlZW48L3A+Jyk7XG4gKi9cblxuZnVuY3Rpb24gJChzZWxlY3Rvcikge1xuICAgIHZhciBjb250ZXh0ID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBkb2N1bWVudCA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHZhciBjb2xsZWN0aW9uO1xuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG51bGwpO1xuICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBXcmFwcGVyKSB7XG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJykge1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSBzZWxlY3Rvci5ub2RlVHlwZSB8fCBzZWxlY3RvciA9PT0gd2luZG93ID8gW3NlbGVjdG9yXSA6IHNlbGVjdG9yO1xuICAgIH0gZWxzZSBpZiAocmVGcmFnbWVudC50ZXN0KHNlbGVjdG9yKSkge1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSBjcmVhdGVGcmFnbWVudChzZWxlY3Rvcik7XG4gICAgfSBlbHNlIHtcblxuICAgICAgICBjb250ZXh0ID0gdHlwZW9mIGNvbnRleHQgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250ZXh0KSA6IGNvbnRleHQubGVuZ3RoID8gY29udGV4dFswXSA6IGNvbnRleHQ7XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IHF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IsIGNvbnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiB3cmFwKGNvbGxlY3Rpb24pO1xufVxuXG4vKlxuICogRmluZCBkZXNjZW5kYW50cyBtYXRjaGluZyB0aGUgcHJvdmlkZWQgYHNlbGVjdG9yYCBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8QXJyYXl9IHNlbGVjdG9yIFF1ZXJ5IHNlbGVjdG9yLCBgTm9kZWAsIGBOb2RlTGlzdGAsIGFycmF5IG9mIGVsZW1lbnRzLCBvciBIVE1MIGZyYWdtZW50IHN0cmluZy5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuc2VsZWN0b3InKS5maW5kKCcuZGVlcCcpLiQoJy5kZWVwZXN0Jyk7XG4gKi9cblxuZnVuY3Rpb24gZmluZChzZWxlY3Rvcikge1xuICAgIHZhciBub2RlcyA9IFtdO1xuICAgICgwLCBfdXRpbC5lYWNoKSh0aGlzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAoMCwgX3V0aWwuZWFjaCkocXVlcnlTZWxlY3RvcihzZWxlY3Rvciwgbm9kZSksIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgaWYgKG5vZGVzLmluZGV4T2YoY2hpbGQpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG5vZGVzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gJChub2Rlcyk7XG59XG5cbi8qXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZWxlbWVudCB3b3VsZCBiZSBzZWxlY3RlZCBieSB0aGUgc3BlY2lmaWVkIHNlbGVjdG9yIHN0cmluZzsgb3RoZXJ3aXNlLCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50IEVsZW1lbnQgdG8gdGVzdFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIFNlbGVjdG9yIHRvIG1hdGNoIGFnYWluc3QgZWxlbWVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICQubWF0Y2hlcyhlbGVtZW50LCAnLm1hdGNoJyk7XG4gKi9cblxudmFyIG1hdGNoZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZXh0ID0gdHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gRWxlbWVudC5wcm90b3R5cGUgOiBfdXRpbC5nbG9iYWwsXG4gICAgICAgIF9tYXRjaGVzID0gY29udGV4dC5tYXRjaGVzIHx8IGNvbnRleHQubWF0Y2hlc1NlbGVjdG9yIHx8IGNvbnRleHQubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGNvbnRleHQubXNNYXRjaGVzU2VsZWN0b3IgfHwgY29udGV4dC5vTWF0Y2hlc1NlbGVjdG9yIHx8IGNvbnRleHQud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIF9tYXRjaGVzLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpO1xuICAgIH07XG59KSgpO1xuXG4vKlxuICogVXNlIHRoZSBmYXN0ZXIgYGdldEVsZW1lbnRCeUlkYCwgYGdldEVsZW1lbnRzQnlDbGFzc05hbWVgIG9yIGBnZXRFbGVtZW50c0J5VGFnTmFtZWAgb3ZlciBgcXVlcnlTZWxlY3RvckFsbGAgaWYgcG9zc2libGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciBRdWVyeSBzZWxlY3Rvci5cbiAqIEBwYXJhbSB7Tm9kZX0gY29udGV4dCBUaGUgY29udGV4dCBmb3IgdGhlIHNlbGVjdG9yIHRvIHF1ZXJ5IGVsZW1lbnRzLlxuICogQHJldHVybiB7T2JqZWN0fSBOb2RlTGlzdCwgSFRNTENvbGxlY3Rpb24sIG9yIEFycmF5IG9mIG1hdGNoaW5nIGVsZW1lbnRzIChkZXBlbmRpbmcgb24gbWV0aG9kIHVzZWQpLlxuICovXG5cbmZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IsIGNvbnRleHQpIHtcblxuICAgIHZhciBpc1NpbXBsZVNlbGVjdG9yID0gcmVTaW1wbGVTZWxlY3Rvci50ZXN0KHNlbGVjdG9yKTtcblxuICAgIGlmIChpc1NpbXBsZVNlbGVjdG9yKSB7XG4gICAgICAgIGlmIChzZWxlY3RvclswXSA9PT0gJyMnKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IChjb250ZXh0LmdldEVsZW1lbnRCeUlkID8gY29udGV4dCA6IGRvY3VtZW50KS5nZXRFbGVtZW50QnlJZChzZWxlY3Rvci5zbGljZSgxKSk7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudCA/IFtlbGVtZW50XSA6IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxlY3RvclswXSA9PT0gJy4nKSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHNlbGVjdG9yLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZShzZWxlY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG59XG5cbi8qXG4gKiBDcmVhdGUgRE9NIGZyYWdtZW50IGZyb20gYW4gSFRNTCBzdHJpbmdcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWwgU3RyaW5nIHJlcHJlc2VudGluZyBIVE1MLlxuICogQHJldHVybiB7Tm9kZUxpc3R9XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnQoaHRtbCkge1xuXG4gICAgaWYgKHJlU2luZ2xlVGFnLnRlc3QoaHRtbCkpIHtcbiAgICAgICAgcmV0dXJuIFtkb2N1bWVudC5jcmVhdGVFbGVtZW50KFJlZ0V4cC4kMSldO1xuICAgIH1cblxuICAgIHZhciBlbGVtZW50cyA9IFtdLFxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgY2hpbGRyZW4gPSBjb250YWluZXIuY2hpbGROb2RlcztcblxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgZWxlbWVudHMucHVzaChjaGlsZHJlbltpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnRzO1xufVxuXG4vKlxuICogQ2FsbGluZyBgJChzZWxlY3RvcilgIHJldHVybnMgYSB3cmFwcGVkIGNvbGxlY3Rpb24gb2YgZWxlbWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZUxpc3R8QXJyYXl9IGNvbGxlY3Rpb24gRWxlbWVudChzKSB0byB3cmFwLlxuICogQHJldHVybiAoT2JqZWN0KSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKi9cblxuZnVuY3Rpb24gd3JhcChjb2xsZWN0aW9uKSB7XG5cbiAgICBpZiAoIWlzUHJvdG90eXBlU2V0KSB7XG4gICAgICAgIFdyYXBwZXIucHJvdG90eXBlID0gJC5mbjtcbiAgICAgICAgV3JhcHBlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBXcmFwcGVyO1xuICAgICAgICBpc1Byb3RvdHlwZVNldCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBXcmFwcGVyKGNvbGxlY3Rpb24pO1xufVxuXG4vKlxuICogQ29uc3RydWN0b3IgZm9yIHRoZSBPYmplY3QucHJvdG90eXBlIHN0cmF0ZWd5XG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlTGlzdHxBcnJheX0gY29sbGVjdGlvbiBFbGVtZW50KHMpIHRvIHdyYXAuXG4gKi9cblxuZnVuY3Rpb24gV3JhcHBlcihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgICBmb3IgKDsgaSA8IGxlbmd0aDspIHtcbiAgICAgICAgdGhpc1tpXSA9IGNvbGxlY3Rpb25baSsrXTtcbiAgICB9XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG59XG5cbi8qXG4gKiBFeHBvcnQgaW50ZXJmYWNlXG4gKi9cblxuZXhwb3J0cy4kID0gJDtcbmV4cG9ydHMuZmluZCA9IGZpbmQ7XG5leHBvcnRzLm1hdGNoZXMgPSBtYXRjaGVzO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy9zZWxlY3Rvci9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXG4gKiBAbW9kdWxlIFV0aWxcbiAqL1xuXG4vKlxuICogUmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgc2NvcGVcbiAqIEBwcml2YXRlXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbnZhciBnbG9iYWwgPSBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xuXG4vKipcbiAqIENvbnZlcnQgYE5vZGVMaXN0YCB0byBgQXJyYXlgLlxuICpcbiAqIEBwYXJhbSB7Tm9kZUxpc3R8QXJyYXl9IGNvbGxlY3Rpb25cbiAqIEByZXR1cm4ge0FycmF5fVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB0b0FycmF5KGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgIHJlc3VsdCA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0W2ldID0gY29sbGVjdGlvbltpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gW10uZm9yRWFjaCBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge05vZGV8Tm9kZUxpc3R8QXJyYXl9IGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtOb2RlfE5vZGVMaXN0fEFycmF5fVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBlYWNoKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggIT09IHVuZGVmaW5lZCAmJiBjb2xsZWN0aW9uLm5vZGVUeXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb2xsZWN0aW9uW2ldLCBpLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29sbGVjdGlvbiwgMCwgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xufVxuXG4vKipcbiAqIEFzc2lnbiBlbnVtZXJhYmxlIHByb3BlcnRpZXMgZnJvbSBzb3VyY2Ugb2JqZWN0KHMpIHRvIHRhcmdldCBvYmplY3RcbiAqXG4gKiBAbWV0aG9kIGV4dGVuZFxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBPYmplY3QgdG8gZXh0ZW5kXG4gKiBAcGFyYW0ge09iamVjdH0gW3NvdXJjZV0gT2JqZWN0IHRvIGV4dGVuZCBmcm9tXG4gKiBAcmV0dXJuIHtPYmplY3R9IEV4dGVuZGVkIG9iamVjdFxuICogQGV4YW1wbGVcbiAqICAgICAkLmV4dGVuZCh7YTogMX0sIHtiOiAyfSk7XG4gKiAgICAgLy8ge2E6IDEsIGI6IDJ9XG4gKiBAZXhhbXBsZVxuICogICAgICQuZXh0ZW5kKHthOiAxfSwge2I6IDJ9LCB7YTogM30pO1xuICogICAgIC8vIHthOiAzLCBiOiAyfVxuICovXG5cbmZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgc291cmNlcyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgc291cmNlc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzcmMpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzcmMpIHtcbiAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHNyY1twcm9wXTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBjb2xsZWN0aW9uIHdpdGhvdXQgZHVwbGljYXRlc1xuICpcbiAqIEBwYXJhbSBjb2xsZWN0aW9uIENvbGxlY3Rpb24gdG8gcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbVxuICogQHJldHVybiB7Tm9kZXxOb2RlTGlzdHxBcnJheX1cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdW5pcShjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmlsdGVyKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSBpbmRleDtcbiAgICB9KTtcbn1cblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmdsb2JhbCA9IGdsb2JhbDtcbmV4cG9ydHMudG9BcnJheSA9IHRvQXJyYXk7XG5leHBvcnRzLmVhY2ggPSBlYWNoO1xuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG5leHBvcnRzLnVuaXEgPSB1bmlxO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy91dGlsLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBAbW9kdWxlIERPTVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgX3NlbGVjdG9ySW5kZXggPSByZXF1aXJlKCcuLi9zZWxlY3Rvci9pbmRleCcpO1xuXG52YXIgZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xuXG4vKipcbiAqIEFwcGVuZCBlbGVtZW50KHMpIHRvIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fE9iamVjdH0gZWxlbWVudCBXaGF0IHRvIGFwcGVuZCB0byB0aGUgZWxlbWVudChzKS5cbiAqIENsb25lcyBlbGVtZW50cyBhcyBuZWNlc3NhcnkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5hcHBlbmQoJzxwPm1vcmU8L3A+Jyk7XG4gKi9cblxuZnVuY3Rpb24gYXBwZW5kKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0ID8gKDAsIF91dGlsLnRvQXJyYXkpKGVsZW1lbnQpIDogZWxlbWVudDtcbiAgICAgICAgICAgICAgICBmb3JFYWNoLmNhbGwoZWxlbWVudHMsIHRoaXMuYXBwZW5kQ2hpbGQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBfZWFjaCh0aGlzLCBhcHBlbmQsIGVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBQbGFjZSBlbGVtZW50KHMpIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8T2JqZWN0fSBlbGVtZW50IFdoYXQgdG8gcGxhY2UgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZWxlbWVudChzKS5cbiAqIENsb25lcyBlbGVtZW50cyBhcyBuZWNlc3NhcnkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5wcmVwZW5kKCc8c3Bhbj5zdGFydDwvc3Bhbj4nKTtcbiAqL1xuXG5mdW5jdGlvbiBwcmVwZW5kKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHRoaXMuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlTGlzdCA/ICgwLCBfdXRpbC50b0FycmF5KShlbGVtZW50KSA6IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgZm9yRWFjaC5jYWxsKGVsZW1lbnRzLnJldmVyc2UoKSwgcHJlcGVuZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIF9lYWNoKHRoaXMsIHByZXBlbmQsIGVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBQbGFjZSBlbGVtZW50KHMpIGJlZm9yZSBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxPYmplY3R9IGVsZW1lbnQgV2hhdCB0byBwbGFjZSBhcyBzaWJsaW5nKHMpIGJlZm9yZSB0byB0aGUgZWxlbWVudChzKS5cbiAqIENsb25lcyBlbGVtZW50cyBhcyBuZWNlc3NhcnkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW1zJykuYmVmb3JlKCc8cD5wcmVmaXg8L3A+Jyk7XG4gKi9cblxuZnVuY3Rpb24gYmVmb3JlKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWJlZ2luJywgZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBlbGVtZW50IGluc3RhbmNlb2YgTm9kZUxpc3QgPyAoMCwgX3V0aWwudG9BcnJheSkoZWxlbWVudCkgOiBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGZvckVhY2guY2FsbChlbGVtZW50cywgYmVmb3JlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX2VhY2godGhpcywgYmVmb3JlLCBlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogUGxhY2UgZWxlbWVudChzKSBhZnRlciBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxPYmplY3R9IGVsZW1lbnQgV2hhdCB0byBwbGFjZSBhcyBzaWJsaW5nKHMpIGFmdGVyIHRvIHRoZSBlbGVtZW50KHMpLiBDbG9uZXMgZWxlbWVudHMgYXMgbmVjZXNzYXJ5LlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtcycpLmFmdGVyKCc8c3Bhbj5zdWY8L3NwYW4+PHNwYW4+Zml4PC9zcGFuPicpO1xuICovXG5cbmZ1bmN0aW9uIGFmdGVyKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyZW5kJywgZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHRoaXMubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBlbGVtZW50IGluc3RhbmNlb2YgTm9kZUxpc3QgPyAoMCwgX3V0aWwudG9BcnJheSkoZWxlbWVudCkgOiBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGZvckVhY2guY2FsbChlbGVtZW50cy5yZXZlcnNlKCksIGFmdGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX2VhY2godGhpcywgYWZ0ZXIsIGVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDbG9uZSBhIHdyYXBwZWQgb2JqZWN0LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gV3JhcHBlZCBjb2xsZWN0aW9uIG9mIGNsb25lZCBub2Rlcy5cbiAqIEBleGFtcGxlXG4gKiAgICAgJChlbGVtZW50KS5jbG9uZSgpO1xuICovXG5cbmZ1bmN0aW9uIGNsb25lKCkge1xuICAgIHJldHVybiAoMCwgX3NlbGVjdG9ySW5kZXguJCkoX2Nsb25lKHRoaXMpKTtcbn1cblxuLyoqXG4gKiBDbG9uZSBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fEFycmF5fSBlbGVtZW50IFRoZSBlbGVtZW50KHMpIHRvIGNsb25lLlxuICogQHJldHVybiB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8QXJyYXl9IFRoZSBjbG9uZWQgZWxlbWVudChzKVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBfY2xvbmUoZWxlbWVudCkge1xuICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgfSBlbHNlIGlmICgnbGVuZ3RoJyBpbiBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBbXS5tYXAuY2FsbChlbGVtZW50LCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBTcGVjaWFsaXplZCBpdGVyYXRpb24sIGFwcGx5aW5nIGBmbmAgaW4gcmV2ZXJzZWQgbWFubmVyIHRvIGEgY2xvbmUgb2YgZWFjaCBlbGVtZW50LCBidXQgdGhlIHByb3ZpZGVkIG9uZS5cbiAqXG4gKiBAcGFyYW0ge05vZGVMaXN0fEFycmF5fSBjb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIF9lYWNoKGNvbGxlY3Rpb24sIGZuLCBlbGVtZW50KSB7XG4gICAgdmFyIGwgPSBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgICB3aGlsZSAobC0tKSB7XG4gICAgICAgIHZhciBlbG0gPSBsID09PSAwID8gZWxlbWVudCA6IF9jbG9uZShlbGVtZW50KTtcbiAgICAgICAgZm4uY2FsbChjb2xsZWN0aW9uW2xdLCBlbG0pO1xuICAgIH1cbn1cblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmFwcGVuZCA9IGFwcGVuZDtcbmV4cG9ydHMucHJlcGVuZCA9IHByZXBlbmQ7XG5leHBvcnRzLmJlZm9yZSA9IGJlZm9yZTtcbmV4cG9ydHMuYWZ0ZXIgPSBhZnRlcjtcbmV4cG9ydHMuY2xvbmUgPSBjbG9uZTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9kb210YXN0aWMvY29tbW9uanMvZG9tL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBAbW9kdWxlIERPTSAoZXh0cmEpXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBfaW5kZXggPSByZXF1aXJlKCcuL2luZGV4Jyk7XG5cbnZhciBfc2VsZWN0b3JJbmRleCA9IHJlcXVpcmUoJy4uL3NlbGVjdG9yL2luZGV4Jyk7XG5cbi8qKlxuICogQXBwZW5kIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbiB0byB0aGUgc3BlY2lmaWVkIGVsZW1lbnQocykuXG4gKlxuICogQHBhcmFtIHtOb2RlfE5vZGVMaXN0fE9iamVjdH0gZWxlbWVudCBXaGF0IHRvIGFwcGVuZCB0aGUgZWxlbWVudChzKSB0by4gQ2xvbmVzIGVsZW1lbnRzIGFzIG5lY2Vzc2FyeS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gKi9cblxuZnVuY3Rpb24gYXBwZW5kVG8oZWxlbWVudCkge1xuICAgIHZhciBjb250ZXh0ID0gdHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnID8gKDAsIF9zZWxlY3RvckluZGV4LiQpKGVsZW1lbnQpIDogZWxlbWVudDtcbiAgICBfaW5kZXguYXBwZW5kLmNhbGwoY29udGV4dCwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qXG4gKiBFbXB0eSBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykuZW1wdHkoKTtcbiAqL1xuXG5mdW5jdGlvbiBlbXB0eSgpIHtcbiAgICByZXR1cm4gKDAsIF91dGlsLmVhY2gpKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgfSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBjb2xsZWN0aW9uIGZyb20gdGhlIERPTS5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgY29udGFpbmluZyB0aGUgcmVtb3ZlZCBlbGVtZW50c1xuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLnJlbW92ZSgpO1xuICovXG5cbmZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICByZXR1cm4gKDAsIF91dGlsLmVhY2gpKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIFJlcGxhY2UgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHByb3ZpZGVkIG5ldyBjb250ZW50LCBhbmQgcmV0dXJuIHRoZSBhcnJheSBvZiBlbGVtZW50cyB0aGF0IHdlcmUgcmVwbGFjZWQuXG4gKlxuICogQHJldHVybiB7QXJyYXl9IEFycmF5IGNvbnRhaW5pbmcgdGhlIHJlcGxhY2VkIGVsZW1lbnRzXG4gKi9cblxuZnVuY3Rpb24gcmVwbGFjZVdpdGgoKSB7XG4gICAgcmV0dXJuIF9pbmRleC5iZWZvcmUuYXBwbHkodGhpcywgYXJndW1lbnRzKS5yZW1vdmUoKTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGB0ZXh0Q29udGVudGAgZnJvbSB0aGUgZmlyc3QsIG9yIHNldCB0aGUgYHRleHRDb250ZW50YCBvZiBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFt2YWx1ZV1cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLnRleHQoJ05ldyBjb250ZW50Jyk7XG4gKi9cblxuZnVuY3Rpb24gdGV4dCh2YWx1ZSkge1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0udGV4dENvbnRlbnQ7XG4gICAgfVxuXG4gICAgKDAsIF91dGlsLmVhY2gpKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSAnJyArIHZhbHVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogR2V0IHRoZSBgdmFsdWVgIGZyb20gdGhlIGZpcnN0LCBvciBzZXQgdGhlIGB2YWx1ZWAgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbdmFsdWVdXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnaW5wdXQuZmlyc3ROYW1lJykudmFsdWUoJ05ldyB2YWx1ZScpO1xuICovXG5cbmZ1bmN0aW9uIHZhbCh2YWx1ZSkge1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0udmFsdWU7XG4gICAgfVxuXG4gICAgKDAsIF91dGlsLmVhY2gpKHRoaXMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKlxuICogRXhwb3J0IGludGVyZmFjZVxuICovXG5cbmV4cG9ydHMuYXBwZW5kVG8gPSBhcHBlbmRUbztcbmV4cG9ydHMuZW1wdHkgPSBlbXB0eTtcbmV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuZXhwb3J0cy5yZXBsYWNlV2l0aCA9IHJlcGxhY2VXaXRoO1xuZXhwb3J0cy50ZXh0ID0gdGV4dDtcbmV4cG9ydHMudmFsID0gdmFsO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy9kb20vZXh0cmEuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIEBtb2R1bGUgQ2xhc3NcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxuLyoqXG4gKiBBZGQgYSBjbGFzcyB0byB0aGUgZWxlbWVudChzKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBTcGFjZS1zZXBhcmF0ZWQgY2xhc3MgbmFtZShzKSB0byBhZGQgdG8gdGhlIGVsZW1lbnQocykuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5hZGRDbGFzcygnYmFyJyk7XG4gKiAgICAgJCgnLml0ZW0nKS5hZGRDbGFzcygnYmFyIGZvbycpO1xuICovXG5cbmZ1bmN0aW9uIGFkZENsYXNzKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICAoMCwgX3V0aWwuZWFjaCkodmFsdWUuc3BsaXQoJyAnKSwgX2VhY2guYmluZCh0aGlzLCAnYWRkJykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBjbGFzcyBmcm9tIHRoZSBlbGVtZW50KHMpXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFNwYWNlLXNlcGFyYXRlZCBjbGFzcyBuYW1lKHMpIHRvIHJlbW92ZSBmcm9tIHRoZSBlbGVtZW50KHMpLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtcycpLnJlbW92ZUNsYXNzKCdiYXInKTtcbiAqICAgICAkKCcuaXRlbXMnKS5yZW1vdmVDbGFzcygnYmFyIGZvbycpO1xuICovXG5cbmZ1bmN0aW9uIHJlbW92ZUNsYXNzKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICAoMCwgX3V0aWwuZWFjaCkodmFsdWUuc3BsaXQoJyAnKSwgX2VhY2guYmluZCh0aGlzLCAncmVtb3ZlJykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBUb2dnbGUgYSBjbGFzcyBhdCB0aGUgZWxlbWVudChzKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBTcGFjZS1zZXBhcmF0ZWQgY2xhc3MgbmFtZShzKSB0byB0b2dnbGUgYXQgdGhlIGVsZW1lbnQocykuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS50b2dnbGVDbGFzcygnYmFyJyk7XG4gKiAgICAgJCgnLml0ZW0nKS50b2dnbGVDbGFzcygnYmFyIGZvbycpO1xuICovXG5cbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICAoMCwgX3V0aWwuZWFjaCkodmFsdWUuc3BsaXQoJyAnKSwgX2VhY2guYmluZCh0aGlzLCAndG9nZ2xlJykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZWxlbWVudChzKSBoYXZlIGEgY2xhc3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIENoZWNrIGlmIHRoZSBET00gZWxlbWVudCBjb250YWlucyB0aGUgY2xhc3MgbmFtZS4gV2hlbiBhcHBsaWVkIHRvIG11bHRpcGxlIGVsZW1lbnRzLFxuICogcmV0dXJucyBgdHJ1ZWAgaWYgX2FueV8gb2YgdGhlbSBjb250YWlucyB0aGUgY2xhc3MgbmFtZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGVsZW1lbnQncyBjbGFzcyBhdHRyaWJ1dGUgY29udGFpbnMgdGhlIGNsYXNzIG5hbWUuXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykuaGFzQ2xhc3MoJ2JhcicpO1xuICovXG5cbmZ1bmN0aW9uIGhhc0NsYXNzKHZhbHVlKSB7XG4gICAgcmV0dXJuICh0aGlzLm5vZGVUeXBlID8gW3RoaXNdIDogdGhpcykuc29tZShmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnModmFsdWUpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFNwZWNpYWxpemVkIGl0ZXJhdGlvbiwgYXBwbHlpbmcgYGZuYCBvZiB0aGUgY2xhc3NMaXN0IEFQSSB0byBlYWNoIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZuTmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBfZWFjaChmbk5hbWUsIGNsYXNzTmFtZSkge1xuICAgICgwLCBfdXRpbC5lYWNoKSh0aGlzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdFtmbk5hbWVdKGNsYXNzTmFtZSk7XG4gICAgfSk7XG59XG5cbi8qXG4gKiBFeHBvcnQgaW50ZXJmYWNlXG4gKi9cblxuZXhwb3J0cy5hZGRDbGFzcyA9IGFkZENsYXNzO1xuZXhwb3J0cy5yZW1vdmVDbGFzcyA9IHJlbW92ZUNsYXNzO1xuZXhwb3J0cy50b2dnbGVDbGFzcyA9IHRvZ2dsZUNsYXNzO1xuZXhwb3J0cy5oYXNDbGFzcyA9IGhhc0NsYXNzO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy9kb20vY2xhc3MuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIEBtb2R1bGUgRXZlbnRzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBfc2VsZWN0b3JDbG9zZXN0ID0gcmVxdWlyZSgnLi4vc2VsZWN0b3IvY2xvc2VzdCcpO1xuXG4vKipcbiAqIFNob3J0aGFuZCBmb3IgYGFkZEV2ZW50TGlzdGVuZXJgLiBTdXBwb3J0cyBldmVudCBkZWxlZ2F0aW9uIGlmIGEgZmlsdGVyIChgc2VsZWN0b3JgKSBpcyBwcm92aWRlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lcyBMaXN0IG9mIHNwYWNlLXNlcGFyYXRlZCBldmVudCB0eXBlcyB0byBiZSBhZGRlZCB0byB0aGUgZWxlbWVudChzKVxuICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcl0gU2VsZWN0b3IgdG8gZmlsdGVyIGRlc2NlbmRhbnRzIHRoYXQgZGVsZWdhdGUgdGhlIGV2ZW50IHRvIHRoaXMgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgRXZlbnQgaGFuZGxlclxuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlPWZhbHNlXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5vbignY2xpY2snLCBjYWxsYmFjayk7XG4gKiAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljayBmb2N1cycsICcuaXRlbScsIGhhbmRsZXIpO1xuICovXG5cbmZ1bmN0aW9uIG9uKGV2ZW50TmFtZXMsIHNlbGVjdG9yLCBoYW5kbGVyLCB1c2VDYXB0dXJlKSB7XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICAgICAgc2VsZWN0b3IgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBwYXJ0cywgbmFtZXNwYWNlLCBldmVudExpc3RlbmVyO1xuXG4gICAgZXZlbnROYW1lcy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuXG4gICAgICAgIHBhcnRzID0gZXZlbnROYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgIGV2ZW50TmFtZSA9IHBhcnRzWzBdIHx8IG51bGw7XG4gICAgICAgIG5hbWVzcGFjZSA9IHBhcnRzWzFdIHx8IG51bGw7XG5cbiAgICAgICAgZXZlbnRMaXN0ZW5lciA9IHByb3h5SGFuZGxlcihoYW5kbGVyKTtcblxuICAgICAgICAoMCwgX3V0aWwuZWFjaCkodGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lciA9IGRlbGVnYXRlSGFuZGxlci5iaW5kKGVsZW1lbnQsIHNlbGVjdG9yLCBldmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRMaXN0ZW5lciwgdXNlQ2FwdHVyZSB8fCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGdldEhhbmRsZXJzKGVsZW1lbnQpLnB1c2goe1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lcjogZXZlbnRMaXN0ZW5lcixcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBuYW1lc3BhY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFNob3J0aGFuZCBmb3IgYHJlbW92ZUV2ZW50TGlzdGVuZXJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVzIExpc3Qgb2Ygc3BhY2Utc2VwYXJhdGVkIGV2ZW50IHR5cGVzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgZWxlbWVudChzKVxuICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcl0gU2VsZWN0b3IgdG8gZmlsdGVyIGRlc2NlbmRhbnRzIHRoYXQgdW5kZWxlZ2F0ZSB0aGUgZXZlbnQgdG8gdGhpcyBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBFdmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUNhcHR1cmU9ZmFsc2VcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLm9mZignY2xpY2snLCBjYWxsYmFjayk7XG4gKiAgICAgJCgnI215LWVsZW1lbnQnKS5vZmYoJ215RXZlbnQgbXlPdGhlckV2ZW50Jyk7XG4gKiAgICAgJCgnLml0ZW0nKS5vZmYoKTtcbiAqL1xuXG5mdW5jdGlvbiBvZmYoZXZlbnROYW1lcywgc2VsZWN0b3IsIGhhbmRsZXIsIHVzZUNhcHR1cmUpIHtcbiAgICBpZiAoZXZlbnROYW1lcyA9PT0gdW5kZWZpbmVkKSBldmVudE5hbWVzID0gJyc7XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICAgICAgc2VsZWN0b3IgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBwYXJ0cywgbmFtZXNwYWNlLCBoYW5kbGVycztcblxuICAgIGV2ZW50TmFtZXMuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudE5hbWUpIHtcblxuICAgICAgICBwYXJ0cyA9IGV2ZW50TmFtZS5zcGxpdCgnLicpO1xuICAgICAgICBldmVudE5hbWUgPSBwYXJ0c1swXSB8fCBudWxsO1xuICAgICAgICBuYW1lc3BhY2UgPSBwYXJ0c1sxXSB8fCBudWxsO1xuXG4gICAgICAgICgwLCBfdXRpbC5lYWNoKSh0aGlzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuXG4gICAgICAgICAgICBoYW5kbGVycyA9IGdldEhhbmRsZXJzKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAoMCwgX3V0aWwuZWFjaCkoaGFuZGxlcnMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICghZXZlbnROYW1lIHx8IGl0ZW0uZXZlbnROYW1lID09PSBldmVudE5hbWUpICYmICghbmFtZXNwYWNlIHx8IGl0ZW0ubmFtZXNwYWNlID09PSBuYW1lc3BhY2UpICYmICghaGFuZGxlciB8fCBpdGVtLmhhbmRsZXIgPT09IGhhbmRsZXIpICYmICghc2VsZWN0b3IgfHwgaXRlbS5zZWxlY3RvciA9PT0gc2VsZWN0b3IpO1xuICAgICAgICAgICAgfSksIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGl0ZW0uZXZlbnROYW1lLCBpdGVtLmV2ZW50TGlzdGVuZXIsIHVzZUNhcHR1cmUgfHwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShoYW5kbGVycy5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIWV2ZW50TmFtZSAmJiAhbmFtZXNwYWNlICYmICFzZWxlY3RvciAmJiAhaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGNsZWFySGFuZGxlcnMoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNsZWFySGFuZGxlcnMoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogR2V0IGV2ZW50IGhhbmRsZXJzIGZyb20gYW4gZWxlbWVudFxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbnZhciBldmVudEtleVByb3AgPSAnX19kb210YXN0aWNfZXZlbnRfXyc7XG52YXIgaWQgPSAxO1xudmFyIGhhbmRsZXJzID0ge307XG52YXIgdW51c2VkS2V5cyA9IFtdO1xuXG5mdW5jdGlvbiBnZXRIYW5kbGVycyhlbGVtZW50KSB7XG4gICAgaWYgKCFlbGVtZW50W2V2ZW50S2V5UHJvcF0pIHtcbiAgICAgICAgZWxlbWVudFtldmVudEtleVByb3BdID0gdW51c2VkS2V5cy5sZW5ndGggPT09IDAgPyArK2lkIDogdW51c2VkS2V5cy5wb3AoKTtcbiAgICB9XG4gICAgdmFyIGtleSA9IGVsZW1lbnRbZXZlbnRLZXlQcm9wXTtcbiAgICByZXR1cm4gaGFuZGxlcnNba2V5XSB8fCAoaGFuZGxlcnNba2V5XSA9IFtdKTtcbn1cblxuLyoqXG4gKiBDbGVhciBldmVudCBoYW5kbGVycyBmb3IgYW4gZWxlbWVudFxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBjbGVhckhhbmRsZXJzKGVsZW1lbnQpIHtcbiAgICB2YXIga2V5ID0gZWxlbWVudFtldmVudEtleVByb3BdO1xuICAgIGlmIChoYW5kbGVyc1trZXldKSB7XG4gICAgICAgIGhhbmRsZXJzW2tleV0gPSBudWxsO1xuICAgICAgICBlbGVtZW50W2tleV0gPSBudWxsO1xuICAgICAgICB1bnVzZWRLZXlzLnB1c2goa2V5KTtcbiAgICB9XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gY3JlYXRlIGEgaGFuZGxlciB0aGF0IGF1Z21lbnRzIHRoZSBldmVudCBvYmplY3Qgd2l0aCBzb21lIGV4dHJhIG1ldGhvZHMsXG4gKiBhbmQgZXhlY3V0ZXMgdGhlIGNhbGxiYWNrIHdpdGggdGhlIGV2ZW50IGFuZCB0aGUgZXZlbnQgZGF0YSAoaS5lLiBgZXZlbnQuZGV0YWlsYCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSBoYW5kbGVyIENhbGxiYWNrIHRvIGV4ZWN1dGUgYXMgYGhhbmRsZXIoZXZlbnQsIGRhdGEpYFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gcHJveHlIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhdWdtZW50RXZlbnQoZXZlbnQpLCBldmVudC5kZXRhaWwpO1xuICAgIH07XG59XG5cbi8qKlxuICogQXR0ZW1wdCB0byBhdWdtZW50IGV2ZW50cyBhbmQgaW1wbGVtZW50IHNvbWV0aGluZyBjbG9zZXIgdG8gRE9NIExldmVsIDMgRXZlbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbnZhciBhdWdtZW50RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIG1ldGhvZE5hbWUsXG4gICAgICAgIGV2ZW50TWV0aG9kcyA9IHtcbiAgICAgICAgcHJldmVudERlZmF1bHQ6ICdpc0RlZmF1bHRQcmV2ZW50ZWQnLFxuICAgICAgICBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb246ICdpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCcsXG4gICAgICAgIHN0b3BQcm9wYWdhdGlvbjogJ2lzUHJvcGFnYXRpb25TdG9wcGVkJ1xuICAgIH0sXG4gICAgICAgIHJldHVyblRydWUgPSBmdW5jdGlvbiByZXR1cm5UcnVlKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgICAgICByZXR1cm5GYWxzZSA9IGZ1bmN0aW9uIHJldHVybkZhbHNlKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQgfHwgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIHx8IGV2ZW50LnN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgZm9yIChtZXRob2ROYW1lIGluIGV2ZW50TWV0aG9kcykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAobWV0aG9kTmFtZSwgdGVzdE1ldGhvZE5hbWUsIG9yaWdpbmFsTWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50W21ldGhvZE5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1t0ZXN0TWV0aG9kTmFtZV0gPSByZXR1cm5UcnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsTWV0aG9kICYmIG9yaWdpbmFsTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50W3Rlc3RNZXRob2ROYW1lXSA9IHJldHVybkZhbHNlO1xuICAgICAgICAgICAgICAgIH0pKG1ldGhvZE5hbWUsIGV2ZW50TWV0aG9kc1ttZXRob2ROYW1lXSwgZXZlbnRbbWV0aG9kTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV2ZW50Ll9wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHRlc3Qgd2hldGhlciBkZWxlZ2F0ZWQgZXZlbnRzIG1hdGNoIHRoZSBwcm92aWRlZCBgc2VsZWN0b3JgIChmaWx0ZXIpLFxuICogaWYgdGhlIGV2ZW50IHByb3BhZ2F0aW9uIHdhcyBzdG9wcGVkLCBhbmQgdGhlbiBhY3R1YWxseSBjYWxsIHRoZSBwcm92aWRlZCBldmVudCBoYW5kbGVyLlxuICogVXNlIGB0aGlzYCBpbnN0ZWFkIG9mIGBldmVudC5jdXJyZW50VGFyZ2V0YCBvbiB0aGUgZXZlbnQgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgU2VsZWN0b3IgdG8gZmlsdGVyIGRlc2NlbmRhbnRzIHRoYXQgdW5kZWxlZ2F0ZSB0aGUgZXZlbnQgdG8gdGhpcyBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBFdmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICovXG5cbmZ1bmN0aW9uIGRlbGVnYXRlSGFuZGxlcihzZWxlY3RvciwgaGFuZGxlciwgZXZlbnQpIHtcbiAgICB2YXIgZXZlbnRUYXJnZXQgPSBldmVudC5fdGFyZ2V0IHx8IGV2ZW50LnRhcmdldCxcbiAgICAgICAgY3VycmVudFRhcmdldCA9IF9zZWxlY3RvckNsb3Nlc3QuY2xvc2VzdC5jYWxsKFtldmVudFRhcmdldF0sIHNlbGVjdG9yLCB0aGlzKVswXTtcbiAgICBpZiAoY3VycmVudFRhcmdldCAmJiBjdXJyZW50VGFyZ2V0ICE9PSB0aGlzKSB7XG4gICAgICAgIGlmIChjdXJyZW50VGFyZ2V0ID09PSBldmVudFRhcmdldCB8fCAhKGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkICYmIGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKCkpKSB7XG4gICAgICAgICAgICBoYW5kbGVyLmNhbGwoY3VycmVudFRhcmdldCwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG52YXIgYmluZCA9IG9uLFxuICAgIHVuYmluZCA9IG9mZjtcblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLm9uID0gb247XG5leHBvcnRzLm9mZiA9IG9mZjtcbmV4cG9ydHMuYmluZCA9IGJpbmQ7XG5leHBvcnRzLnVuYmluZCA9IHVuYmluZDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9kb210YXN0aWMvY29tbW9uanMvZXZlbnQvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIEBtb2R1bGUgY2xvc2VzdFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9pbmRleCA9IHJlcXVpcmUoJy4vaW5kZXgnKTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG4vKipcbiAqIFJldHVybiB0aGUgY2xvc2VzdCBlbGVtZW50IG1hdGNoaW5nIHRoZSBzZWxlY3RvciAoc3RhcnRpbmcgYnkgaXRzZWxmKSBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciBGaWx0ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gSWYgcHJvdmlkZWQsIG1hdGNoaW5nIGVsZW1lbnRzIG11c3QgYmUgYSBkZXNjZW5kYW50IG9mIHRoaXMgZWxlbWVudFxuICogQHJldHVybiB7T2JqZWN0fSBOZXcgd3JhcHBlZCBjb2xsZWN0aW9uIChjb250YWluaW5nIHplcm8gb3Igb25lIGVsZW1lbnQpXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5zZWxlY3RvcicpLmNsb3Nlc3QoJy5jb250YWluZXInKTtcbiAqL1xuXG52YXIgY2xvc2VzdCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAoMCwgX3V0aWwuZWFjaCkodGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoKDAsIF9pbmRleC5tYXRjaGVzKShub2RlLCBzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gKDAsIF9pbmRleC4kKSgoMCwgX3V0aWwudW5pcSkobm9kZXMpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIUVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgPyBjbG9zZXN0IDogZnVuY3Rpb24gKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgICAoMCwgX3V0aWwuZWFjaCkodGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IG5vZGUuY2xvc2VzdChzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMucHVzaChuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAoMCwgX2luZGV4LiQpKCgwLCBfdXRpbC51bmlxKShub2RlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNsb3Nlc3QuY2FsbCh0aGlzLCBzZWxlY3RvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmNsb3Nlc3QgPSBjbG9zZXN0O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXRhc3RpYy9jb21tb25qcy9zZWxlY3Rvci9jbG9zZXN0LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGFzc2lnbldpdGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9hc3NpZ25XaXRoJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VBc3NpZ24nKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gKiBvYmplY3QuIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqIElmIGBjdXN0b21pemVyYCBpcyBwcm92aWRlZCBpdCBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGFzc2lnbmVkIHZhbHVlcy5cbiAqIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggZml2ZSBhcmd1bWVudHM6XG4gKiAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgYmFzZWQgb25cbiAqIFtgT2JqZWN0LmFzc2lnbmBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5hc3NpZ24pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAYWxpYXMgZXh0ZW5kXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY3VzdG9taXplcmAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmFzc2lnbih7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogNDAgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCB9XG4gKlxuICogLy8gdXNpbmcgYSBjdXN0b21pemVyIGNhbGxiYWNrXG4gKiB2YXIgZGVmYXVsdHMgPSBfLnBhcnRpYWxSaWdodChfLmFzc2lnbiwgZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gKiAgIHJldHVybiBfLmlzVW5kZWZpbmVkKHZhbHVlKSA/IG90aGVyIDogdmFsdWU7XG4gKiB9KTtcbiAqXG4gKiBkZWZhdWx0cyh7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAqL1xudmFyIGFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKSB7XG4gIHJldHVybiBjdXN0b21pemVyXG4gICAgPyBhc3NpZ25XaXRoKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKVxuICAgIDogYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ247XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvb2JqZWN0L2Fzc2lnbi5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uYXNzaWduYCBmb3IgY3VzdG9taXppbmcgYXNzaWduZWQgdmFsdWVzIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLCBtdWx0aXBsZSBzb3VyY2VzLCBhbmQgYHRoaXNgIGJpbmRpbmcgYGN1c3RvbWl6ZXJgXG4gKiBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHByb3BzID0ga2V5cyhzb3VyY2UpLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgcmVzdWx0ID0gY3VzdG9taXplcih2YWx1ZSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuXG4gICAgaWYgKChyZXN1bHQgPT09IHJlc3VsdCA/IChyZXN1bHQgIT09IHZhbHVlKSA6ICh2YWx1ZSA9PT0gdmFsdWUpKSB8fFxuICAgICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgICAgb2JqZWN0W2tleV0gPSByZXN1bHQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduV2l0aDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9hc3NpZ25XaXRoLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgc2hpbUtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9zaGltS2V5cycpO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBnZXROYXRpdmUoT2JqZWN0LCAna2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG52YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QpIHx8XG4gICAgICAodHlwZW9mIG9iamVjdCAhPSAnZnVuY3Rpb24nICYmIGlzQXJyYXlMaWtlKG9iamVjdCkpKSB7XG4gICAgcmV0dXJuIHNoaW1LZXlzKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgPyBuYXRpdmVLZXlzKG9iamVjdCkgOiBbXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9vYmplY3Qva2V5cy5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNOYXRpdmUgPSByZXF1aXJlKCcuLi9sYW5nL2lzTmF0aXZlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICByZXR1cm4gaXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2dldE5hdGl2ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSA+IDUpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZm5Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZuVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KGZuVG9TdHJpbmcuY2FsbCh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHJlSXNIb3N0Q3Rvci50ZXN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05hdGl2ZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9sYW5nL2lzTmF0aXZlLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmkgd2hpY2ggcmV0dXJuICdmdW5jdGlvbicgZm9yIHJlZ2V4ZXNcbiAgLy8gYW5kIFNhZmFyaSA4IGVxdWl2YWxlbnRzIHdoaWNoIHJldHVybiAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgY29uc3RydWN0b3JzLlxuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGZ1bmNUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9sYW5nL2lzRnVuY3Rpb24uanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9sYW5nL2lzT2JqZWN0LmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvaXNPYmplY3RMaWtlLmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBnZXRMZW5ndGggPSByZXF1aXJlKCcuL2dldExlbmd0aCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9pc0FycmF5TGlrZS5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgYmFzZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9iYXNlUHJvcGVydHknKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXZvaWQgYSBbSklUIGJ1Z10oaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE0Mjc5MilcbiAqIHRoYXQgYWZmZWN0cyBTYWZhcmkgb24gYXQgbGVhc3QgaU9TIDguMS04LjMgQVJNNjQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBcImxlbmd0aFwiIHZhbHVlLlxuICovXG52YXIgZ2V0TGVuZ3RoID0gYmFzZVByb3BlcnR5KCdsZW5ndGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRMZW5ndGg7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvZ2V0TGVuZ3RoLmpzXG4gKiogbW9kdWxlIGlkID0gMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2Jhc2VQcm9wZXJ0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2lzTGVuZ3RoLmpzXG4gKiogbW9kdWxlIGlkID0gMjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vaXNJbmRleCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzSW4nKTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBmYWxsYmFjayBpbXBsZW1lbnRhdGlvbiBvZiBgT2JqZWN0LmtleXNgIHdoaWNoIGNyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlXG4gKiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gc2hpbUtleXMob2JqZWN0KSB7XG4gIHZhciBwcm9wcyA9IGtleXNJbihvYmplY3QpLFxuICAgICAgcHJvcHNMZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICBsZW5ndGggPSBwcm9wc0xlbmd0aCAmJiBvYmplY3QubGVuZ3RoO1xuXG4gIHZhciBhbGxvd0luZGV4ZXMgPSAhIWxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgcHJvcHNMZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgIGlmICgoYWxsb3dJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaGltS2V5cztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9zaGltS2V5cy5qc1xuICoqIG1vZHVsZSBpZCA9IDIxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKSAmJlxuICAgIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJiAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2xhbmcvaXNBcmd1bWVudHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2dldE5hdGl2ZScpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNBcnJheSA9IGdldE5hdGl2ZShBcnJheSwgJ2lzQXJyYXknKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcnJheVRhZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9sYW5nL2lzQXJyYXkuanNcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvaW50ZXJuYWwvaXNJbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDtcbiAgbGVuZ3RoID0gKGxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKSAmJiBsZW5ndGgpIHx8IDA7XG5cbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgaXNQcm90byA9IHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUgPT09IG9iamVjdCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCksXG4gICAgICBza2lwSW5kZXhlcyA9IGxlbmd0aCA+IDA7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gKGluZGV4ICsgJycpO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShza2lwSW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgJiZcbiAgICAgICAgIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvb2JqZWN0L2tleXNJbi5qc1xuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgYmFzZUNvcHkgPSByZXF1aXJlKCcuL2Jhc2VDb3B5JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLFxuICogbXVsdGlwbGUgc291cmNlcywgYW5kIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBzb3VyY2UgPT0gbnVsbFxuICAgID8gb2JqZWN0XG4gICAgOiBiYXNlQ29weShzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2Jhc2VBc3NpZ24uanNcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQ29weShzb3VyY2UsIHByb3BzLCBvYmplY3QpIHtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgIG9iamVjdFtrZXldID0gc291cmNlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ29weTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9iYXNlQ29weS5qc1xuICoqIG1vZHVsZSBpZCA9IDI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgYmluZENhbGxiYWNrID0gcmVxdWlyZSgnLi9iaW5kQ2FsbGJhY2snKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vaXNJdGVyYXRlZUNhbGwnKSxcbiAgICByZXN0UGFyYW0gPSByZXF1aXJlKCcuLi9mdW5jdGlvbi9yZXN0UGFyYW0nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYF8uYXNzaWduYCwgYF8uZGVmYXVsdHNgLCBvciBgXy5tZXJnZWAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiByZXN0UGFyYW0oZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG9iamVjdCA9PSBudWxsID8gMCA6IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbbGVuZ3RoIC0gMl0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQsXG4gICAgICAgIHRoaXNBcmcgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjdXN0b21pemVyID0gYmluZENhbGxiYWNrKGN1c3RvbWl6ZXIsIHRoaXNBcmcsIDUpO1xuICAgICAgbGVuZ3RoIC09IDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSB0eXBlb2YgdGhpc0FyZyA9PSAnZnVuY3Rpb24nID8gdGhpc0FyZyA6IHVuZGVmaW5lZDtcbiAgICAgIGxlbmd0aCAtPSAoY3VzdG9taXplciA/IDEgOiAwKTtcbiAgICB9XG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBc3NpZ25lcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2xvZGFzaC9pbnRlcm5hbC9jcmVhdGVBc3NpZ25lci5qc1xuICoqIG1vZHVsZSBpZCA9IDI4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuLi91dGlsaXR5L2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlQ2FsbGJhY2tgIHdoaWNoIG9ubHkgc3VwcG9ydHMgYHRoaXNgIGJpbmRpbmdcbiAqIGFuZCBzcGVjaWZ5aW5nIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ0NvdW50XSBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGJpbmRDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodGhpc0FyZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cbiAgc3dpdGNoIChhcmdDb3VudCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlciwga2V5LCBvYmplY3QsIHNvdXJjZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmluZENhbGxiYWNrO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2JpbmRDYWxsYmFjay5qc1xuICoqIG1vZHVsZSBpZCA9IDI5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IHByb3ZpZGVkIHRvIGl0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0O1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Rhc2gvdXRpbGl0eS9pZGVudGl0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDMwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vaXNJbmRleCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KSkge1xuICAgIHZhciBvdGhlciA9IG9iamVjdFtpbmRleF07XG4gICAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/ICh2YWx1ZSA9PT0gb3RoZXIpIDogKG90aGVyICE9PSBvdGhlcik7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsLmpzXG4gKiogbW9kdWxlIGlkID0gMzFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZVxuICogY3JlYXRlZCBmdW5jdGlvbiBhbmQgYXJndW1lbnRzIGZyb20gYHN0YXJ0YCBhbmQgYmV5b25kIHByb3ZpZGVkIGFzIGFuIGFycmF5LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvbiB0aGUgW3Jlc3QgcGFyYW1ldGVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9GdW5jdGlvbnMvcmVzdF9wYXJhbWV0ZXJzKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBzYXkgPSBfLnJlc3RQYXJhbShmdW5jdGlvbih3aGF0LCBuYW1lcykge1xuICogICByZXR1cm4gd2hhdCArICcgJyArIF8uaW5pdGlhbChuYW1lcykuam9pbignLCAnKSArXG4gKiAgICAgKF8uc2l6ZShuYW1lcykgPiAxID8gJywgJiAnIDogJycpICsgXy5sYXN0KG5hbWVzKTtcbiAqIH0pO1xuICpcbiAqIHNheSgnaGVsbG8nLCAnZnJlZCcsICdiYXJuZXknLCAncGViYmxlcycpO1xuICogLy8gPT4gJ2hlbGxvIGZyZWQsIGJhcm5leSwgJiBwZWJibGVzJ1xuICovXG5mdW5jdGlvbiByZXN0UGFyYW0oZnVuYywgc3RhcnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogKCtzdGFydCB8fCAwKSwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICByZXN0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICByZXN0W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIHN3aXRjaCAoc3RhcnQpIHtcbiAgICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCByZXN0KTtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCByZXN0KTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCBhcmdzWzFdLCByZXN0KTtcbiAgICB9XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgaW5kZXggPSAtMTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSByZXN0O1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzdFBhcmFtO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbG9kYXNoL2Z1bmN0aW9uL3Jlc3RQYXJhbS5qc1xuICoqIG1vZHVsZSBpZCA9IDMyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9