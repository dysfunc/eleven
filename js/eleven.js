(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _speechRecognition = require('./speech/speechRecognition');

var _speechRecognition2 = _interopRequireDefault(_speechRecognition);

var _document = require('./common/document');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Iterates over a collection of objects
   * @param {Mixed}    collection Collection to iterate over
   * @param {Function} fn         Callback function
   */
  error: function error(event) {
    var error = event.error;


    if (error === 'no-speech' || error === 'aborted') {
      this.start();
    } else {
      if (this.options.debug) {
        console.warn('[Eleven] SpeechRecognition event error: ' + error);
      }
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
    this.recognition.lang = options.language;
    // set max alternative results
    this.recognition.maxAlternatives = options.maxAlternatives;
    // set continuous listening
    this.recognition.continuous = options.continuous;
    // return results immediately so we can emulate audio waves
    this.recognition.interimResults = options.interimResults;
    // if true, this will pass all speech back to the onCommand callback
    if (options.useEngine) {
      this.addCommands({
        '*msg': options.onCommand
      });
    }
    // add commands
    this.addCommands('eleven', {
      'stop': function stop() {
        if (_this.listening) {
          _this.stop();

          setTimeout(function () {
            _core2.default.resetView(function () {
              _document.document.body.classList.remove('interactive');
            });
          }, 500);
        }

        if (_core2.default.isFunction(options.onStop)) {
          _this.context = null;
          options.onStop.call(_this);
        }
      }
    });
    // load user defined commands
    if (options.commands) {
      this.addCommands('eleven', options.commands);
    }
    // check if wake commands exist. if so, create regexp to strip from speech matches
    if (options.wakeCommands.length) {
      _core2.default.regexp.wakeCommands = new RegExp('^(' + options.wakeCommands.join('|') + ')\\s+', 'i');
    }
    // setup all SpeechRecognition event listeners
    this.listen();
    // fire activation event
    if (_core2.default.isFunction(options.onActivate)) {
      options.onActivate.call(this);
    }

    try {
      this.recognition.start();
    } catch (e) {
      if (this.options.debug) {
        console.warn('[Eleven] Error trying to start SpeechRecognition: ' + e.message);
      }
    }

    this.start();

    return this;
  },

  /**
   * Binds callback functions to `onstart`, `onerror`, `onresult`,
   * `onend` and `onaudioend` of SpeechRecognition API.
   */
  listen: function listen() {
    var _this2 = this;

    this.recognition.onend = _core2.default.proxy(this.stop, this);
    this.recognition.onerror = _core2.default.proxy(this.error, this);
    this.recognition.onresult = _core2.default.proxy(this.result, this);
    this.recognition.onstart = _core2.default.proxy(this.start, this);
    this.recognition.onaudioend = _core2.default.proxy(this.stop, this);
    this.recognition.onaudiostart = function () {
      if (_core2.default.isFunction(_this2.options.onStart)) {
        _this2.options.onStart.call(_this2);
      }
    };

    _document.document.addEventListener('visibilitychange', function () {
      if (_document.document.hidden) {
        if (_this2.recognition && _this2.recognition.abort && _this2.listening) {
          if (_this2.debug) {
            console.debug('[Eleven] User switched to another tab. Disabling listeners.');
          }

          _this2.stop();
          _this2.recognition.abort();
        }
      } else {
        _this2.recognition.start();
        _this2.stop();
        _this2.start();
      }
    });
  },
  start: function start() {
    if (!this.listening) {
      this.listening = true;
    }

    return this;
  },
  stop: function stop() {
    if (this.visualizer) {
      this.running = false;
      this.visualizer.stop();
      this.container.classList.remove('ready');
    }

    if (_core2.default.isFunction(this.options.onEnd)) {
      this.options.onEnd.call(this);
    }

    return this;
  }
});

exports.default = _core2.default;

},{"./common/document":6,"./core":13,"./speech/speechRecognition":50}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _window = require('../common/window');

var _window2 = _interopRequireDefault(_window);

var _document = require('../common/document');

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
    context: _document.document,
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
    var callback = _core2.default.regexp.jsonCallback.test(config.url),
        config = _core2.default.extend(true, {}, _core2.default.ajaxSettings, config || {}),
        data = config.data && _core2.default.isObject(config.data) && (config.data = _core2.default.params(config.data)) || null,
        context = config.context,
        contentType = config.contentType || 'application/x-www-form-urlencoded',
        headers = config.headers,
        method = config.type.toUpperCase(),
        mimeType = config.accepts[config.dataType],
        protocol = /^((http|ftp|file)(s?)\:)?/.test(config.url) ? RegExp.$1 : _window2.default.location.protocol,
        type = config.dataType,
        url = config.url || !config.url && (config.url = _window2.default.location.toString()),
        xhr = config.xhr = new _window2.default.XMLHttpRequest();

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

    var script = _document.document.createElement('script');
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
        delete _window2.default[fn];
      } catch (e) {
        _window2.default[fn] = null;
      }

      data = null;
    };

    _document.document.head.appendChild(script);

    _window2.default[fn] = function () {
      data = arguments;
    };

    if (timeout > 0) {
      timeout = setTimeout(function () {
        script.parentNode.removeChild(script);

        if (fn in _window2.default) {
          _window2.default[fn] = emptyFn;
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

},{"../common/document":6,"../common/window":12,"../core":13}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _commandsParser = require('./commandsParser');

var _commandsParser2 = _interopRequireDefault(_commandsParser);

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
   * Add plugin scoped commands when registering them after initializing Eleven
   *
   * agent.plugin('news', {
   *   commands: {
   *     'show me the (top) stories': function(){
   *       // do something when matched
   *     }
   *   }
   * });
   *
   * @param  {Object} context  String containing the commands execution context
   * @param  {Object} commands Object containing commands and their callbacks
   * @return {Object}          Eleven instance
   */
  addCommands: function addCommands(context, commands) {
    var command = {};

    if (typeof context !== 'string') {
      commands = context;
      context = 'eleven';
    }

    for (var phrase in commands) {
      command[context] = commands[phrase];

      if (command[context]) {
        if (_core2.default.isFunction(command[context])) {
          this.registerCommands(context, phrase, (0, _commandsParser2.default)(phrase), command[context]);
        } else if (_core2.default.isObject(command[context]) && _core2.default.isRegExp(command[context].regexp)) {
          this.registerCommands(context, phrase, new RegExp(command[context].regexp.source, 'i'), command[context].callback);
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
   * @param {String}   context   String containing the commands plugin namespace
   * @param {String}   phrase    String continaing the command to listen for
   * @param {String}   command   String representing the RegExp for the command
   * @param {Function} callback  Function to execute when command has been invoked
   */
  registerCommands: function registerCommands(context, phrase, command, callback) {
    if (!this.commands[context]) {
      this.commands[context] = {};
    }

    this.commands[context][phrase] = { callback: callback, phrase: phrase, regexp: command };

    if (this.options.debug) {
      console.debug('[Eleven] Command registered: ' + phrase);
    }
  },

  /**
   * Removes one or more commands from the command registry
   *
   * // remove a single command from Eleven
   * agent.removeCommands('hi');
   *
   * // remove a single command from a plugin
   * agent.removeCommands('news', 'hi');
   *
   * // remove multiple commands from Eleven
   * agent.removeCommands(['hello :name', 'hi']);
   *
   * // remove multiple commands from a plugin
   * agent.removeCommands('news', ['get news', 'todays headlines']);
   *
   * //remove all commands
   * agent.removeCommands();
   *
   * @param  {String} context  String containing the plugin namespace to remove commands from
   * @param  {Mixed}  commands String or Array containing commands to remove from the command list
   * @return {Object}         Eleven instance
   */
  removeCommands: function removeCommands(context, commands) {
    if (context === undefined && commands === undefined) {
      return (this.commands = []) && this;
    }

    if (arguments.length === 1) {
      commands = context;
      context = 'eleven';
    }

    var currentCommmands = this.commands[context];

    if (typeof commands === 'string') {
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

},{"../core":13,"./commandsParser":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parser = function parser(command) {
  command = command.replace(_core2.default.regexp.escapeRegExp, '\\$&').replace(_core2.default.regexp.optionalParam, '(?:$1)?').replace(_core2.default.regexp.namedParam, function (match, optional) {
    return optional ? match : '([^\\s]+)';
  }).replace(_core2.default.regexp.splatParam, '(.*?)').replace(_core2.default.regexp.optionalRegex, '\\s*$1?\\s*');

  return new RegExp('^' + command + '$', 'i');
};

exports.default = parser;

},{"../core":13}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ref = [],
    concat = _ref.concat,
    each = _ref.each,
    filter = _ref.filter,
    forEach = _ref.forEach,
    includes = _ref.includes,
    indexOf = _ref.indexOf,
    pop = _ref.pop,
    push = _ref.push,
    reduce = _ref.reduce,
    slice = _ref.slice,
    splice = _ref.splice,
    reverse = _ref.reverse,
    shift = _ref.shift,
    unshift = _ref.unshift;
exports.concat = concat;
exports.each = each;
exports.filter = filter;
exports.forEach = forEach;
exports.includes = includes;
exports.indexOf = indexOf;
exports.pop = pop;
exports.push = push;
exports.reduce = reduce;
exports.slice = slice;
exports.splice = splice;
exports.reverse = reverse;
exports.shift = shift;
exports.unshift = unshift;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultView = exports.documentElement = exports.document = undefined;

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var document = _window2.default.document;
var documentElement = document.documentElement;
var defaultView = document.defaultView;

exports.document = document;
exports.documentElement = documentElement;
exports.defaultView = defaultView;

},{"./window":12}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = exports.indexOf = exports.getComputedStyle = exports.each = exports.documentFragments = exports.addScript = undefined;

var _window = require('../common/window');

var _window2 = _interopRequireDefault(_window);

var _document = require('../common/document');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var getComputedStyle = _window2.default.getComputedStyle || _document.defaultView && _document.defaultView.getComputedStyle;

var addScript = function addScript(node) {
  var src = node.src && node.src.length > 0;

  try {
    if (!src) {
      (1, eval)(node.innerHTML);
      return node;
    }

    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = node.src;

    return script;
  } catch (error) {
    console.log('There was an error with the script:' + error);
  }
};

/**
 * Use document fragments for faster DOM manipulation
 * @param {Array}   elements  The elements to append to the fragement
 * @param {Object}  container The container element to append the fragment to
 * @param {Boolean} insert    A flag to determine insertion
 */
var documentFragments = function documentFragments(elements, container, insert) {
  var fragment = document.createDocumentFragment(),
      l = elements.length,
      i = l - 1,
      k = 0;

  if (insert) {
    for (; i >= 0; i--) {
      var element = elements[i];

      if (element.nodeName.toLowerCase() === 'script') {
        element = addScript(element);
      }

      fragment.insertBefore(element, fragment.firstChild);
    }

    container.insertBefore(fragment, container.firstChild);
  } else {
    for (; k < l; k++) {
      var element = elements[k];

      if (element.nodeName.toLowerCase() === 'script') {
        element = addScript(element);
      }

      fragment.appendChild(element);
    }

    container.appendChild(fragment);
  }

  fragment = null;
};

exports.addScript = addScript;
exports.documentFragments = documentFragments;
exports.each = each;
exports.getComputedStyle = getComputedStyle;
exports.indexOf = indexOf;
exports.noop = noop;

},{"../common/document":6,"../common/window":12}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vendor = exports.userAgent = exports.navigator = exports.language = undefined;

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var navigator = _window2.default.navigator;

var language = navigator.language,
    userAgent = navigator.userAgent,
    vendor = navigator.vendor;
exports.language = language;
exports.navigator = navigator;
exports.userAgent = userAgent;
exports.vendor = vendor;

},{"./window":12}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ref = {},
    hasOwnProperty = _ref.hasOwnProperty,
    toString = _ref.toString;
exports.hasOwnProperty = hasOwnProperty;
exports.toString = toString;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.regexp = {
  alpha: /[A-Za-z]/,
  browser: /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i,
  callback: /\?(.+)=\?/,
  camel: /-([\da-z])/gi,
  cssNumbers: /^((margin|padding|border)(top|right|bottom|left)(width|height)?|height|width|zindex?)$/i,
  device: /((ip)(hone|ad|od)|playbook|hp-tablet)/i,
  escape: /('|\\)/g,
  fragments: /^\s*<(\w+|!)[^>]*>/,
  jsonCallback: /\?(.+)=\?/,
  jsonString: /^(\{|\[)/i,
  manipulation: /insert|to/i,
  mixed: /^(?:\s*<[\w!]+>|body|head|#\w(?:[\w-]*)|\.\w(?:[\w-]*))$/,
  mobile: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i,
  ms: /^-ms-/,
  nodes: /^(?:1|3|8|9|11)$/,
  numbers: /^(0|[1-9][0-9]*)$/i,
  os: /(android|blackberry|bb10|macintosh|webos|windows)/i,
  protocol: /^((http|ftp|file)(s?)\:)?/,
  queries: /[&?]{1,2}/,
  quotes: /^["']|["']$/g,
  ready: /^(?:complete|loaded|interactive)$/i,
  relative: /^([-+=])/,
  responseOK: /^(20[0-6]|304)$/g,
  root: /^(?:body|html)$/i,
  space: /\s+/g,
  tags: /^[\w-]+$/,
  templates: {
    keys: /\{(\w+)\}/g,
    indexed: /\{(\d+)\}/g
  },
  trim: /^\s+|\s+$/g,
  whitespaces: /^\s*$/g,

  // commands regexp
  escapeRegExp: /[\-{}\[\]+?.,\\\^$|#]/g,
  optionalParam: /\s*\((.*?)\)\s*/g,
  optionalRegex: /(\(\?:[^)]+\))\?/g,
  namedParam: /(\(\?)?:\w+/g,
  readyState: /^(?:complete|loaded|interactive)$/i,
  splatParam: /\*\w+/g,

  // speech splitting
  textChunks: /.{1,140}(?:\s+|\w+)/g
};

exports.default = _core2.default;

},{"../core":13}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var trim = String.prototype.trim;
exports.trim = trim;

},{}],12:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = global;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],13:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = require('./common/window');

var _window2 = _interopRequireDefault(_window);

var _document = require('./common/document');

var _helpers = require('./common/helpers');

var _objects = require('./common/objects');

var _strings = require('./common/strings');

var _arrays = require('./common/arrays');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      requiresWakeWord: true,
      speechAgent: 'Google UK English Female',
      useEngine: false,
      wakeCommands: ['eleven', '11'],
      wakeSound: 'https://s3-us-west-1.amazonaws.com/voicelabs/static/chime.mp3',
      wakeCommandWait: 10000,
      template: '\n         <div class="eleven-container">\n          <div class="eleven-container-inner">\n            <div class="eleven-off">\n              <span>ELEVEN</span>\n            </div>\n            <div class="eleven-on">\n              <div class="bg"></div>\n              <div class="waves"></div>\n            </div>\n          </div>\n        </div>\n      '
    };
    // create a ref to the container element
    this.container = _document.document.querySelector(selector);
    // store options
    this.options = $.extend({}, defaultConfig, options || {});
    // create markup
    this.container.innerHTML = this.options.template;
    // reference to all of our commands
    this.commands = {};
    // reference hash for installed plugins
    this.plugins = {};
    // create audio sound
    this.wakeSound = new Audio(this.options.wakeSound);
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
    // configure speechSynthesis voices
    this.voices();
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

// type check cache
var class2type = {};

$.apply($, {
  /**
   * Converts a dasherized strings to camelCase
   * @param  {String} str The string to modify
   * @return {String}     The modified string
   */
  camelCase: function camelCase(str) {
    return str.trim().replace($.regexp.camel, function (match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  },
  /**
   * Iterates over an Array or Object executing a callback function on each item
   * @param  {Mixed}    collection Array or Object to iterate over
   * @param  {Function} fn         Function to execute on each item
   * @return {Object}
   */
  each: function each(collection, fn) {
    if (typeof collection === 'function') {
      fn = collection;
      collection = this;
    }

    if (typeof collection.length === 'number') {
      (0, _helpers.each)(collection, function (item, index) {
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
   * Converts a camelCase string to a dasherized one
   * @param  {String} str The string to convert
   * @return {String}     The dasherized version of the string
   */
  dasherize: function dasherize(str) {
    return str.trim().replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
  },
  /**
   * Sets a timer to delay the execution of a function
   * @param  {Function} fn        The function to execute
   * @param  {Object}   context   The object that will set the context (this) of the function
   * @param  {Integer}  wait      The delay before executing the function (Defaults to 100)
   * @param  {Boolean}  immediate Execute the function immediately -> overrides delay
   */
  debounce: function debounce(fn, context, delay, immediate) {
    var timer = null,
        args = arguments;

    if (typeof context === 'number') {
      immediate = delay;
      delay = context;
      context = null;
    }

    return function () {
      var scope = context || this,
          delayed,
          now;

      delayed = function delayed() {
        timer = null;
        !now && fn.apply(scope, args);
      };

      now = immediate && !timer;

      clearTimeout(timer);

      timer = setTimeout(delayed, delay || 200);

      now && fn.apply(scope, args);
    };
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

    (0, _helpers.each)(_arrays.slice.call(arguments, i), function (obj) {
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
   * Returns a "flat" one-dimensional array
   * @param  {Array} array The multidimensional array to flatten
   * @return {Array}       The flattened array
   */
  flatten: function flatten(array) {
    return [].concat(_toConsumableArray(array));
  },
  /**
   * Returns a formatted string template from the values of the passed argument
   * @param  {String} template The string template containing the place-holders
   * @param  {Mixed}  values   The argument containing the indexed values or property keys
   * @return {String}          The formatted string
   */
  format: function format(template, values) {
    if (!values || !($.isObject(values) || $.isArray(values))) {
      return undefined;
    }

    var match = $.isObject(values) ? 'keys' : 'indexed';

    return template.replace($.regexp.templates[match], function (match, key) {
      return values[key] || '';
    });
  },

  /**
   * Determines whether the array contains a specific value
   * @param  {Mixed}   item     The item to look for in the array
   * @param  {String}  array    The array of items
   * @param  {Boolean} position Set true to return the index of the matched item or -1
   * @return {Mixed}            The value of true or false, or the index at which the value can be found
   */
  inArray: function inArray(item, array, position) {
    return array.includes(item, position);
  },
  /**
   * Determines if the passed obj is an array or array-like object (NodeList, Arguments, etc...)
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isArrayLike: function isArrayLike(obj) {
    var type = $.type(obj);
    var length = obj.length;

    if (type === 'function' || obj === _window2.default || type === 'string') {
      return false;
    }

    if (obj.nodeType === 1 && length) {
      return true;
    }

    return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
  },

  /**
   * Determines if the passed obj is empty
   * @param  {Object}  obj Object to check the contents of
   * @return {Boolean}     The true/false result
   */
  isEmptyObject: function isEmptyObject(obj) {
    for (var key in obj) {
      return false;
    }

    return true;
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
   * Returns a new array from the results of the mapping
   * @param  {Array}    elements The array to map
   * @param  {Function} fn       The function to execute on each item
   * @return {Array}             The new array
   */
  map: function map(elements, fn) {
    var k = elements.length;
    var values = [];

    if (elements.length) {
      var i = 0;

      for (; i < k; i++) {
        var value = fn(elements[i], i);

        if (value !== null) {
          values.push(value);
        }
      }
    } else {
      for (var key in elements) {
        var _value = fn(elements[key], key);

        if (_value !== null) {
          values.push(_value);
        }
      }
    }

    return $.flatten(values);
  },

  /**
   * Merge arrays - second into the first
   * @param  {Array} first   The array that will receive the new values
   * @param  {Array} second  The array that will be merged into the first - unaltered
   * @return {Array}         The modified array
   */
  merge: function merge(first, second) {
    var total = second.length;
    var length = first.length;
    var i = 0;

    if (typeof total === 'number') {
      for (; i < total; i++) {
        first[length++] = second[i];
      }
    } else {
      while (second[i] !== undefined) {
        first[length++] = second[i++];
      }
    }

    first.length = length;

    return first;
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
   * Executes a function within a specific scope
   * @param  {Function} fn    The function whose scope will change
   * @param  {Object}   scope The scope in which the function should be called
   * @return {Function}       The function with the modified scope
   */
  proxy: function proxy(fn, scope) {
    var args = _arrays.slice.call(arguments, 2);

    return $.isFunction(fn) ? function proxy() {
      return fn.apply(scope || this, [].concat(_toConsumableArray(args), Array.prototype.slice.call(arguments)));
    } : undefined;
  },

  /**
   * Executes the passed function when the DOM is "ready"
   * @param {Function} fn The function to execute
   */
  ready: function ready(fn) {
    if ($.regexp.readyState.test(_document.document.readyState)) {
      fn.call();
    } else {
      _document.document.addEventListener('DOMContentLoaded', fn, false);
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

    var results = _document.document.querySelectorAll(selector);

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
    try {
      return JSON.stringify(value, replacer, spaces);
    } catch (error) {
      throw 'Error occurred while trying to stringify JSON: ' + error;
    }
  },

  /**
   * Converts anything that can be iterated over into a real JavaScript Array
   * @param  {Mixed}   item  Can be a string, array or arugments object
   * @param  {Integer} start Zero-based index to start the array at (optional)
   * @param  {Integer} end   Zero-based index to end the array at (optional)
   * @return {Array}         The new array
   */
  toArray: function toArray(item, start, end) {
    var array = [];

    if (!item || !item.length) {
      return array;
    }

    $.isString(item) && (item = item.split(''));

    end = end && end < 0 && item.length + end || end || item.length;

    for (var i = start || 0; i < end; i++) {
      array.push(item[i]);
    }

    return array;
  },

  /**
   * Returns the internal JavaScript [Class]] of an Object
   * @param  {Object} obj Object to check the class property of
   * @return {String}     Only the class property of the Object
   */
  type: function type(obj) {
    return obj === null ? String(obj) : class2type[_objects.toString.call(obj)];
  },
  /**
   * Filters an array and by removing duplicates items
   * @param  {Array} collection The array to filter
   * @return {Array}            The modified array
   */
  unique: function unique(collection) {
    for (var i = 0; i < collection.length; i++) {
      if ((0, _helpers.indexOf)(collection, collection[i]) !== i) {
        collection.splice(i, 1);
        i--;
      }
    }

    return collection;
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
(0, _helpers.each)(['Array', 'Boolean', 'Date', 'Error', 'Function', 'Object', 'RegExp', 'String'], function (name) {
  class2type['[object ' + name + ']'] = name.toLowerCase();

  $['is' + name] = function (obj) {
    return $.type(obj) === name.toLowerCase();
  };
});

$.fn.init.prototype = $.fn;

$.fn.extend = $.extend;

exports.default = $;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./common/arrays":5,"./common/document":6,"./common/helpers":7,"./common/objects":9,"./common/strings":11,"./common/window":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _window = require('../common/window');

var _window2 = _interopRequireDefault(_window);

var _navigator = require('../common/navigator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.browser = function () {
  var match = _navigator.userAgent.match(_core2.default.regexp.browser);
  var browser = RegExp.$1.toLowerCase();
  var types = {
    'chrome': 'webkit',
    'firefox': 'moz',
    'msie': 'ms',
    'opera': 'o',
    'safari': 'webkit',
    'trident': 'ms'
  };
  var prefix = types[browser] || '';
  var nativeSelector = prefix + 'MatchesSelector';
  var language = language;

  return {
    chrome: browser === 'chrome' && !('doNotTrack' in _window2.default),
    cssPrefix: '-' + prefix + '-',
    firefox: browser === 'firefox',
    language: language && language.toLowerCase(),
    msie: browser === 'msie' || browser === 'trident',
    nativeSelector: prefix.length > 0 ? nativeSelector : nativeSelector[0].toLowerCase(),
    opera: browser === 'opera',
    prefix: prefix,
    safari: browser === 'safari' && 'doNotTrack' in _window2.default,
    version: _navigator.userAgent.match(/version\/([\.\d]+)/i) !== null ? RegExp.$1 : match[2],
    webkit: prefix === 'webkit'
  };
}();

exports.default = _core2.default;

},{"../common/navigator":8,"../common/window":12,"../core":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _window = require('../common/window');

var _window2 = _interopRequireDefault(_window);

var _navigator = require('../common/navigator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.device = function () {
  var match = _navigator.userAgent.match(_core2.default.regexp.device);
  var device = RegExp.$1.toLowerCase();
  var detectMobile = function () {
    return _core2.default.regexp.mobile.test(_navigator.userAgent || _navigator.vendor || _window2.default.opera);
  }();

  return {
    idevice: /((ip)(hone|ad|od))/i.test(device),
    ipad: device === 'ipad',
    iphone: device === 'iphone',
    ipod: device === 'ipod',
    isDesktop: !detectMobile,
    isMobile: detectMobile,
    orientation: function orientation() {
      return _window2.default.innerHeight > _window2.default.innerWidth ? 'portrait' : 'landscape';
    },
    playbook: device === 'playbook',
    touchpad: device === 'hp-tablet'
  };
}();

exports.default = _core2.default;

},{"../common/navigator":8,"../common/window":12,"../core":13}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _window = require('../common/window');

var _window2 = _interopRequireDefault(_window);

var _navigator = require('../common/navigator');

var _document = require('../common/document');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supports = function supports(name) {
  return _core2.default.camelCase(_core2.default.browser.prefix.replace(_core2.default.regexp.ms, 'ms-')) + name;
};

_core2.default.supports = {
  cssAnimationEvents: supports('AnimationName') in _document.documentElement.style,
  cssTransform: supports('Transform') in _document.documentElement.style,
  cssTransitionEnd: supports('TransitionEnd') in _document.documentElement.style,
  cssTransition: supports('Transition') in _document.documentElement.style,
  cssTransform3d: 'WebKitCSSMatrix' in _window2.default && 'm11' in new WebKitCSSMatrix(),
  homescreen: 'standalone' in _navigator.navigator,
  localStorage: _typeof(_window2.default.localStorage) !== undefined,
  pushState: 'pushState' in _window2.default.history && 'replaceState' in _window2.default.history,
  retina: 'devicePixelRatio' in _window2.default && _window2.default.devicePixelRatio > 1,
  touch: 'ontouchstart' in _window2.default
};

exports.default = _core2.default;

},{"../common/document":6,"../common/navigator":8,"../common/window":12,"../core":13}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _navigator = require('../common/navigator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.os = function () {
  var match = _navigator.userAgent.match(_core2.default.regexp.os);
  var mobile = /mobile/i.test(_navigator.userAgent);
  var os = RegExp.$1.toLowerCase();

  if (_core2.default.device.idevice) {
    return 'ios';
  }

  if (os === 'blackberry' && mobile) {
    return 'bbmobile';
  }

  if (os === 'macintosh') {
    return 'osx';
  }

  return os;
}();

exports.default = _core2.default;

},{"../common/navigator":8,"../core":13}],18:[function(require,module,exports){
'use strict';

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

require('./agent');

require('./ajax/ajax');

require('./commands/commands');

require('./common/regexp');

require('./detection/browser');

require('./detection/device');

require('./detection/feature');

require('./detection/os');

require('./query/query');

require('./plugins');

require('./speech/speak');

require('./speech/speechParser');

require('./speech/speechVoices');

require('./visualizer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (root) {
  return (root.Eleven = _core2.default) && ('$' in window ? window.Q = _core2.default.query : window.$ = _core2.default.query);
})(window);

},{"./agent":1,"./ajax/ajax":2,"./commands/commands":3,"./common/regexp":10,"./core":13,"./detection/browser":14,"./detection/device":15,"./detection/feature":16,"./detection/os":17,"./plugins":19,"./query/query":41,"./speech/speak":48,"./speech/speechParser":49,"./speech/speechVoices":53,"./visualizer":54}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// plugin registry cache
var plugins = {};

/**
 * Adds plugin to the plugin registry for any Eleven instance to bind to
 * @param {String}  name String containing the plugins unique name
 * @param {Functio} fn   Constructor function of plugin
 */
_core2.default.plugin = function (name, fn) {
  if (!plugins[name]) {
    if (!_core2.default.isFunction(fn)) {
      throw '"' + name + '" does not have a constructor.';
    } else {
      plugins[name] = fn;
    }
  }

  return undefined;
};

_core2.default.fn.extend({
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

    if (!this.plugins[name] && plugins[name]) {

      if (options.commands) {
        this.addCommands(name, options.commands);
      }

      this.plugins[name] = new plugins[name](options);
    } else if (this.plugins[name] && plugins[name]) {
      console.warn('"' + name + '" plugin has already been loaded!');
    } else {
      throw '"' + name + '" plugin does not exist!';
    }

    return this;
  }
});

exports.default = _core2.default;

},{"./core":13}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Get the value of an attribute for the first element in the set of matched
   * elements or set one or more attributes for every matched element
   * @param  {Mixed} name  The name of the attribute to get or a hash of key/value pairs to set
   * @param  {Mixed} value The value to set for one or more elements (optional)
   * @return {Mixed}       The attribute value or the matched set
   */
  attr: function attr(name, value) {
    var element = this[0];

    if (!element || element && element.nodeType !== 1) {
      return undefined;
    }

    if (typeof name === 'string' && value === undefined && value != 'null') {
      if (typeof name === 'string') {
        return element.getAttribute(name);
      }
    } else {
      var i = 0,
          k = this.length,
          process = function process(element, key, value) {
        if (value == null) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, value);
        }
      };

      for (; i < k; i++) {
        element = this[i];

        if (!element || element && element.nodeType !== 1) {
          return undefined;
        }

        if (typeof name === 'string') {
          process(element, name, value);
        }

        if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
          for (var key in name) {
            process(element, key, name[key]);
          }
        }
      }
    }

    return this;
  },

  /**
   * Removes one or more attributes from a set of matched elements in a collection
   * @param {Mixed} name The string or array of properties names to remove
   */
  removeAttr: function removeAttr(name) {
    if (this[0] === undefined) {
      return;
    }

    var i = 0,
        k = this.length;

    for (; i < k; i++) {
      var element = this[i];

      if (element.nodeType !== 1) {
        continue;
      }

      if (typeof name === 'string') {
        element.removeAttribute(name);
      } else if (typeof name === 'array') {
        var j = 0,
            l = name.length;

        for (; j < l; j++) {
          var property = name[j];
          element[property] && element.removeAttribute(property);
        }
      }

      element = null;
    }

    return this;
  }
});

exports.default = _core2.default;

},{"../core":22}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the value for the first element in a matched
 * set or sets the value for one or more elements
 * @param  {Mixed} value The value to set
 * @return {Mixed}       The property value
 */
_core2.default.fn.val = function (value) {
  if (this[0] === undefined) {
    return;
  }

  if (value === undefined) {
    return this[0].value;
  }

  for (var i = 0, k = this.length; i < k; i++) {
    this[i].value = value;
  }

  return this;
};

exports.default = _core2.default;

},{"../core":22}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../core/');

var _core2 = _interopRequireDefault(_core);

var _window = require('../common/window');

var _window2 = _interopRequireDefault(_window);

var _document = require('../common/document');

var _objects = require('../common/objects');

var _arrays = require('../common/arrays');

var _helpers = require('../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fragmentContainer = {};

/**
 * Define a local copy of $
 * @param {Mixed} selector String containing CSS selector(s), HTML tags to create, or DOM Element
 * @param {Mixed} context  Context in which to perform the search (can be a CSS Selector or DOM Element)
 */
var $ = function $(selector, context) {
  return new $.fn.init(selector, context);
};

$.fn = $.prototype = {
  constructor: $,
  version: '1.0.0',
  init: function init(selector, context) {
    this.length = 0;

    if (!selector) {
      return this;
    }

    if (selector.constructor === $) {
      return selector;
    }

    var type = typeof selector === 'undefined' ? 'undefined' : _typeof(selector);

    if (type === 'function') {
      return $(_document.document).ready(selector);
    }

    this.selector = selector;
    this.context = context;

    if (selector === 'body' || selector === _document.document.body) {
      this[this.length++] = this.context = _document.document.body;
      return this;
    }

    if (selector === _window2.default || selector.nodeType || selector === 'body') {
      this[this.length++] = this.context = selector;
      return this;
    }

    if (type === 'string') {
      selector = selector.trim();

      if (selector[0] === '<' && selector[selector.length - 1] === '>' && $.regexp.fragments.test(selector)) {
        selector = $.fragment(_document.document.createElement(fragmentContainer[RegExp.$1] || 'div'), selector);
        this.selector = selector;
      }
    }

    if (selector.length !== undefined && _objects.toString.call(selector) === '[object Array]') {
      var i = 0,
          k = selector.length;

      for (; i < k; i++) {
        this[this.length++] = selector[i] instanceof $ ? selector[i][0] : selector[i];
      }

      return this;
    }

    if (this.context === undefined) {
      this.context = _document.document;
    } else {
      this.context = $(this.context)[0];
    }

    return $.merge(this, $.query(this.selector, this.context));
  }
};

/**
 * Creates a dictionary of fragment containers for
 * proper DOM node creation when using $.fragment
 */
(0, _helpers.each)(['tbody', 'thead', 'tfoot', 'tr', 'th', 'td'], function (item) {
  fragmentContainer[item] = item === 'th' || item === 'td' ? 'tr' : 'table';
});

/**
 * Returns the created DOM node(s) from a passed HTML string
 * @param  {String} html The string containing arbitrary HTML
 * @return {Array}       The DOM node(s)
 */
$.fragment = function (container, html) {
  container.innerHTML = '' + html;

  var items = _arrays.slice.call(container.childNodes);

  (0, _helpers.each)(items, function (element) {
    return container.removeChild(element);
  });

  return items;
};

/**
 * Traverses the DOM and returns matched elements
 * @param  {Mixed} selector String containing CSS selector(s), HTML tags to create, or DOM Element
 * @param  {Mixed} context  Context in which to perform the search (can be a CSS Selector or DOM Element)
 * @return {Array}          NodeList of matched selectors
 */
$.query = function (selector, context) {
  var query = [];
  var noSpace = selector.length && selector.indexOf(' ') < 0;

  if (selector[0] === '#' && context === _document.document && noSpace) {
    var element = context.getElementById(selector.slice(1));

    if (element) {
      query = [element];
    }
  } else {
    if (context.nodeType === 1 || context.nodeType === 9) {
      if (selector[0] === '.' && noSpace) {
        query = context.getElementsByClassName(selector.slice(1));
      } else if ($.regexp.tags.test(selector)) {
        query = context.getElementsByTagName(selector);
      } else {
        query = context.querySelectorAll(selector);
      }
    }
  }

  return _arrays.slice.call(query);
};

// extend $ with existing Eleven methods
(0, _helpers.each)(['ajax', 'ajaxSettings', 'appendQuery', 'browser', 'camelCase', 'dasherize', 'debounce', 'deparam', 'device', 'each', 'extend', 'format', 'get', 'getJSON', 'inArray', 'isArray', 'isArrayLike', 'isEmptyObject', 'isFunction', 'isNumber', 'isNumeric', 'isObject', 'isPlainObject', 'isString', 'isWindow', 'jsonP', 'map', 'merge', 'os', 'params', 'proxy', 'regexp', 'ready', 'serialize', 'supports', 'toArray', 'unique', 'uuid'], function (item) {
  $[item] = _core2.default[item];
});

$.fn.init.prototype = $.fn;

$.extend($.fn, {
  concat: _arrays.concat,
  indexOf: _helpers.indexOf,
  reduce: _arrays.reduce,
  splice: _arrays.splice,
  each: $.each,
  extend: $.extend
});

_core2.default.query = $;

exports.default = $;

},{"../common/arrays":5,"../common/document":6,"../common/helpers":7,"../common/objects":9,"../common/window":12,"../core/":13}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

_core2.default.fn.extend({
  /**
   * Determines whether an element has a specific CSS class
   * @param  {String}  name String containing the CSS class name to search
   * @return {Boolean}      True/false result
   */
  hasClass: function hasClass(name) {
    return this[0].classList.contains(name);
  },

  /**
   * Swaps one CSS className for another
   * @param  {String} remove String containing the class name to remove
   * @param  {String} add    String containing the class name to add
   * @return {Object}        Query collection
   */
  swapClass: function swapClass(remove, add) {
    return this.length ? this.removeClass(remove).addClass(add) : undefined;
  },

  /**
   * Toggles a specific class on one or more elements
   * @param {Mixed} cls The CSS class to toggle or the function to execute
   */
  toggleClass: function toggleClass(cls, fn) {
    return this.length ? this[this.hasClass(cls) ? 'removeClass' : 'addClass'](fn && fn(cls) || cls) : undefined;
  }
});

/**
 * Add or remove one or more CSS classes from one or more elements
 * @param {Mixed} cls The CSS class to add/remove or the function to execute
 */
(0, _helpers.each)(['addClass', 'removeClass'], function (method, index) {
  _core2.default.fn[method] = function (name) {
    if (this[0] === undefined) {
      return undefined;
    }

    var i = 0,
        k = this.length,
        type = typeof name === 'undefined' ? 'undefined' : _typeof(name),
        names = type === 'string' ? name.split(' ') : [],
        remove = method === 'removeClass';

    for (; i < k; i++) {
      var element = this[i];

      if (type === 'function') {
        name.call(element, element.classList, i);
      } else {
        if (remove && name === undefined) {
          element.className = '';
        } else {
          if (remove) {
            var _element$classList;

            (_element$classList = element.classList).remove.apply(_element$classList, _toConsumableArray(names));
          } else {
            var _element$classList2;

            (_element$classList2 = element.classList).add.apply(_element$classList2, _toConsumableArray(names));
          }
        }
      }
    }

    return this;
  };
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cssNumber = { 'columns': 1, 'columnCount': 1, 'fillOpacity': 1, 'flexGrow': 1, 'flexShrink': 1, 'fontWeight': 1, 'lineHeight': 1, 'opacity': 1, 'order': 1, 'orphans': 1, 'widows': 1, 'zIndex': 1, 'zoom': 1 };
var formatValue = function formatValue(prop, value) {
  return typeof value === 'number' && !cssNumber[prop] && parseFloat(value) + 'px' || value;
};

_core2.default.fn.extend({
  /**
   * Get the value of a style property for the first element in the set of matched
   * elements or set the style property value for one or more elements
   * @param  {Mixed} property The style property to set or get
   * @param  {Mixed} value    The value to set for the given property
   * @return {Mixed}          The style property value or this
   */
  css: function css(property, value) {
    var element = this[0],
        isString = typeof property === 'string',
        returnZero = { width: 1, height: 1 },
        process = function process(element, prop, value, get) {
      if (value == null || value !== value && get) {
        return;
      }

      var camelCase = _core2.default.camelCase(prop);

      if (get) {
        value = element.style[camelCase] || (0, _helpers.getComputedStyle)(element, null)[camelCase];
      }

      if (parseFloat(value) < 0 && returnZero[camelCase]) {
        value = 0;
      }

      if (value === '') {
        if (camelCase === 'opacity') {
          value = 1;
        }

        if (returnZero[camelCase]) {
          return '0px';
        }
      }

      if (get) {
        return _core2.default.regexp.cssNumbers.test(camelCase) ? parseFloat(value) : value;
      } else {
        element.style[camelCase] = formatValue(camelCase, value);
      }
    };

    if (!element || element.nodeType === 3 || element.nodeType === 8 || !element.style) {
      return;
    }

    if (isString && value === undefined) {
      return process(element, property, '1', true);
    }

    var i = 0,
        k = this.length;

    for (; i < k; i++) {
      element = this[i];

      if (!element || element.nodeType === 3 || element.nodeType === 8 || !element.style) {
        return;
      }

      if (isString) {
        process(element, property, value);
      } else {
        for (var key in property) {
          process(element, key, property[key]);
        }
      }
    }

    return this;
  }
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _document = require('../../common/document');

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * .width() and .height() methods; Returns width or height of the
 * matched element or set the height and width of one or more elements
 *
 * .outerWidth and .outerHeight will return the elements
 *  width + padding + borders + margins (optional, pass true as param)
 * @param  {Mixed} value  If passed true, it will return the width/height including margins, otherwise, sets the value
 * @return {Mixed}        The property value, or the matched set
 */
(0, _helpers.each)(['width', 'height', 'outerWidth', 'outerHeight'], function (method) {
  _core2.default.fn[method] = function (value) {
    var element = this[0],
        dimension = method.replace('outer', '').toLowerCase(),
        property = dimension[0].toUpperCase() + dimension.slice(1),
        scrollOffset = 'scroll' + property,
        clientOffset = 'client' + property,
        offsetProperty = 'offset' + property,
        padding = 0,
        margin = 0,
        extra = 0;

    if (!element) {
      return undefined;
    }

    if (_core2.default.isWindow(element)) {
      return element['inner' + property];
    }

    if (element.nodeType === 9) {
      var doc = _document.documentElement;

      return Math.max(element.body[scrollOffset], element.body[offsetProperty], doc[scrollOffset], doc[offsetProperty], doc[clientOffset]);
    }

    if (value === undefined && method.indexOf('outer') < 0) {
      return this.css(method);
    }

    if (method.indexOf('outer') !== -1) {
      padding = dimension === 'width' ? this.css('paddingLeft') + this.css('paddingRight') : this.css('paddingTop') + this.css('paddingBottom');
      margin = value === true ? dimension === 'width' ? this.css('marginLeft') + this.css('marginRight') : this.css('marginTop') + this.css('marginBottom') : dimension === 'width' ? this.css('borderLeftWidth') + this.css('borderRightWidth') : this.css('borderTopWidth') + this.css('borderBottomWidth');

      return this.css(dimension) + padding + margin + extra;
    }

    return this.css(method, value);
  };
});

exports.default = _core2.default;

},{"../../common/document":6,"../../common/helpers":7,"../core":22}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Returns the offset object for the first matched element in a collection
   * @return {Object} The offset object: height, left, top, width
   */
  offset: function offset(properties) {

    if (!this.length || this[0] === undefined) {
      return undefined;
    }

    var element = this[0].getBoundingClientRect();

    return {
      bottom: element.top + element.height + window.pageYOffset,
      height: element.height,
      left: element.left + window.pageXOffset,
      right: element.left + element.width + window.pageXOffset,
      top: element.top + window.pageYOffset,
      width: element.width
    };
  },

  /**
   * Returns the current position of an element relative to its offset parent
   * @return {Object} The position object containing the top and left coordinates
   */
  position: function position() {
    if (!this.length) {
      return undefined;
    }

    var element = (0, _core2.default)(this[0]),
        offsetParent = (0, _core2.default)(this.offsetParent()),
        offset = this.offset(),
        first = offsetParent.eq(0),
        parentOffset = _core2.default.regexp.root.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

    offset.top -= parseFloat(element.css('marginTop')) || 0, offset.left -= parseFloat(element.css('marginLeft')) || 0, parentOffset.top += parseFloat(first.css('borderTopWidth')) || 0;
    parentOffset.left += parseFloat(first.css('borderLeftWidth')) || 0;

    return {
      top: offset.top - parentOffset.top,
      left: offset.left - parentOffset.left
    };
  }
});

exports.default = _core2.default;

},{"../core":22}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _document = require('../../common/document');

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sets or gets the scroll position for the first element - .scrollLeft() and .scrollTop()
 * @return {Mixed} The current X/Y scroll position or this
 */
(0, _helpers.each)(['scrollLeft', 'scrollTop'], function (method, index) {
  var top = index === 1,
      property = top ? 'pageYOffset' : 'pageXOffset';

  _core2.default.fn[method] = function (value) {

    if (this[0] === undefined) {
      return undefined;
    }

    var elem = this[0],
        win = _core2.default.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;

    return value === undefined ? win ? property in win ? win[property] : _document.documentElement[method] : elem[method] : win ? win.scrollTo(!top ? value : (0, _core2.default)(win).scrollLeft(), top ? value : (0, _core2.default)(win).scrollTop()) : elem[method] = value;
  };
});

exports.default = _core2.default;

},{"../../common/document":6,"../../common/helpers":7,"../core":22}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Hides each element in the matched set of elements
   * @return {Object} Query object
   */
  hide: function hide() {
    if (this[0] === undefined) {
      return this;
    }

    var i = 0,
        k = this.length;

    for (; i < k; i++) {
      var element = this[i],
          display = (0, _helpers.getComputedStyle)(element, null)['display'];

      if (element.nodeType === 1 && display !== 'none') {
        element.displayRef = display;
        element.style.display = 'none';
      }

      element = display = null;
    }

    return this;
  },

  /**
   * Shows each element in the matched set of elements
   * @return {Object} Query object
   */
  show: function show() {
    if (!this.length || this[0] === undefined) {
      return this;
    }

    var i = 0,
        k = this.length;

    for (; i < k; i++) {
      var element = this[i];

      if (element.nodeType === 1 && (0, _helpers.getComputedStyle)(element, null)['display'] === 'none') {
        element.style.display = element.displayRef || 'block';
        try {
          delete element.displayRef;
        } catch (e) {
          element.displayRef = null;
        }
      }

      element = null;
    }

    return this;
  }
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Data cache
 * @type {Object}
 */
var cache = {};

/**
 * Removes the cache of a given element
 * @param  {DOM Element} element The element we want to remove the data cache from
 * @return {Object}              Always returns true
 */
var removeDataCache = function removeDataCache(element) {
  var id = element.uid;

  if (cache[id]) {
    delete cache[id];
  }

  return true;
};

_core2.default.extend({
  /**
   * Sets or gets arbitrary data of one or more elements
   * @param  {Array} collection The matched set or a single DOM element
   * @param  {Mixed} key        String containing the key to retrieve or modify, or an Object of key/value pairs to set
   * @param  {Mixed} value      The value to assign to the key. If key is an Object, value should be undefined
   * @return {Mixed}            The key value, the current data object (no key/value defined), or the set of match elements (setting values across multiple elements)
   */
  data: function data(collection, key, value) {
    var elevObject = collection instanceof _core2.default;
    var elements = elevObject ? collection : [collection];

    if (elements[0] === undefined || elements[0] && elements[0].nodeType !== 1) {
      return undefined;
    }

    var id = elements[0].uid,
        k = elements.length,
        i = 0;

    if (key === undefined && value === undefined) {
      return cache[id] || undefined;
    }

    if (typeof key === 'string' && key !== 'destroy' && value === undefined) {
      return cache[id] && cache[id][key] || undefined;
    }

    for (; i < k; i++) {
      if (elements[i].nodeType === 1) {
        if (key === 'destroy' && 'uid' in elements[i]) {
          removeDataCache(elements[i]);
        } else {
          id = elements[i].uid || (elements[i].uid = _core2.default.uuid());

          if (!cache[id]) {
            cache[id] = {};
          }

          if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
            for (var _i in key) {
              cache[id][_i] = key[_i];
            }
          } else {
            cache[id][key] = value;
          }
        }
      }
    }

    return collection;
  }
});

_core2.default.fn.extend({
  /**
   * Store arbitrary data associated with an element - Shortcut for $.data
   * @param  {String} key   The key in the dataset
   * @param  {Mixed}  value The value to assign to the property
   * @return {Mixed}        The key value or the set of match elements
   */
  data: function data(key, value) {
    return _core2.default.data(this, key, value);
  }
});

exports.default = _core2.default;

},{"../core":22}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventsCache = {};

(0, _helpers.each)(['blur', 'change', 'click', 'dblclick', 'enter', 'error', 'focus', 'focusin', 'focusout', 'hashchange', 'keydown', 'keypress', 'keyup', 'leave', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseenter', 'mouseleave', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload'], function (event) {
  _core2.default.fn[event] = function (data, fn) {

    if (typeof data === 'function') {
      fn = data;
      data = null;
    }

    return fn ? this.on(event, data, fn) : this.trigger(event);
  };
});

/**
 * Add or remove one or more event handlers - .on(), .bind() or .off(), .unbind() methods
 * @param  {String}   event    The string containing the event type(s)
 * @param  {String}   selector A selector string to filter the descendants of the selected elements that trigger the event (optional)
 * @param  {Anything} data     Data to be passed to the handler in event.data (optional)
 * @param  {Function} fn       The callback function
 */
(0, _helpers.each)(['on', 'off', 'bind', 'unbind'], function (method, index) {
  _core2.default.fn[method] = function (events, data, fn, capture) {
    if (this[0] === undefined) {
      return undefined;
    }

    if (fn == null) {
      fn = data;
      data = null;
    }

    return this.each(function () {
      _core2.default.events[index % 2 === 0 ? 'add' : 'remove'](this, events, data, fn, capture);
    });
  };
});

_core2.default.fn.extend({
  /**
   * Binds to both the mouseenter/mouseover and mouseleave/mouseout of an element
   * @param  {Function} over The function to execute when the mouse enters the element
   * @param  {Function} out  The function to execute when the mouse leaves the element
   * @return {Object}        Y object
   */
  hover: function hover(over, out) {
    return this.mouseenter(over).mouseleave(out || over);
  },

  /**
   * Bind to the defined events only once
   * @param {String}   events The event(s) to bind to
   * @param {Function} fn     The function to execute on the event
   * @param {Mixed}    data   Data passed to the event handler
   */
  one: function one(events, fn, data) {
    var self = this,
        proxy = function proxy(e) {
      if (typeof fn === 'function') {
        fn.call(this, e, e.data);
        self.off(events, data, proxy);
      }
    };

    return this.each(function (element, index) {
      var element = (0, _core2.default)(this);

      if ((typeof events === 'undefined' ? 'undefined' : _typeof(events)) === 'object') {
        if (typeof fn !== 'function') {
          data = fn;
          fn = null;
        }

        _core2.default.each(events, function (key, value) {
          element.one(key, value, data);
        });
      } else {
        element.on(events, data, proxy);
      }
    });
  },

  /**
   * Triggers an event on more or more elements
   * @param {String} event The event to trigger
   * @param {Object} data  The event data
   */
  trigger: function trigger(type, data) {
    if (typeof type !== 'string') {
      return undefined;
    }

    return this.each(function () {
      var self = this;

      (0, _helpers.each)(_core2.default.events.find(this, type), function (handler) {
        if (handler.fn && typeof handler.fn === 'function') {
          if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
            handler.data = data;
          }

          handler.fn({
            currentTarget: self,
            data: handler.data,
            handleObj: handler,
            namespace: handler.namespace,
            timeStamp: new Date().getTime(),
            type: handler.type
          }, handler.data);
        }
      });
    });
  }
});

/**
 * Event aliases dictionary
 * @param  {String} event String containing the event name
 * @return {String}       The original event name or the mapped alias
 */
var eventAlias = function eventAlias(event) {
  var alias = {
    blur: _core2.default.supports.focusin ? 'focusout' : 'blur',
    focus: _core2.default.supports.focusin ? 'focusin' : 'focus',
    mouseenter: 'mouseover',
    mouseleave: 'mouseout',
    turn: 'orientationchange'
  };

  return alias[event] || event;
};

_core2.default.events = {
  /**
   * Returns the matching handler(s) of a specified element from the internal event cache
   * @param  {DOM Element} element The DOM element
   * @param  {Object}      event   The event object
   * @param  {Function}    fn      The passed event handler
   * @return {Object}              The matched event handler from the cache
   */
  find: function find(element, event, fn) {
    var e = _core2.default.events.namespace(event);

    return (eventsCache[element.uid] || []).filter(function (handler) {
      return handler && (!e.type || handler.type === e.type) && (!e.namespace || handler.namespace === e.namespace) && (!fn || handler.fn === fn);
    });
  },

  /**
   * Helper method for binding events to elements
   * @param {DOM Element} element The DOM element(s)
   * @param {String}      events  The event to bind to
   * @param {Function}    fn      The function to execute on the event
   * @param {Anything}    data    Data passed to the event handler
   * @param {Boolean}     capture The flag to determine if we capture the event or not
   */
  add: function add(element, events, data, fn, capture) {
    var unique = element.uid || (element.uid = _core2.default.uuid());
    var handler = eventsCache[unique] || (eventsCache[unique] = []);

    (0, _helpers.each)(('' + events).split(_core2.default.regexp.space), function (event) {
      var e = _core2.default.events.namespace(event);
      var type = eventAlias[e.type];
      var proxy = _core2.default.events.proxy(element, event, data, fn);

      capture = _core2.default.supports.focusin && /focusin|focusout/i.test(event) || capture;

      handler.push({
        data: data,
        fn: fn,
        index: handler.length,
        namespace: e.namespace,
        proxy: proxy,
        type: e.type
      });

      if ('addEventListener' in element) {
        element.addEventListener(e.type, proxy, !!capture);
      }
    });
  },

  /**
   * Helper method for unbinding events to elements
   * @param {DOM Element} element The DOM element
   * @param {String}      events  The event to unbind
   * @param {Function}    fn      The function that maps to the event
   */
  remove: function remove(element, events, data, fn) {
    (0, _helpers.each)(('' + events).split(_core2.default.regexp.space), function (event) {
      (0, _helpers.each)(_core2.default.events.find(element, event, fn), function (handler) {
        try {
          delete eventsCache[element.uid][handler.index];
        } catch (e) {
          eventsCache[element.uid][handler.index] = null;
        }

        if ('removeEventListener' in element) {
          element.removeEventListener(handler.type, handler.proxy, false);
        }
      });
    });
  },

  /**
   * Returns an event object containing the type and any custom namespace
   * @param  {String} event String containing the event type
   * @return {Object}       The event properties object
   */
  namespace: function namespace(event) {
    var chunks = event.split('.');

    return {
      type: chunks[0],
      namespace: chunks.slice(1).sort().join(' ')
    };
  },

  /**
   * Helper function for event callback
   * @param  {Element}  element The DOM element
   * @param  {Object}   event   The event object
   * @param  {Function} fn      The event handler function
   * @return {Function}         The proxy function
   */
  proxy: function proxy(element, event, data, fn) {
    return function (event) {
      var result;

      if (typeof fn === 'function') {
        event.data = data || {};
        result = fn.call(element, event, event.data);
      }

      if (result === false) {
        event.preventDefault();
      }

      return result;
    };
  }
};

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _document = require('../../common/document');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Executes a function when the DOM is ready
 * @param {Function} fn The function to execute
 */
_core2.default.fn.ready = function (fn) {
  if (_core2.default.regexp.ready.test(_document.document.readyState)) {
    fn.call();
  } else {
    _document.document.addEventListener('DOMContentLoaded', fn, false);
  }

  return this;
};

exports.default = _core2.default;

},{"../../common/document":6,"../core":22}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _document = require('../../common/document');

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Insert content to the end of each element in the matched set
   * @param {Mixed}   element DOM element, array of elements, HTML string, or Query object
   * @param {Boolean} insert  Flag for managing the insertion point (internal)
   * @return {Object}         Query object
   */
  append: function append(element, insert) {
    if (element && element.length != undefined && !element.length) {
      return this;
    }

    if (!element.constructor === Array || (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object') {
      element = (0, _core2.default)(element);
    }

    var i = 0,
        k = this.length;

    for (; i < k; i++) {
      if (element.length && typeof element === 'string') {
        var obj = _core2.default.regexp.fragments.test(element) ? (0, _core2.default)(element) : undefined;

        if (obj == undefined || !obj.length) {
          obj = _document.document.createTextNode(element);
        }

        if (obj.constructor === _core2.default) {
          var l = 0,
              j = obj.length;

          for (; l < j; l++) {
            (0, _helpers.documentFragments)((0, _core2.default)(obj[l]), this[i], insert);
          }
        } else {
          insert != undefined ? this[i].insertBefore(obj, this[i].firstChild) : this[i].appendChild(obj);
        }
      } else {
        (0, _helpers.documentFragments)((0, _core2.default)(element), this[i], insert);
      }
    }

    return this;
  }
});

exports.default = _core2.default;

},{"../../common/document":6,"../../common/helpers":7,"../core":22}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * DOM Maniuplation methods .before() .after()
 * @param  {Mixed}  selector The CSS selector or DOM element to insert before/after
 * @return {Object}          Query object
 */
(0, _helpers.each)(['before', 'after'], function (method, index) {
  _core2.default.fn[method] = function (selector) {
    selector = (0, _core2.default)(selector)[0];

    if (!this.length || !selector) {
      return this;
    }

    var i = 0,
        k = this.length;

    for (; i < k; i++) {
      var element = this[i];

      if (selector.nodeName.toLowerCase() === 'script') {
        selector = (0, _helpers.addScript)(selector);
      }

      if (element.parentNode) {
        element.parentNode.insertBefore(selector, method === 'before' ? element : element.nextSibling);
      }
    }

    return this;
  };
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a copy, or deep copy (optional), of a node
 * @param {Boolean} deep If true, the children of the node will also be cloned
 */
_core2.default.fn.clone = function (deep) {
  var collection = this.map(function (item) {
    return item.cloneNode(!!deep);
  });

  return (0, _core2.default)(collection);
};

exports.default = _core2.default;

},{"../core":22}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Removes one or more elements from the DOM
 * @return {Object}
 */
(0, _helpers.each)(['detach', 'remove'], function (method, index) {
  _core2.default.fn[method] = function (selector) {

    if (!this.length || this[0] === undefined) {
      return;
    }

    var i = 0,
        k = this.length;

    for (; i < k; i++) {
      var element = this[i];

      if (element.nodeType === 1) {
        if (index === 1 && 'uid' in element) {
          _core2.default.data(element, 'destroy');
        }

        element.parentNode && element.parentNode.removeChild(element);
      }

      element = null;
    }

    return this;
  };
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Remove all child nodes from each parent element in the matched set
 * @return {Object} Query object
 */
_core2.default.fn.empty = function () {
  if (this[0] === undefined) {
    return;
  }

  var i = 0,
      k = this.length;

  for (; i < k; i++) {
    var element = this[i];

    while (element.firstChild) {
      if ('uid' in element.firstChild) {
        _core2.default.data(element.firstChild, 'destroy');
      }

      element.removeChild(element.firstChild);
    }

    element = null;
  }

  return this;
};

exports.default = _core2.default;

},{"../core":22}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Returns the HTML contents of the first element in a matched set or updates the contents of one or more elements
   * @param  {String} html The HTML string to replace the contents with
   * @return {Mixed}       The contents of an individual element, or sets the contents for each element in the matched set
   */
  html: function html(_html) {
    var _this = this;

    if (!this.length || this[0] === undefined) {
      return undefined;
    }

    if (!_html) {
      return this[0].innerHTML;
    }

    return this.empty().each(function () {
      return (0, _core2.default)(_this).append(_html);
    });
  },

  /**
   * Returns an HTML string of the element and its descendants
   * @return {HTML String} The container element and its children
   */
  outerHTML: function outerHTML() {
    return this[0] !== undefined && this[0].outerHTML || undefined;
  }
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * DOM Maniuplation methods .appendTo() .prependTo() .prepend()
 * @param  {Mixed}  selector The CSS selector or DOM element to append/prepend
 * @return {Object}          Selector Query object
 */
(0, _helpers.each)(['appendTo', 'prependTo', 'prepend'], function (method, index) {
  _core2.default.fn[method] = function (selector) {
    var target = this,
        selector = (0, _core2.default)(selector);

    if (index !== 2) {
      target = (0, _core2.default)(selector);
      selector = this;
    }

    target.append(selector, index !== 0);

    return selector;
  };
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the text from the first element in the matched set, or sets the
 * text value for one or more elements
 * @param  {String} text The text content to set
 * @return {Mixed}       Gets or sets the text content of the element(s)
 */
_core2.default.fn.text = function (text) {
  if (!this[0] === undefined) {
    return undefined;
  }

  if (!text) {
    return this[0].textContent;
  }

  var i = 0,
      k = this.length;

  for (; i < k; i++) {
    var element = this[i];

    if (element.nodeType) {
      (0, _core2.default)(element).empty();

      if (typeof text === 'function') {
        element.textContent = text.call(element, i, element.textContent);
      } else {
        element.textContent = text;
      }
    }

    element = null;
  }

  return this;
};

exports.default = _core2.default;

},{"../core":22}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wrap an HTML fragment around each element in the matched set
 * @param {Array} node The element(s) to wrap
 */
_core2.default.fn.wrap = function (node) {
  if (this[0] === undefined) {
    return;
  }

  var node = (0, _core2.default)(node),
      i = 0,
      k = this.length,
      element = null;

  for (; i < k; i++) {
    element = (0, _core2.default)(this[i]);
    element.before(node) && node.append(element);
  }

  return this;
};

exports.default = _core2.default;

},{"../core":22}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

require('./attributes/attr');

require('./attributes/val');

require('./css/classes');

require('./css/css');

require('./css/dimensions');

require('./css/position');

require('./css/scroll');

require('./css/showHide');

require('./data/data');

require('./events/events');

require('./events/ready');

require('./manipulation/append');

require('./manipulation/beforeAfter');

require('./manipulation/clone');

require('./manipulation/detach');

require('./manipulation/empty');

require('./manipulation/html');

require('./manipulation/prepend');

require('./manipulation/text');

require('./manipulation/wrap');

require('./traversing/ancestors');

require('./traversing/descendants');

require('./traversing/position');

require('./traversing/traversing');

require('./utils/chain');

require('./utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _core2.default;

},{"./attributes/attr":20,"./attributes/val":21,"./core":22,"./css/classes":23,"./css/css":24,"./css/dimensions":25,"./css/position":26,"./css/scroll":27,"./css/showHide":28,"./data/data":29,"./events/events":30,"./events/ready":31,"./manipulation/append":32,"./manipulation/beforeAfter":33,"./manipulation/clone":34,"./manipulation/detach":35,"./manipulation/empty":36,"./manipulation/html":37,"./manipulation/prepend":38,"./manipulation/text":39,"./manipulation/wrap":40,"./traversing/ancestors":42,"./traversing/descendants":43,"./traversing/position":44,"./traversing/traversing":45,"./utils/chain":46,"./utils/utils":47}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Find the closest ancestor of the element that matches a given selector
   * @param  {Mixed}  selector The selector we are looking for
   * @param  {Mixed}  context  The context in which to perform the search
   * @return {Object}          The matched element
   */
  closest: function closest(selector, context) {
    if (!this.length) {
      return undefined;
    }

    var element = this[0],
        query = (0, _core2.default)(selector, context);

    if (!query.length) {
      return (0, _core2.default)();
    }

    while (element && query.indexOf(element) < 0) {
      element = element !== context && element !== document && element.parentNode;
    }

    return this.chain((0, _core2.default)(element || []));
  },

  /**
   * Get the closest positioned parent element
   * @return {Object} The parent DOM Element
   */
  offsetParent: function offsetParent() {
    return this.map(function () {
      var offsetParent = this.offsetParent || document.body;

      while (offsetParent && !_core2.default.regexp.root.test(offsetParent.nodeName) && (0, _core2.default)(offsetParent).css('position') === 'static') {
        offsetParent = offsetParent.offsetParent;
      }

      return offsetParent;
    });
  },

  /**
   * Return the parent element of the first matched element
   * @param  {String} selector The selector to filter by (optional)
   * @return {Object}          The parent element object
   */
  parent: function parent(selector) {
    var result;

    if (!this[0].parentNode) {
      return this;
    }

    if (selector) {
      result = (0, _core2.default)(this[0].parentNode).filter(selector);
    } else {
      result = (0, _core2.default)(this[0].parentNode || []);
    }

    return this.chain(result);
  },

  /**
   * Get the ancestors of each element in a set, optionally filtered by a CSS selector
   * @param  {String} selector A string containing the CSS selector to filter elements by
   * @return {Object}          Query object containing DOM elements of  elements of the selected element,
   */
  parents: function parents(selector) {
    if (!this.length) {
      return undefined;
    }

    var collection = [],
        elements = this;

    while (elements.length > 0) {
      elements = _core2.default.map(elements, function (element) {
        element = element[property];

        if (element && element.nodeType === 1 && indexOf(collection, element) < 0) {
          return collection.push(element) && element;
        }
      });
    }

    collection = selector ? (0, _core2.default)(collection).filter(selector) : (0, _core2.default)(collection);

    return collection;
  }
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Get the siblings of each element in the collection
 * @param  {Object}      nodes   The collection of DOM nodes
 * @param  {DOM Element} element The sibling to exclude from the collection (optional)
 * @return {Array}       The collection of siblings
 */
_core2.default.siblings = function (nodes, element) {
  var collection = [];

  if (nodes == undefined) {
    return collection;
  }

  for (; nodes; nodes = nodes.nextSibling) {
    if (nodes.nodeType == 1 && nodes !== element) {
      collection.push(nodes);
    }
  }

  return collection;
};

_core2.default.fn.extend({
  /**
   * Return the child elements of each element in the set of matched elements
   * @param  {String} selector Filter by a selector (optional)
   * @return {Object}          The collection of child elements
   */
  children: function children(selector) {
    var collection = [];

    if (this[0] === undefined) {
      return undefined;
    }

    if (this.length === 1) {
      collection = _core2.default.siblings(this[0].firstChild);
    } else {
      var i = 0,
          k = this.length;

      for (; i < k; i++) {
        collection = [].concat(_toConsumableArray(collection), _toConsumableArray(_core2.default.siblings(this[i].firstChild)));
      }
    }

    return this.chain((0, _core2.default)(collection).filter(selector));
  },

  /**
   * Get the siblings of each element in the set of matched elements
   * @param  {String} selector Selector to filter by (optional)
   * @return {Object}          The siblings of the matched elements in the set
   */
  siblings: function siblings(selector) {
    var collection = [];

    if (!this.length) {
      return undefined;
    }

    var i = 0,
        k = this.length;

    if (this.length === 1) {
      if (this[0].nodeType == 1) {
        this[0].parentNode && (collection = _core2.default.siblings(this[0].parentNode.firstChild, this[0]));
      }
    } else {
      for (; i < k; i++) {
        if (this[i].nodeType == 1) {
          this[i].parentNode && (collection = [].concat(_toConsumableArray(collection), [_core2.default.siblings(this[i].parentNode.firstChild, this[i])]));
        }
      }
    }

    return this.chain((0, _core2.default)(collection).filter(selector));
  }
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Reduce the set of matched elements to the one at a specified index. If a negative integer is used
   * it will do a reverse search of the set - eq(-1) will return the last item in the array.
   * @param  {Integer} index Zero-based index of the element to match
   * @return {Object}        The matched element in specified index of the collection
   */
  eq: function eq(index) {
    return (0, _core2.default)(index < 0 ? this[index += this.length - 1] : this[index]);
  },

  /**
   * Returns the first matched element in the collection
   * @return {Object} The first matched element
   */
  first: function first() {
    return (0, _core2.default)(this[0]);
  },

  /**
   * Retrieve the DOM element at the specified index the Query object collection
   * @param  {Integer} index A zero-based index indicating which element to retrieve
   * @return {Mixed}         A matched DOM element. If no index is specified all of the matched DOM elements are returned.
   */
  get: function get(index) {
    return index !== undefined ? index < 0 ? this[this.length + index] : this[index] : _helpers.slice.call(this);
  },

  /**
   * Returns the last element in a matched set
   * @return {Object} The last element
   */
  last: function last() {
    return (0, _core2.default)(this[this.length - 1]);
  }
});

exports.default = _core2.default;

},{"../../common/helpers":7,"../core":22}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _arrays = require('../../common/arrays');

var _helpers = require('../../common/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.extend({
  /**
   * Get the children of each element in the set of matched elements, including text and comment nodes
   * @return {DOM Element} The DOM element
   * @return {Object}      The collection of matched elements
   */
  contents: function contents(element) {
    var name = function name(o, n) {
      return o.nodeName && o.nodeName.toUpperCase() === n.toUpperCase();
    };

    return name(element, 'iframe') ? (0, _core2.default)(element.contentDocument || element.contentWindow.document) : (0, _core2.default)(_arrays.slice.call(element.childNodes));
  },

  /**
   * Determine whether or not a DOM element matches a given selector
   * @param  {DOM Element} element  The DOM element to perform the test on
   * @param  {String}      selector The selector to test
   * @return {Boolean}              The value true or false
   */
  match: function match(element, selector) {
    if (!element || element.nodeType !== 1) {
      return;
    }

    var matches = function matches(element, selector) {
      var nativeSelector = element[_core2.default.browser.nativeSelector];
      return element && nativeSelector && nativeSelector.call(element, selector);
    };

    return matches(element, selector || '*');
  }
});

_core2.default.fn.extend({
  /**
   * Add additional items to an existing Query collection
   * @param  {Mixed}  selector The Object or CSS selector
   * @param  {Mixed}  context  The context of the selector
   * @return {Object}          The modified Query Object
   */
  add: function add(selector, context) {
    return this.chain(_core2.default.unique(_core2.default.merge(this, (0, _core2.default)(selector, context))));
  },

  /**
   * Get the children of each element in the set of matched elements, including text and comment nodes.
   * @return {Object} The collection of matched elements
   */
  contents: function contents() {
    return this[0] !== undefined && _core2.default.contents(this[0]);
  },

  /**
   * Reduce the collection of matched elements to that of the passed selector
   * @param  {String} selector A string containing a selector to match the current set of elements against
   * @return {Object}          The matached elements object
   */
  filter: function filter(selector) {
    return !selector ? this : (0, _core2.default)(_arrays.filter.call(this, function (element) {
      return _core2.default.match(element, selector);
    }));
  },

  /**
   * Search descendants of an element and returns matches
   * @param  {String} selector The element(s) to search for
   * @return {Object}          The matched set of elements
   */
  find: function find(selector) {
    var search;

    if (!selector || typeof selector !== 'string') {
      return [];
    }

    if (this.length === 1) {
      search = (0, _core2.default)(_core2.default.query(selector, this[0]));
    } else {
      search = (0, _core2.default)(_core2.default.map(this, function (node) {
        return _core2.default.query(selector, node);
      }));
    }

    return this.chain(search);
  }
});

/**
 * .next() and .prev() - get the next or previous sibling of
 * the first matched in a collection or get the ancestors of each element in
 * the set of matched elements
 * @param  {String} selector The selector to filter the elements against
 * @return {Object}          The matched element(s)
 */
_core2.default.each({ next: 'nextElementSibling', prev: 'previousElementSibling' }, function (method, property) {
  _core2.default.fn[method] = function (selector) {
    if (!this.length) {
      return undefined;
    }

    var collection = [],
        elements = this;

    while (elements.length > 0) {
      elements = _core2.default.map(elements, function (element) {
        element = element[property];

        if (element && element.nodeType === 1 && indexOf(collection, element) < 0) {
          return collection.push(element) && element;
        }
      });
    }

    collection = selector ? (0, _core2.default)(collection).filter(selector) : (0, _core2.default)(collection);

    return method !== 'parents' ? collection.first() : collection;
  };
});

/**
 * Get all preceding or following siblings of the first matched element in a collection
 * @param  {String} selector Filter siblings by a selector (optional)
 * @return {Array}           The collection of child elements
 */
(0, _helpers.each)(['nextAll', 'prevAll'], function (method) {
  _core2.default.fn[method] = function (selector) {

    if (!this.length || this[0] === undefined || !this[0].parentNode) {
      return this;
    }

    var index = this.index();
    var items = (0, _core2.default)(this[0].parentNode).children(selector);
    var collection = [];

    (0, _helpers.each)(items, function (item, i) {
      if (method === 'nextAll' ? i > index : i < index) {
        collection.push(this);
      }
    });

    return (0, _core2.default)(collection);
  };
});

exports.default = _core2.default;

},{"../../common/arrays":5,"../../common/helpers":7,"../core":22}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Creates a reference to the original matched collection for chain breaking (e.g. using .end())
   * @param  {Object} collection The collection to add the prev reference to
   * @return {Object}            The modified collection
   */
  chain: function chain(collection) {
    return !!collection && (collection.prevObject = this) && (0, _core2.default)(collection) || (0, _core2.default)();
  },

  /**
   * Breaks the current chain and returns the set of matched elements defined in `prevObject` (i.e. previous state)
   * @return {Object}  The matched elements from its previous state
   */
  end: function end() {
    return this.prevObject || (0, _core2.default)();
  }
});

exports.default = _core2.default;

},{"../core":22}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  /**
   * Determines if a DOM element is a descendant of another DOM element
   * @param  {Mixed} selector The CSS selector or DOM element
   * @return {Boolean}        The true or false value
   */
  contains: function contains(selector) {
    return _core2.default.contains(this, selector);
  },

  /**
   * Returns a new $ collection of values by mapping each element
   * in a collection through the iterative function
   * @param {Function} fn The function to process each item against in the collection
   */
  map: function map(fn) {
    return (0, _core2.default)(_core2.default.map(this, function (element, index) {
      return fn.call(element, index, element);
    }));
  },

  /**
   * Slice a matched collection
   * @return {Object} The modified collection
   */
  slice: function (_slice) {
    function slice() {
      return _slice.apply(this, arguments);
    }

    slice.toString = function () {
      return _slice.toString();
    };

    return slice;
  }(function () {
    return (0, _core2.default)(slice.apply(this, arguments));
  }),

  /**
   * Converts anything that can be iterated over into a real JavaScript Array
   * @param  {Integer} start Zero-based index to start the array at (optional)
   * @param  {Integer} end   Zero-based index to end the array at (optional)
   * @return {Array}         The new array
   */
  toArray: function toArray(start, end) {
    return _core2.default.toArray(this, start, end);
  }
});

exports.default = _core2.default;

},{"../core":22}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _speechSynthesis = require('./speechSynthesis');

var _speechSynthesis2 = _interopRequireDefault(_speechSynthesis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.speak = function (text) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var cancelled = false;
  // get instance
  var eleven = Eleven();
  // clean up text
  text = text.replace(/[\"\`]/gm, '\'');
  // split text into 140 character chunks
  var chunks = text.match(_core2.default.regexp.textChunks);
  // find voice profile
  var agent = _core2.default.speechAgent;

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
        eleven.getVisualizer('container').classList.add('ready');
        eleven.getVisualizer().start();

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

        eleven.getVisualizer().stop();

        if (_core2.default.isFunction(config.onEnd)) {
          config.onEnd();
        }
      };
    }

    speechUtterance.onerror = function (error) {
      if (_core2.default.debug) {
        console.error('[Eleven] Unknow Error: ' + error);
      }
    };

    speechSynthesis.speak(speechUtterance);
  });
};

exports.default = _core2.default;

},{"../core":13,"./speechSynthesis":51}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  parser: function parser(results) {
    var _this = this;

    var match = false;

    if (_core2.default.isFunction(this.options.onResult)) {
      this.options.onResult.call(this, results);
    }

    setTimeout(function () {
      if (_this.running && _this.visualizer) {
        _this.running = false;
        _this.visualizer.stop();
      }

      _this.container.classList.remove('ready');
      _this.activated = false;
    }, 750);

    _core2.default.each(results, function (result) {
      var speech = result.replace(_core2.default.regexp.wakeCommands, '').trim();

      if (_this.options.debug) {
        console.debug('[Eleven] Recognized speech: ' + speech);
      }

      if (_this.context) {
        match = _this.evaluate(_this.context, _this.commands[_this.context], speech);
      }

      if (!match) {
        _this.context = null;

        _core2.default.each(_this.commands, function (context) {
          return !_this.evaluate(context, _this.commands[context], speech);
        });
      }
    });

    if (_core2.default.isFunction(this.options.onResultNoMatch)) {
      options.onResultNoMatch.call(this, results);
    }

    return this;
  },
  evaluate: function evaluate(name, context, speech) {
    var match = false;

    for (var item in context) {
      var command = context[item];
      var plugin = name === 'eleven' ? this : this.getPlugin(name);
      var phrase = command.phrase;
      var result = command.regexp.exec(speech);

      if (result) {
        this.context = name;

        var parameters = result.slice(1);

        if (this.options.debug) {
          console.debug('[Eleven] Command match: ' + name + ' - ' + phrase);

          if (parameters.length) {
            console.debug('[Eleven] Command results contain parameters: ' + _core2.default.stringify(parameters, null, 2));
          }
        }

        command.callback.call(this, parameters, speech, phrase, plugin);

        if (_core2.default.isFunction(this.options.onResultMatch)) {
          this.options.onResultMatch.call(this, parameters, speech, phrase, results);
        }

        this.container.classList.remove('ready');

        this.activated = false;

        match = true;

        break;
      }
    }

    return match;
  },
  result: function result(event) {
    var _this2 = this;

    var result = event.results[event.resultIndex];
    var results = [];

    if (this.options.wakeCommands.indexOf(result[0].transcript.trim()) !== -1) {
      if (!this.activated) {
        this.activated = true;
        this.container.classList.add('ready');
        this.wakeSound.play();

        this.commandTimer = setTimeout(function () {
          _this2.activated = false;
          _this2.container.classList.remove('ready');
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

    return this;
  }
});

exports.default = _core2.default;

},{"../core":13}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _window = require('../common/window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _window2.default.SpeechRecognition || _window2.default.webkitSpeechRecognition || _window2.default.mozSpeechRecognition || _window2.default.msSpeechRecognition || _window2.default.oSpeechRecognition;

},{"../common/window":12}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _window = require('../common/window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _window2.default.speechSynthesis;

},{"../common/window":12}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _speechSynthesis = require('./speechSynthesis');

var _speechSynthesis2 = _interopRequireDefault(_speechSynthesis);

var _speechSynthesisOverrides = require('./speechSynthesisOverrides');

var _speechSynthesisOverrides2 = _interopRequireDefault(_speechSynthesisOverrides);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.fn.extend({
  voices: function voices() {
    var _this = this;

    // setup speech synthesis
    _speechSynthesis2.default.onvoiceschanged = function () {
      _core2.default.supportedVoices = _speechSynthesis2.default.getVoices();
    };
    // hack to fix issues with Chrome
    setTimeout(function () {
      if (!_speechSynthesis2.default) {
        console.warn('[Eleven] Voice synthesis is not supported.');
      } else {
        _core2.default.supportedVoices = _speechSynthesis2.default.getVoices();

        if (_core2.default.supportedVoices.length > 0) {
          _core2.default.mappedSupportedVoices = _core2.default.supportedVoices.slice().reduce(function (obj, item) {
            var overrides = _speechSynthesisOverrides2.default[item.name] || {};

            obj[item.name] = _core2.default.extend({}, item, overrides, { suppportedVoice: item });

            return obj;
          }, {});

          _core2.default.speechAgent = _core2.default.mappedSupportedVoices[_this.options.speechAgent] || _core2.default.mappedSupportedVoices['Alex'];
        }
      }
    }, 500);

    return _speechSynthesis2.default;
  }
});

exports.default = _core2.default;

},{"../core":13,"./speechSynthesis":51,"./speechSynthesisOverrides":52}],54:[function(require,module,exports){
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
    this.container.classList.add('ready');
    this.wavesContainer.parentNode.classList.add('speaking');
    this.canvas.classList.add('fadein');

    this.startDrawCycle();
  },
  stop: function stop() {
    this.tick = 0;
    this.run = false;
    this.container.classList.remove('ready');
    this.wavesContainer.parentNode.classList.remove('speaking');
    this.canvas.classList.remove('fadein');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
});

exports.default = _core2.default;

},{"./core":13}]},{},[18])
//# sourceMappingURL=eleven.js.map
