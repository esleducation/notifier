selector = require 'domtastic/commonjs/selector'
dom      = require 'domtastic/commonjs/dom'
domExtra = require 'domtastic/commonjs/dom/extra'
domClass = require 'domtastic/commonjs/dom/class'
event    = require 'domtastic/commonjs/event'

$                = selector.$
$.fn             = {}
$.fn.addClass    = domClass.addClass
$.fn.appendTo    = domExtra.appendTo
$.fn.on          = event.on
$.fn.remove      = domExtra.remove
$.fn.removeClass = domClass.removeClass

module.exports = $
