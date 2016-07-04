(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Notifier"] = factory();
	else
		root["Notifier"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var $, ActionType, Notification, NotificationType, Notifier, NotifierInstance, assign;

	$ = __webpack_require__(1);

	ActionType = __webpack_require__(9);

	assign = __webpack_require__(10);

	Notification = __webpack_require__(34);

	NotificationType = __webpack_require__(36);

	Notifier = __webpack_require__(38);

	NotifierInstance = new Notifier;

	module.exports = {
	  actionType: ActionType,
	  send: NotifierInstance.send.bind(NotifierInstance),
	  clearAll: NotifierInstance.clearAll.bind(NotifierInstance),
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
/***/ function(module, exports) {

	module.exports = {
	  DEFAULT: 'default',
	  PRIMARY: 'primary',
	  DANGER: 'danger',
	  CUSTOM: 'custom'
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var assignWith = __webpack_require__(11),
	    baseAssign = __webpack_require__(27),
	    createAssigner = __webpack_require__(29);

	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it's invoked to produce the assigned values.
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(12);

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(13),
	    isArrayLike = __webpack_require__(18),
	    isObject = __webpack_require__(16),
	    shimKeys = __webpack_require__(22);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(14);

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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(15),
	    isObjectLike = __webpack_require__(17);

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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);

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
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	module.exports = isFunction;


/***/ },
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(19),
	    isLength = __webpack_require__(21);

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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(20);

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
/* 20 */
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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(23),
	    isArray = __webpack_require__(24),
	    isIndex = __webpack_require__(25),
	    isLength = __webpack_require__(21),
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

	var isArrayLike = __webpack_require__(18),
	    isObjectLike = __webpack_require__(17);

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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(13),
	    isLength = __webpack_require__(21),
	    isObjectLike = __webpack_require__(17);

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
/* 25 */
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(23),
	    isArray = __webpack_require__(24),
	    isIndex = __webpack_require__(25),
	    isLength = __webpack_require__(21),
	    isObject = __webpack_require__(16);

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
	    keys = __webpack_require__(12);

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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var bindCallback = __webpack_require__(30),
	    isIterateeCall = __webpack_require__(32),
	    restParam = __webpack_require__(33);

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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(18),
	    isIndex = __webpack_require__(25),
	    isObject = __webpack_require__(16);

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
/***/ function(module, exports) {

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var $, ActionType, Animator, Notification, NotificationType, assign, bemItem, uuid;

	$ = __webpack_require__(1);

	ActionType = __webpack_require__(9);

	Animator = __webpack_require__(35);

	assign = __webpack_require__(10);

	NotificationType = __webpack_require__(36);

	uuid = __webpack_require__(37);


	/*
	 * Some settings
	 */

	bemItem = 'eegnotif';


	/*
	 * Notification class
	 */

	module.exports = Notification = (function() {
	  Notification.prototype.defaults = {
	    actions: [],
	    closeOnClick: false,
	    delay: 0,
	    duration: 6,
	    icon: true,
	    modal: false,
	    center: false,
	    large: false,
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
	    this.status = 0;
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
	    if (this.large) {
	      classes.push(bemItem + "--large");
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

	  Notification.prototype.showIn = function(target) {
	    this.status = 1;
	    this.getDOMNode().appendTo(target);
	    return this._getAnimator().transition('enter', (function(_this) {
	      return function() {
	        if (_this.onShow != null) {
	          return _this.onShow.apply(_this);
	        }
	      };
	    })(this));
	  };

	  Notification.prototype.remove = function() {
	    this.status = 2;
	    this._getAnimator().transition('leave', (function(_this) {
	      return function() {
	        if (_this.onRemove != null) {
	          _this.onRemove.apply(_this);
	        }
	        return _this.getDOMNode().remove();
	      };
	    })(this));
	    return setTimeout((function() {
	      if (document.getElementsByClassName("" + bemItem).length < 1) {
	        return document.getElementsByClassName("" + bemWrapper)[0].className = "" + bemWrapper;
	      }
	    }), 400);
	  };

	  return Notification;

	})();


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var Animator, assign;

	assign = __webpack_require__(10);


	/*
	 * Animator class
	 */

	module.exports = Animator = (function() {
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


/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = {
	  INFO: 'info',
	  SUCCESS: 'success',
	  WARN: 'warn',
	  ERROR: 'error',
	  DEBUG: 'debug',
	  CUSTOM: 'custom'
	};


/***/ },
/* 37 */
/***/ function(module, exports) {

	var _uuid;

	_uuid = 0;

	module.exports = function() {
	  return ++_uuid;
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var $, Notification, Notifier, bemWrapper;

	$ = __webpack_require__(1);

	Notification = __webpack_require__(34);


	/*
	 * Some settings
	 */

	bemWrapper = 'eegnotifs';


	/*
	 * Notifier class
	 */

	module.exports = Notifier = (function() {
	  function Notifier() {
	    this.wrapper = $("<div class='" + bemWrapper + "'></div>");
	    this.queue = {};
	    console.log('vasyy');
	    if (document.readyState !== "loading") {
	      this.wrapper.appendTo(document.body);
	    } else {
	      document.addEventListener('DOMContentLoaded', (function(_this) {
	        return function() {
	          return _this.wrapper.appendTo(document.body);
	        };
	      })(this));
	    }
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
	    if (notification.large) {
	      this.wrapper[0].className += " " + bemWrapper + "--large";
	    }
	    if (notification.center) {
	      this.wrapper[0].className += " " + bemWrapper + "--centered";
	    }
	    notification.delayTimeout = setTimeout((function(_this) {
	      return function() {
	        return _this.show(notification);
	      };
	    })(this), notification.delay * 1000);
	    return id;
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
	      if (includeDelayed || notification.status > 0) {
	        results.push(this.remove(id));
	      }
	    }
	    return results;
	  };

	  Notifier.prototype.remove = function(id) {
	    if (this.queue[id]) {
	      clearTimeout(this.queue[id].delayTimeout);
	      this.queue[id].remove();
	      delete this.queue[id];
	      return true;
	    } else {
	      return false;
	    }
	  };

	  return Notifier;

	})();


/***/ }
/******/ ])
});
;