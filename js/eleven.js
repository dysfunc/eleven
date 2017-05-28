(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activeXHR = 0,
    jsonPUID = 0,
    emptyFn = function emptyFn() {};

_core2.default.extend({
  /**
   * Default XHR configuration
   * @type {Object}
   */
  ajaxSettings: {
    accepts: {
      html: 'text/html',
      json: 'application/json',
      script: 'text/javascript, application/javascript',
      text: 'text/plain',
      xml: 'application/xml, text/xml'
    },
    async: true,
    beforeSend: emptyFn,
    complete: emptyFn,
    context: document,
    crossDomain: false,
    error: emptyFn,
    global: true,
    headers: {},
    callback: {
      fn: 'jsonCallback',
      param: 'callback'
    },
    success: emptyFn,
    timeout: 0,
    type: 'GET'
  },
  /**
   * Creates an asynchronous XHR request
   * @param  {Object} config  Object containing the request configuration
   * @return {Object}         XHR request object
   */
  ajax: function ajax(config) {
    var callback = _core2.default.regexp.callback.test(config.url),
        config = _core2.default.extend(true, {}, _core2.default.ajaxSettings, config || {}),
        data = config.data && _core2.default.isObject(config.data) && (config.data = _core2.default.params(config.data)) || null,
        context = config.context,
        contentType = config.contentType || 'application/x-www-form-urlencoded',
        headers = config.headers,
        method = config.type.toUpperCase(),
        mimeType = config.accepts[config.dataType],
        protocol = /^((http|ftp|file)(s?)\:)?/.test(config.url) ? RegExp.$1 : window.location.protocol,
        type = config.dataType,
        url = config.url || !config.url && (config.url = window.location.toString()),
        xhr = config.xhr = new window.XMLHttpRequest();

    if (method === 'GET' && data) {
      config.url += (config.url.indexOf('?') < 0 ? '?' : '&') + data;
    }

    if (config.dataType === 'jsonp') {
      return _core2.default.jsonP(config);
    }

    xhr.onreadystatechange = function readyStateChange() {
      var error = false,
          requestTimeout,
          result = '';

      activeXHR++;

      if (xhr.readyState === 4) {
        clearTimeout(requestTimeout);

        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol === 'file:') {
          result = xhr.responseText;

          try {
            if (type === 'json' && !/^\s*$/g.test(result)) {
              result = _core2.default.parseJSON(result);
            } else if (type === 'xml') {
              result = _core2.default.parseXML(xhr.responseXML);
            } else if (type === 'script') {
              (1, eval)(result);
            }
          } catch (e) {
            error = e;
          }

          if (error) {
            config.error.call(context, xhr, 'parsererror', error);
          } else {
            config.success.call(context, result, 'success', xhr);
          }
        } else {
          config.error.call(context, xhr, 'error', error);
        }

        config.complete.call(context, xhr, error ? 'error' : 'success');

        activeXHR--;
      }
    };

    if (config.beforeSend.call(context, xhr, config) === false) {
      xhr.abort();
      activeXHR--;
      return false;
    }

    if (mimeType) {
      headers['Accept'] = mimeType;
      xhr.overrideMimeType && xhr.overrideMimeType(mimeType.split(',')[1] || mimeType.split(',')[0]);
    }

    if (contentType || data && method !== 'GET') {
      headers['Content-Type'] = contentType;
    }

    xhr.open(method, config.url, config.async);

    for (var header in headers) {
      xhr.setRequestHeader(header, config.headers[header]);
    }

    if (config.timeout > 0) {
      requestTimeout = setTimeout(function () {
        xhr.onreadystatechange = emptyFn;
        config.error.call(context, xhr, 'timeout');
        xhr.abort();
        activeXHR--;
      }, config.timeout);
    }

    xhr.send(data);

    return xhr;
  },

  /**
   * Shortcut JSONP method
   * @param  {Object}   config  The JSONP config, including data (e.g. url: '...', data: { param: 'value' } )
   * @param  {Function} success The callback function to execute upon success
   * @param  {Function} error   The callback function to execute upon failure
   */
  jsonp: function jsonp(config) {
    var success = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFn;
    var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFn;

    if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) !== 'object' || config && !config.url) {
      return undefined;
    }

    return _core2.default.ajax(_core2.default.extend(true, { dataType: 'jsonp', success: success, error: error }, config));
  },

  /**
   * Fetch JSON data cross-domain with JSONP
   * @param  {Object} config The request configuration
   * @return {Object}
   */
  jsonP: function jsonP(_ref) {
    var context = _ref.context,
        jsonp = _ref.jsonp,
        url = _ref.url,
        xhr = _ref.xhr,
        error = _ref.error,
        success = _ref.success,
        timeout = _ref.timeout;

    var script = document.createElement('script');
    var fn = jsonp || 'jsonpCallback' + jsonPUID++;

    var data, timeout;

    script.src = url.replace(_core2.default.regexp.callback, '?$1=' + fn);

    script.onerror = function () {
      xhr.abort();
      error.call(context, null, 'error');
    };

    script.onload = function () {
      if (_core2.default.isFunction(success)) {
        success.call(context, data[0]);
      }

      script.parentNode.removeChild(script);

      timeout && clearTimeout(timeout) && (timeout = null);

      try {
        delete window[fn];
      } catch (e) {
        window[fn] = null;
      }

      data = null;
    };

    document.head.appendChild(script);

    window[fn] = function () {
      data = arguments;
    };

    if (timeout > 0) {
      timeout = setTimeout(function () {
        script.parentNode.removeChild(script);

        if (fn in window) {
          window[fn] = emptyFn;
        }

        error.call(context, null, 'timeout');
        xhr.abort();
      }, timeout);
    }

    return {};
  },

  /**
   * Append additonal params to a URL query string
   * @param  {String} url     The URL to append the new items to
   * @param  {String} query   The additional query params
   * @return {String}         The new query string
   */
  appendQuery: function appendQuery(url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
  },

  /**
   * Convert query string to key/value pairing
   * @param  {String} query The URL containing the params
   * @return {Object}       The new object containing the key value pairs from the query string
   */
  deparam: function deparam(query) {
    var result = {};

    if (!query) {
      return result;
    }

    _core2.default.each('' + query.split('&'), function (index, value) {
      if (value) {
        var param = value.split('=');
        result[param[0]] = param[1];
      }
    });

    return result;
  },

  /**
   * Helper function to convert our data object to a valid URL query string
   * @param  {Object} data    The object containing all our query data
   * @return {String}         The query string
   */
  params: function params(data) {
    return _core2.default.serialize([], data).join('&'); //.replace('%20', '+');
  },

  /**
   * Build query string from passed data arguments
   * @param  {Array}  params  The array to store our key = value pairs in
   * @param  {Object} data    The object containing the query data
   * @param  {String} scope   The scope of the params
   * @return {Array}          The updated params array
   */
  serialize: function serialize(params, data, scope) {
    var array = _core2.default.isArray(data);
    var escape = encodeURIComponent;

    _core2.default.each(data, function (key, value) {
      if (scope) {
        key = scope + '[' + (array ? '' : key) + ']';
      }

      if (_core2.default.isPlainObject(value)) {
        _core2.default.serialize(params, value, key);
      } else {
        params.push(escape(key) + '=' + escape(value));
      }
    });

    return params;
  }
});

/**
 * Shortcut GET request methods
 * @param  {String}   url     The request URL
 * @param  {Object}   data    The hash map of key/value pairs that will be sent with the request (optional)
 * @param  {Function} success The success callback function
 * @param  {Function} error   The failure callback function
 */
['get', 'getJSON'].forEach(function (method, index) {
  _core2.default[method] = function (url, data) {
    var success = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFn;
    var error = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFn;

    if (_core2.default.isFunction(data)) {
      error = success;
      success = data;
      data = {};
    }

    return _core2.default.ajax({ url: url, data: data, success: success, error: error, dataType: index === 0 ? 'html' : 'json' });
  };
});

exports.default = _core2.default;

},{"./core":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parser = function parser(command) {
  command = command.replace(_core2.default.regexp.escapeRegExp, '\\$&').replace(_core2.default.regexp.optionalParam, '(?:$1)?').replace(_core2.default.regexp.namedParam, function (match, optional) {
    return optional ? match : '([^\\s]+)';
  }).replace(_core2.default.regexp.splatParam, '(.*?)').replace(_core2.default.regexp.optionalRegex, '\\s*$1?\\s*');

  return new RegExp('^' + command + '$', 'i');
};

exports.default = parser;

},{"./core":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _commandParser = require('./commandParser');

var _commandParser2 = _interopRequireDefault(_commandParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Add one or more commands to Eleven's registry
   *
   * Example:
   *
   * var agent = Eleven();
   *
   * // add multiple commands
   * agent.addCommands({
   *   'hello :name': fn,
   *   'hey (there)': fn,
   *   'hi': fn
   * });
   *
   * // or you can add a single command
   * agent.addCommands('hi', fn);
   *
   * @param  {Object} commands Object containing commands and their callbacks
   * @return {Object}          Eleven instance
   */
  addCommands: function addCommands(commands) {
    var command = {};

    if (typeof commands === 'string' && arguments[1]) {
      command[commands] = arguments[1];
      commands = command;
    }

    for (var phrase in commands) {
      command = commands[phrase];

      if (command) {
        if (_core2.default.isFunction(command)) {
          this.registerCommands(phrase, (0, _commandParser2.default)(phrase), command);
        } else if (_core2.default.isObject(command) && _core2.default.isRegExp(command.regexp)) {
          this.registerCommands(phrase, new RegExp(command.regexp.source, 'i'), command.callback);
        } else {
          if (this.options.debug) {
            console.debug('[Eleven] Command registration failed: ' + phrase);
          }
        }
      }
    }

    return this;
  },

  /**
   * Adds the passed command to the command list
   * @param {String}   phrase   String continaing the command to listen for
   * @param {String}   command  String representing the RegExp for the command
   * @param {Function} callback Function to execute when command has been invoked
   */
  registerCommands: function registerCommands(phrase, command, callback) {
    this.commands[phrase] = {
      callback: callback,
      phrase: phrase,
      regexp: command
    };

    if (this.options.debug) {
      console.debug('[Eleven] Command registered: ' + phrase);
    }
  },

  /**
   * Remove one or more commands from Eleven's registry
   *
   * Example:
   *
   * var agent = Eleven();
   *
   * agent.addCommands({
   *   'hello :name': fn,
   *   'hey (there)': fn,
   *   'hi': fn
   * });
   *
   * // remove a single command
   * agent.removeCommands('hi');
   *
   * // remove multiple commands
   * agent.removeCommands(['hello :name', 'hi']);
   *
   * //remove all commands
   * agent.removeCommands();
   *
   * @param  {Mixed} commands String or Array containing commands to remove from the command list
   * @return {Object}         Eleven instance
   */
  removeCommands: function removeCommands(commands) {
    var currentCommmands = this.commands;

    if (commands === undefined) {
      return (this.commands = []) && this;
    }

    if (typeof command === 'string') {
      commands = [commands];
    }

    _core2.default.each(commands, function (command) {
      if (currentCommmands[command]) {
        delete currentCommmands[command];
      }
    });

    return this;
  }
});

exports.default = _core2.default;

},{"./commandParser":2,"./core":4}],4:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

var _speechRecognition = require('./speechRecognition');

var _speechRecognition2 = _interopRequireDefault(_speechRecognition);

var _speechSynthesis = require('./speechSynthesis');

var _speechSynthesis2 = _interopRequireDefault(_speechSynthesis);

var _speechSynthesisOverrides = require('./speechSynthesisOverrides');

var _speechSynthesisOverrides2 = _interopRequireDefault(_speechSynthesisOverrides);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var slice = [].slice;
var _ref = {},
    toString = _ref.toString;
var _trim = String.prototype.trim;

var class2type = {};

var initialized = null;

/**
 * Eleven
 * @constructor
 * @param  {Object} options Object containing Eleven's configuration
 * @return {Object}         Eleven instance
 */
var $ = function $(selector, options) {
  return initialized || new $.fn.init(selector, options);
};

$.fn = $.prototype = {
  constructor: $,
  version: '1.0.0',
  init: function init(selector, options) {
    var defaultConfig = {
      debug: false,
      language: 'en-US',
      commands: [],
      autoRestart: true,
      continuous: true,
      interimResults: true,
      maxAlternatives: 5,
      requiresWakeWord: true,
      synthesisAgent: 'Google UK English Female',
      wakeCommands: ['eleven', '11'],
      wakeSound: 'https://s3-us-west-1.amazonaws.com/voicelabs/static/chime.mp3',
      wakeCommandWait: 10000,
      template: '\n         <div class="eleven-container">\n          <div class="eleven-container-inner">\n            <div class="eleven-off">\n              <span>ELEVEN</span>\n            </div>\n            <div class="eleven-on">\n              <div class="bg"></div>\n              <div class="waves"></div>\n            </div>\n          </div>\n        </div>\n      '
    };
    // create a ref to the container element
    this.container = _document2.default.querySelector(selector);
    // store options
    this.options = $.extend({}, defaultConfig, options || {});
    // create markup
    this.container.innerHTML = this.options.template;
    // reference to all of our commands
    this.commands = [];
    // reference hash for installed plugins
    this.plugins = {};
    // create audio sound
    this.wakeSound = new Audio(this.options.wakeSound);
    // buffer restarts and prevent insanity
    this.lastStartTime = this.restartCount = 0;
    // used to manage eventing
    this.listening = false;
    // create interactive audio wave orb (aka Eleven)
    this.visualize();
    // prevent initialize until called
    if (!this.options.delayStart) {
      // enable all the things!
      this.enable();
    }
    // print the instance config
    if (this.options.debug) {
      $.debug = true;
      console.debug(this);
    }
    // allow single instance (Speech API does not support multiple instances yet)
    initialized = this;
    // always return this for chaining
    return this;
  }
};

/**
 * Shallow copies all properties from the config object to the target object
 * @param  {Object} target   The receiving object you want to apply the config properties to
 * @param  {Object} config   The source object containing the new or updated default properties
 * @param  {Object} defaults The default values object (optional)
 * @return {Object}          The target object
 */
$.apply = function (target, config, defaults) {
  defaults && $.apply(target, defaults);

  if (target && config && (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
    for (var i in config) {
      target[i] = config[i];
    }
  }

  return target;
};

$.apply($, {
  indexOf: _utils.indexOf,
  plugins: {},
  each: function each(collection, fn) {
    if (typeof collection === 'function') {
      fn = collection;
      collection = this;
    }

    if (typeof collection.length === 'number') {
      (0, _utils.each)(collection, function (item, index) {
        return fn.call(item, item, index);
      });
    } else if ((typeof collection === 'undefined' ? 'undefined' : _typeof(collection)) === 'object') {
      for (var key in collection) {
        var result = fn.call(collection[key], key, collection[key]);

        if (result === false) {
          break;
        }
      }
    }

    return this;
  },

  /**
   * Merge the contents of two or more objects into the target object
   * @param  {Boolean} deep      If true, the merge becomes recursive (optional)
   * @param  {Object}  target    Object receiving the new properties
   * @param  {Object}  arguments One or more additional objects to merge with the first
   * @return {Object}            The target object with the new contents
   */
  extend: function extend() {
    var i = 1,
        deep = false,
        target = arguments[0] || {},
        length = arguments.length;

    if ($.isBoolean(target)) {
      deep = target;
      target = arguments[1] || {};
      i++;
    }

    if (i === length) {
      target = this;
      i--;
    }

    $.each(slice.call(arguments, i), function (obj) {
      var src, copy, isArray, clone;

      if (obj === target) {
        return;
      }

      if (deep && $.isArray(obj)) {
        target = target.concat(obj);
      } else {
        for (var key in obj) {
          src = target[key];
          copy = obj[key];

          if (target === copy || src === copy) {
            continue;
          }

          if (deep && copy && ($.isPlainObject(copy) || (isArray = $.isArray(copy)))) {
            if (isArray) {
              isArray = false;
              clone = src && $.isArray(src) ? src : [];
            } else {
              clone = src && $.isPlainObject(src) ? src : {};
            }

            target[key] = $.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[key] = copy;
          }
        }
      }
    });

    return target;
  },

  /**
   * Determines whether the array contains a specific value
   * @param  {Mixed}   item     The item to look for in the array
   * @param  {String}  array    The array of items
   * @param  {Boolean} position Set true to return the index of the matched item or -1
   * @return {Mixed}            The value of true or false, or the index at which the value can be found
   */
  inArray: function inArray(item, array, position) {
    var result;
    return $.isArray(array) ? (result = (0, _utils.indexOf)(array, item)) && (position ? result : result !== -1) : -1;
  },

  /**
   * Determines whether the passed object is a number
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isNumber: function isNumber(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
  },

  /**
   * Determines whether the passed object is numeric
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isNumeric: function isNumeric(obj) {
    return !$.isArray(obj) && obj - parseFloat(obj) >= 0;
  },

  /**
   * Determine whether an Object is a plain object or not (created using "{}" or "new Object")
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isPlainObject: function isPlainObject(obj) {
    return $.isObject(obj) && !$.isWindow(obj) && !obj.nodeType && Object.getPrototypeOf(obj) === Object.prototype;
  },

  /**
   * Determines whether the passed object is the Window object
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isWindow: function isWindow(obj) {
    return obj !== null && obj === global;
  },

  /**
   * Parses a string as JSON, optionally transforming the value produced by parsing
   * @param  {String}   text    The string to parse as JSON
   * @param  {Function} reviver The transform function to execute on each key-value pair of the parsed object (optional)
   * @return {Object}           The parsed JSON string
   */
  parseJSON: function parseJSON(text, reviver) {
    try {
      return JSON.parse('' + text, reviver);
    } catch (error) {
      throw 'Error occurred while trying to parse JSON string: ' + error;
    }
  },

  /**
   * Parse a string as XML
   * @param  {String} xml The XML string to parse
   * @return {Object}     The DOM XML Object
   */
  parseXML: function parseXML(xml) {
    var parsed;

    if (!xml || typeof xml !== 'string') {
      return null;
    }

    try {
      parsed = new DOMParser().parseFromString(xml, 'text/xml');
    } catch (error) {
      parsed = null;
    }

    if (!parsed || parsed.getElementsByTagName('parsererror').length) {
      throw Error('Invalid XML: ' + xml);
    }

    return parsed;
  },

  /**
   * Adds plugin to the plugin registry for any Eleven instance to bind to
   * @param {String}  name String containing the plugins unique name
   * @param {Functio} fn   Constructor function of plugin
   */
  plugin: function plugin(name, fn) {
    if (!this.plugins[name]) {
      if (!$.isFunction(fn)) {
        throw '"' + name + '" does not have a constructor.';
      } else {
        this.plugins[name] = fn;
      }
    }

    return this;
  },

  /**
   * Executes a function within a specific scope
   * @param  {Function} fn    The function whose scope will change
   * @param  {Object}   scope The scope in which the function should be called
   * @return {Function}       The function with the modified scope
   */
  proxy: function proxy(fn, scope) {
    var args = slice.call(arguments, 2);

    return $.isFunction(fn) ? function proxy() {
      return fn.apply(scope || this, [].concat(_toConsumableArray(args), Array.prototype.slice.call(arguments)));
    } : undefined;
  },

  /**
   * Executes the passed function when the DOM is "ready"
   * @param {Function} fn The function to execute
   */
  ready: function ready(fn) {
    if ($.regexp.readyState.test(_document2.default.readyState)) {
      fn.call();
    } else {
      _document2.default.addEventListener('DOMContentLoaded', fn, false);
    }

    return this;
  },

  /**
   * Removes all rendered elements from the viewport and executes a callback
   * @param  {Function} fn Function to execute once the view has been cleared
   */
  resetView: function resetView() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.results';
    var fn = arguments[1];

    if ($.isFunction(selector)) {
      fn = selector;
      selector = '.results';
    }

    var results = _document2.default.querySelectorAll(selector);

    if (results && results.length) {
      results.forEach(function (element) {
        return element.parentNode && element.parentNode.removeChild(element);
      });
    }

    if ($.isFunction(fn)) {
      fn();
    }

    return this;
  },

  /**
   * Converts a value to JSON, optionally replacing values if a replacer function is specified
   * @param  {Mixed}  value    Value to convert to a JSON string
   * @param  {Mixed}  replacer Transforms values and properties encountered while stringifying (optional)
   * @param  {Mixed}  spaces   Causes the resulting string to be pretty-printed
   * @return {String}          The JSON string
   */
  stringify: function stringify(value, replacer, spaces) {
    return JSON.stringify(value, replacer, spaces);
  },

  /**
   * Removes newlines, spaces (including non-breaking), and tabs from a text string
   * @param  {String} text The text string to trim
   * @return {String}      The modified string
   */
  trim: function trim(text) {
    return text === null ? '' : _trim && _trim.call(text) || ('' + text).replace($.regexp.trim, '');
  },

  /**
   * Returns the internal JavaScript [Class]] of an Object
   * @param  {Object} obj Object to check the class property of
   * @return {String}     Only the class property of the Object
   */
  type: function type(obj) {
    return obj === null ? String(obj) : class2type[toString.call(obj)] || 'object';
  },

  /**
   * Generates a random RFC4122 UUID
   * @return {String} String containing the unique hash
   */
  uuid: function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
});

/**
 * Creates type class check methods $.isArray(), $.isBoolean(), ...
 * @param  {Object}  obj The Object to type check
 * @return {Boolean}     The value of true or false
 */
$.each(['Array', 'Boolean', 'Date', 'Error', 'Function', 'Object', 'RegExp', 'String'], function (name) {
  class2type['[object ' + name + ']'] = name.toLowerCase();

  $['is' + name] = function (obj) {
    return $.type(obj) === name.toLowerCase();
  };
});

$.fn.init.prototype = $.fn;

$.apply($.fn, {
  each: $.each,
  extend: $.extend,
  /**
   * Plugin cache
   * @type {Object}
   */
  plugins: {},
  /**
   * Returns the specified plugin
   * @param  {String} name String containing the plugins unique name
   * @return {Object}      The plugin instance
   */
  getPlugin: function getPlugin(name) {
    if (!this.plugins[name]) {
      throw '"' + name + '" plugin does not exist!';
    }

    return this.plugins[name];
  },

  /**
   * Registers a plugin with a given Eleven instance
   * @param {String} name    String containing the plugins unique name
   * @param {Object} options Object containing the options for that plugin
   * @type {Object}          Eleven
   */
  plugin: function plugin(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!this.plugins[name] && $.plugins[name]) {
      if (options.commands) {
        this.addCommands(options.commands);
      }

      this.plugins[name] = new $.plugins[name](options);
    } else {
      throw '"' + name + '" plugin does not exist!';
    }

    return this;
  },

  /**
   * Iterates over a collection of objects
   * @param {Mixed}    collection Collection to iterate over
   * @param {Function} fn         Callback function
   */
  error: function error(event) {
    var error = event.error;


    if (error === 'not-allowed' || error === 'network') {
      this.options.autoRestart = false;
    }

    if (this.options.debug) {
      console.warn('[Eleven] SpeechRecognition event error: ' + error);
    }
  },

  /**
   * Initializes the SpeechRecognition API, adds commands and binds event
   * listeners. To avoid overlap with other tabs listening we used the
   * `pagevisibility` API to abort the inactive tab instance.
   * @return {Object} Eleven instance
   */
  enable: function enable() {
    var _this = this;

    var options = this.options;
    // reference to SpeechRecognition instance
    this.recognition = new _speechRecognition2.default();
    // set language
    if (options.lang) {
      this.recognition.lang = options.lang;
    }
    // set max alternative results
    this.recognition.maxAlternatives = options.maxAlternatives;
    // set continuous listening
    this.recognition.continuous = options.continuous;
    // return results immediately so we can emulate audio waves
    this.recognition.interimResults = options.interimResults;
    // add commands
    this.addCommands({
      '*msg': options.onCommand,
      'stop': function stop() {
        if (_this.listening) {

          $.resetView(function () {
            _document2.default.body.classList.remove('interactive');
          });

          _this.stop();
        }
      }
    });

    // load user defined commands
    if (options.commands) {
      this.addCommands(options.commands);
    }
    // setup all SpeechRecognition event listeners
    this.listen();
    // fire activation event
    if ($.isFunction(options.onActivate)) {
      options.onActivate.call(this);
    }
    // setup speech synthesis
    _speechSynthesis2.default.onvoiceschanged = function () {
      $.supportedVoices = _speechSynthesis2.default.getVoices();
    };
    // hack to fix issues with Chrome
    setTimeout(function () {
      if (!_speechSynthesis2.default) {
        console.warn('[Eleven] Voice synthesis is not supported.');
      } else {
        $.supportedVoices = _speechSynthesis2.default.getVoices();

        if ($.supportedVoices.length > 0) {
          $.mappedSupportedVoices = $.supportedVoices.slice().reduce(function (obj, item) {
            var overrides = _speechSynthesisOverrides2.default[item.name] || {};

            obj[item.name] = $.extend({}, item, overrides, { suppportedVoice: item });

            return obj;
          }, {});

          $.synthesisAgent = $.mappedSupportedVoices[options.synthesisAgent];
        }
      }
    }, 500);

    var autoRestartConfig = options.autoRestart;

    _document2.default.addEventListener('visibilitychange', function () {
      if (_document2.default.hidden) {
        if (_this.recognition && _this.recognition.abort && _this.listening) {
          if (_this.debug) {
            console.debug('[Eleven] User switched to another tab. Disabling listeners.');
          }

          _this.options.autoRestart = false;
          _this.stop();
          _this.recognition.abort();
        }
      } else {
        if (_this.recognition && !_this.listening) {
          if (_this.debug) {
            console.debug('[Eleven] User switched back to this tab. Enabling listeners.');
          }

          _this.options.autoRestart = autoRestartConfig;
          _this.start();
        }
      }
    });

    this.restart();

    return this;
  },

  /**
   * Binds callback functions to `onstart`, `onerror`, `onresult`,
   * `onend` and `onaudioend` of SpeechRecognition API.
   */
  listen: function listen() {
    var _this2 = this;

    this.recognition.onend = $.proxy(this.stop, this);
    this.recognition.onerror = $.proxy(this.error, this);
    this.recognition.onresult = $.proxy(this.result, this);
    this.recognition.onstart = $.proxy(this.start, this);
    this.recognition.onaudioend = $.proxy(this.stop, this);
    this.recognition.onaudiostart = function () {
      if ($.isFunction(_this2.options.onStart)) {
        _this2.options.onStart.call(_this2);
      }
    };
  },
  parser: function parser(results) {
    var _this3 = this;

    var options = this.options;

    if ($.isFunction(options.onResult)) {
      options.onResult.call(this, results);
    }

    setTimeout(function () {
      if (_this3.running && _this3.visualizer) {
        _this3.running = false;
        _this3.visualizer.stop();
      }

      _this3.container.classList.remove('ready');
      _this3.activated = false;
    }, 750);

    for (var i = 0, k = results.length; i < k; i++) {
      var recognizedSpeech = results[i].trim();

      if (options.debug) {
        console.debug('[Eleven] Speech recognized: ', recognizedSpeech);
      }

      for (var item in this.commands) {
        var command = this.commands[item];
        var phrase = command.phrase;
        var result = command.regexp.exec(recognizedSpeech);

        if (result) {
          var parameters = result.slice(1);

          if (options.debug) {
            console.debug('[Eleven] Command match: ' + phrase);

            if (parameters.length) {
              console.debug('[Eleven] Command has parameters: ' + JSON.stringify(parameters, null, 2));
            }
          }

          command.callback.call(this, parameters, recognizedSpeech, phrase);

          if ($.isFunction(options.onResultMatch)) {
            options.onResultMatch.call(this, parameters, recognizedSpeech, phrase, results);
          }

          this.container.classList.remove('ready');

          this.activated = false;

          return;
        }
      }
    }

    if ($.isFunction(options.onResultNoMatch)) {
      options.onResultNoMatch.call(this, results);
    }
  },
  result: function result(event) {
    var _this4 = this;

    var result = event.results[event.resultIndex];
    var results = [];

    if (this.options.wakeCommands.indexOf(result[0].transcript.trim()) !== -1) {
      if (!this.activated) {
        this.activated = true;
        this.container.classList.add('ready');
        this.wakeSound.play();

        this.commandTimer = setTimeout(function () {
          _this4.activated = false;
          _this4.container.classList.remove('ready');
        }, this.options.wakeCommandWait);
      }
    } else {
      if (this.activated) {
        if (!this.running && this.visualizer) {
          this.running = true;
          this.visualizer.start();
          clearTimeout(this.commandTimer);
        }

        for (var i = 0, k = result.length; i < k; i++) {
          if (result.isFinal) {
            results[i] = result[i].transcript.trim();
          }
        }

        if (results.length) {
          this.parser(results);
        }
      }
    }
  },
  restart: function restart() {
    var _this5 = this;

    var timeSinceLastStart = new Date().getTime() - this.lastStartTime;

    this.restartCount += 1;

    if (this.restartCount % 10 === 0) {
      if (this.options.debug) {
        console.debug('[Eleven] Speech Recognition is repeatedly stopping and starting.');
      }
    }

    if (timeSinceLastStart < 1000) {
      setTimeout(function () {
        _this5.start();
      }, 1000 - timeSinceLastStart);
    } else {
      this.start();
    }
  },
  start: function start() {
    if (!this.listening) {
      this.listening = true;

      this.lastStartTime = new Date().getTime();

      try {
        this.recognition.start();
      } catch (e) {
        if (this.options.debug) {
          console.warn('[Eleven] Error trying to start SpeechRecognition: ' + e.message);
        }
      }
    }

    return this;
  },
  stop: function stop() {
    if (this.listening) {
      this.listening = false;

      if (this.running && this.visualizer) {
        this.running = false;
        this.visualizer.stop();
      }

      if ($.isFunction(this.options.onEnd)) {
        this.options.onEnd.call(this);
      }

      if (this.options.autoRestart) {
        this.restart();
      }
    }

    return this;
  }
});

exports.default = $;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./document":5,"./speechRecognition":10,"./speechSynthesis":11,"./speechSynthesisOverrides":12,"./utils":13,"./window":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _window2.default.document;

},{"./window":15}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

require('./ajax');

require('./commands');

require('./regexp');

require('./speech');

require('./visualizer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _core2.default;

},{"./ajax":1,"./commands":3,"./core":4,"./regexp":8,"./speech":9,"./visualizer":14}],7:[function(require,module,exports){
'use strict';

var _eleven = require('./eleven');

var _eleven2 = _interopRequireDefault(_eleven);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (root) {
  return root.Eleven = _eleven2.default;
})(window);

},{"./eleven":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.regexp = {
  callback: /\?(.+)=\?/,
  escapeRegExp: /[\-{}\[\]+?.,\\\^$|#]/g,
  optionalParam: /\s*\((.*?)\)\s*/g,
  optionalRegex: /(\(\?:[^)]+\))\?/g,
  namedParam: /(\(\?)?:\w+/g,
  readyState: /^(?:complete|loaded|interactive)$/i,
  splatParam: /\*\w+/g,
  trim: /^\s+|\s+$/g,
  whitespaces: /^\s*$/g
};

exports.default = _core2.default;

},{"./core":4}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _speechSynthesis = require('./speechSynthesis');

var _speechSynthesis2 = _interopRequireDefault(_speechSynthesis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.speak = function (text) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var cancelled = false;
  // clean up text
  text = text.replace(/[\"\`]/gm, '\'');
  // split our phrases into 120 character chunks
  var chunks = text.match(/.{1,140}\s+/g);
  // find voice profile
  var agent = _core2.default.synthesisAgent;

  if (!_speechSynthesis2.default) {
    throw '[Eleven] Speech Synthesis is not supported on this device.';
  }

  if (speechSynthesis.speaking) {
    cancelled = true;
    speechSynthesis.cancel();
  }

  chunks.forEach(function (text, index) {
    // create new utterance
    var speechUtterance = new SpeechSynthesisUtterance();

    _core2.default.extend(speechUtterance, {
      voice: agent.suppportedVoice,
      voiceURI: agent.voiceURI,
      volume: agent.volume || 1,
      rate: agent.rate || 1,
      pitch: agent.pitch || 1,
      text: text,
      lang: agent.lang,
      rvIndex: index,
      rvTotal: chunks.length
    });

    if (index == 0) {
      speechUtterance.onstart = function () {
        if (_core2.default.isFunction(config.onStart)) {
          config.onStart();
        }
      };
    }

    if (index == chunks.length - 1) {
      speechUtterance.onend = function () {
        // prevent this from being triggered when invoking speechSynthesis.cancel
        if (cancelled === true) {
          cancelled = false;
          return;
        }

        if (_core2.default.isFunction(config.onEnd)) {
          config.onEnd();
        }
      };
    }

    speechUtterance.onerror = function (e) {
      console.log('[Eleven] Unknow Error: ' + e);
    };

    speechSynthesis.speak(speechUtterance);
  });
};

exports.default = _core2.default;

},{"./core":4,"./speechSynthesis":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _window2.default.SpeechRecognition || _window2.default.webkitSpeechRecognition || _window2.default.mozSpeechRecognition || _window2.default.msSpeechRecognition || _window2.default.oSpeechRecognition;

},{"./window":15}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _window2.default.speechSynthesis;

},{"./window":15}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var configs = {
  'Alex': { rate: 1 },
  'Alice': {},
  'Alva': {},
  'Amelie': {},
  'Anna': {},
  'Carmit': {},
  'Damayanti': {},
  'Daniel': {},
  'Diego': {},
  'Ellen': {},
  'Fiona': {},
  'Fred': {},
  'Ioana': {},
  'Joana': {},
  'Jorge': {},
  'Juan': {},
  'Kanya': {},
  'Karen': {},
  'Kyoko': {},
  'Laura': {},
  'Lekha': {},
  'Luca': {},
  'Luciana': {},
  'Maged': {},
  'Mariska': {},
  'Mei-Jia': {},
  'Melina': {},
  'Milena': {},
  'Moira': {},
  'Monica': {},
  'Nora': {},
  'Paulina': {},
  'Samantha': {},
  'Sara': {},
  'Satu': {},
  'Sin-ji': {},
  'Tessa': {},
  'Thomas': {},
  'Ting-Ting': {},
  'Veena': {},
  'Victoria': {},
  'Xander': {},
  'Yelda': {},
  'Yuna': {},
  'Yuri': {},
  'Zosia': {},
  'Zuzana': {},
  'Google Deutsch': {},
  'Google US English': {},
  'Google UK English Female': {},
  'Google UK English Male': {},
  'Google español': {},
  'Google español de Estados Unidos': {},
  'Google français': {},
  'Google हिन्दी': {},
  'Google Bahasa Indonesia': {},
  'Google italiano': {},
  'Google 日本語': {},
  'Google 한국의': {},
  'Google Nederlands': {},
  'Google polski': {},
  'Google português do Brasil': {},
  'Google русский': {},
  'Google 普通话（中国大陆': {},
  'Google 粤語（香港）': {},
  'Google 國語（臺灣）': {}
};

exports.default = configs;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var indexOf = function indexOf(collection, item) {
  var k = collection.length;
  var i = 0;

  for (; i < k; i++) {
    if (collection[i] === item) {
      return i;
    }
  }

  return -1;
};

var each = function each(collection, fn) {
  var k = collection.length;
  var i = 0;

  for (; i < k; i++) {
    var result = fn.call(collection[i], collection[i], i);

    if (result === false) {
      break;
    }
  }
};

var noop = function noop() {};

exports.indexOf = indexOf;
exports.each = each;
exports.noop = noop;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  visualize: function visualize() {
    this.visualizer = new Visualizer(this);
  },

  /**
   * Returns the visualizer DOM Element and the instance
   * @param  {String} String containing either 'DOM' or 'instance'
   * @return {Array}  containing the container DOM element and instance
   */
  getVisualizer: function getVisualizer(property) {
    if (this.visualizer[property]) {
      return this.visualizer[property];
    }

    return this.visualizer;
  }
});

/*------------------------------------
 * Visualization
 ------------------------------------*/

function Curve(opt) {
  opt = opt || {};
  this.controller = opt.controller;
  this.color = opt.color;
  this.tick = 0;
  this.respawn();
}

_core2.default.apply(Curve.prototype, {
  respawn: function respawn() {
    this.amplitude = .3 + Math.random() * .7;
    this.seed = Math.random();
    this.openClass = 2 + Math.random() * 3 | 0;
  },
  equation: function equation(i) {
    var p = this.tick,
        y = -1 * Math.abs(Math.sin(p)) * this.controller.amplitude * this.amplitude * this.controller.MAX * Math.pow(1 / (1 + Math.pow(this.openClass * i, 2)), 2);

    if (Math.abs(y) < 0.001) {
      this.respawn();
    }

    return y;
  },
  paint: function paint(m) {
    var context = this.controller.context;
    var width = this.controller.width;
    var xBase = width / 2 + (-width / 4 + this.seed * (width / 2));
    var yBase = this.controller.height / 2;
    var x,
        y,
        xInitial,
        i = -3;

    this.tick += this.controller.speed * (1 - .5 * Math.sin(this.seed * Math.PI));

    context.beginPath();

    while (i <= 3) {
      x = xBase + i * width / 4;
      y = yBase + m * this.equation(i);
      xInitial = xInitial || x;

      context.lineTo(x, y);

      i += .01;
    }

    var h = Math.abs(this.equation(0));
    var gradient = context.createRadialGradient(xBase, yBase, h * 1.15, xBase, yBase, h * .3);
    var color = this.color.join(',');

    gradient.addColorStop(0, 'rgba(' + color + ', .4)');
    gradient.addColorStop(1, 'rgba(' + color + ', .2)');
    // set gradient
    context.fillStyle = gradient;
    // add glow
    context.shadowColor = 'rgba(' + color + ', .8)';
    context.shadowBlur = 50;

    context.lineTo(xInitial, yBase);
    context.closePath();
    context.fill();
  },
  draw: function draw() {
    this.paint(-1);
    this.paint(1);
  }
});

function Visualizer(config) {
  var options = {
    height: 140,
    ratio: 2,
    wavesContainer: '.waves',
    width: 280
  };

  this.container = config.container;
  this.curves = [];
  this.tick = 0;
  this.run = false;
  this.cover = options.cover || true;
  this.ratio = options.ratio || window.devicePixelRatio || 1.2;
  this.width = this.ratio * (options.width || 320);
  this.height = this.ratio * (options.height || 100);
  this.MAX = this.height / 2;
  this.speed = .08;
  this.amplitude = .7;

  this.speedInterpolationSpeed = 0.005;
  this.amplitudeInterpolationSpeed = 0.05;

  this.interpolation = {
    speed: this.speed,
    amplitude: this.amplitude
  };

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  if (options.cover) {
    this.canvas.style.width = this.canvas.style.height = '100%';
  } else {
    this.canvas.style.width = this.width / this.ratio + 'px';
    this.canvas.style.height = this.height / this.ratio + 'px';
  };

  this.wavesContainer = this.container.querySelector(options.wavesContainer);

  this.wavesContainer.appendChild(this.canvas);

  this.context = this.canvas.getContext('2d');

  for (var i = 0; i < this.colors.length; i++) {
    var color = this.colors[i];

    for (var j = 0; j < 3 * Math.random() | 0; j++) {
      this.curves.push(new Curve({
        controller: this,
        color: color
      }));
    }
  }
}

_core2.default.apply(Visualizer.prototype, {
  colors: [[32, 133, 252], [94, 252, 169], [253, 71, 103]],

  clear: function clear() {
    this.context.globalCompositeOperation = 'destination-out';
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.globalCompositeOperation = 'lighter';
  },
  interpolate: function interpolate(propertyStr) {
    var increment = this[propertyStr + 'InterpolationSpeed'];

    if (Math.abs(this.interpolation[propertyStr] - this[propertyStr]) <= increment) {
      this[propertyStr] = this.interpolation[propertyStr];
    } else {
      if (this.interpolation[propertyStr] > this[propertyStr]) {
        this[propertyStr] += increment;
      } else {
        this[propertyStr] -= increment;
      }
    }
  },
  paint: function paint() {
    for (var i = 0, k = this.curves.length; i < k; i++) {
      this.curves[i].draw();
    }
  },
  startDrawCycle: function startDrawCycle() {
    if (this.run === false) {
      return;
    }

    this.clear();

    this.interpolate('amplitude');
    this.interpolate('speed');

    this.paint();
    this.phase = (this.phase + Math.PI * this.speed) % (2 * Math.PI);

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.startDrawCycle.bind(this));
    } else {
      setTimeout(this.startDrawCycle.bind(this), 20);
    }
  },
  setAmplitude: function setAmplitude(value) {
    this.interpolation.amplitude = Math.max(Math.min(value, 1), 0);
  },
  setSpeed: function setSpeed(value) {
    this.interpolation.speed = value;
  },
  start: function start() {
    this.tick = 0;
    this.run = true;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.wavesContainer.parentNode.classList.add('speaking');
    this.canvas.classList.add('fadein');

    this.startDrawCycle();
  },
  stop: function stop() {
    this.tick = 0;
    this.run = false;
    this.wavesContainer.parentNode.classList.remove('speaking');
    this.canvas.classList.remove('fadein');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
});

exports.default = _core2.default;

},{"./core":4}],15:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = global;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[7])
//# sourceMappingURL=eleven.js.map
