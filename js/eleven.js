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

},{"./core":6}],2:[function(require,module,exports){
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

},{"./core":6}],3:[function(require,module,exports){
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

},{"./commandParser":2,"./core":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var eventTypes = {
  INITIALIZE: 'INITIALIZE',
  INSTALL: 'INSTALL',
  SESSION_START: 'SESSION_START',
  SPEECH: 'SPEECH',
  SESSION_END: 'SESSION_END'
};

exports.default = eventTypes;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  allTypes: [{ name: 'Google UK English Male' }, //0 male uk android/chrome
  { name: 'Agnes' }, //1 female us safari mac
  { name: 'Daniel Compact' }, //2 male us safari mac
  { name: 'Google UK English Female' }, //3 female uk android/chrome
  { name: 'en-GB', rate: 0.25, pitch: 1 }, //4 male uk IOS
  { name: 'en-AU', rate: 0.25, pitch: 1 }, //5 female english IOS
  { name: 'inglés Reino Unido' }, //6 spanish english android
  { name: 'English United Kingdom' }, //7 english english android
  { name: 'Fallback en-GB Female', lang: 'en-GB', fallbackvoice: true }, //8 fallback english female
  { name: 'Eszter Compact' }, //9 Hungarian mac
  { name: 'hu-HU', rate: 0.4 }, //10 Hungarian iOS
  { name: 'Fallback Hungarian', lang: 'hu', fallbackvoice: true }, //11 Hungarian fallback
  { name: 'Fallback Serbian', lang: 'sr', fallbackvoice: true }, //12 Serbian fallback
  { name: 'Fallback Croatian', lang: 'hr', fallbackvoice: true }, //13 Croatian fallback
  { name: 'Fallback Bosnian', lang: 'bs', fallbackvoice: true }, //14 Bosnian fallback
  { name: 'Fallback Spanish', lang: 'es', fallbackvoice: true }, //15 Spanish fallback
  { name: 'Spanish Spain' }, //16 female es android/chrome
  { name: 'español España' }, //17 female es android/chrome
  { name: 'Diego Compact', rate: 0.3 }, //18 male es mac
  { name: 'Google Español' }, //19 male es chrome
  { name: 'es-ES', rate: 0.20 }, //20 male es iOS
  { name: 'Google Français' }, //21 FR chrome
  { name: 'French France' }, //22 android/chrome
  { name: 'francés Francia' }, //23 android/chrome
  { name: 'Virginie Compact', rate: 0.5 }, //24 mac
  { name: 'fr-FR', rate: 0.25 }, //25 iOS
  { name: 'Fallback French', lang: 'fr', fallbackvoice: true }, //26 fallback
  { name: 'Google Deutsch' }, //27 DE chrome
  { name: 'German Germany' }, //28 android/chrome
  { name: 'alemán Alemania' }, //29 android/chrome
  { name: 'Yannick Compact', rate: 0.5 }, //30 mac
  { name: 'de-DE', rate: 0.25 }, //31 iOS
  { name: 'Fallback Deutsch', lang: 'de', fallbackvoice: true }, //32 fallback
  { name: 'Google Italiano' }, //33 IT chrome
  { name: 'Italian Italy' }, //34 android/chrome
  { name: 'italiano Italia' }, //35 android/chrome
  { name: 'Paolo Compact', rate: 0.5 }, //36 mac
  { name: 'it-IT', rate: 0.25 }, //37 iOS
  { name: 'Fallback Italian', lang: 'it', fallbackvoice: true }, //38 fallback
  { name: 'Google US English', timerSpeed: 1 }, //39 EN chrome
  { name: 'English United States' }, //40 android/chrome
  { name: 'inglés Estados Unidos' }, //41 android/chrome
  { name: 'Vicki' }, //42 mac
  { name: 'en-US', rate: 0.2, pitch: 1, timerSpeed: 1.3 }, //43 iOS
  { name: 'Fallback English', lang: 'en-US', fallbackvoice: true, timerSpeed: 0 }, //44 fallback
  { name: 'Fallback Dutch', lang: 'nl', fallbackvoice: true, timerSpeed: 0 }, //45 fallback
  { name: 'Fallback Romanian', lang: 'ro', fallbackvoice: true }, //46 Romanian Male fallback
  { name: 'Milena Compact' }, //47 Russian mac
  { name: 'ru-RU', rate: 0.25 }, //48 iOS
  { name: 'Fallback Russian', lang: 'ru', fallbackvoice: true }, //49 Russian fallback
  { name: 'Google 日本人', timerSpeed: 1 }, //50 JP Chrome
  { name: 'Kyoko Compact' }, //51 Japanese mac
  { name: 'ja-JP', rate: 0.25 }, //52 iOS
  { name: 'Fallback Japanese', lang: 'ja', fallbackvoice: true }, //53 Japanese fallback
  { name: 'Google 한국의', timerSpeed: 1 }, //54 KO Chrome
  { name: 'Narae Compact' }, //55 Korean mac
  { name: 'ko-KR', rate: 0.25 }, //56 iOS
  { name: 'Fallback Korean', lang: 'ko', fallbackvoice: true }, //57 Korean fallback
  { name: 'Google 中国的', timerSpeed: 1 }, //58 CN Chrome
  { name: 'Ting-Ting Compact' }, //59 Chinese mac
  { name: 'zh-CN', rate: 0.25 }, //60 iOS
  { name: 'Fallback Chinese', lang: 'zh-CN', fallbackvoice: true }, //61 Chinese fallback

  { name: 'Alexandros Compact' }, //62 Greek Male Mac
  { name: 'el-GR', rate: 0.25 }, //63 iOS
  { name: 'Fallback Greek', lang: 'el', fallbackvoice: true }, //64 Greek Female fallback

  { name: 'Fallback Swedish', lang: 'sv', fallbackvoice: true }, //65 Swedish Female fallback

  { name: 'hi-IN', rate: 0.25 }, //66 iOS
  { name: 'Fallback Hindi', lang: 'hi', fallbackvoice: true }, //67 Hindi Female fallback

  { name: 'Fallback Catalan', lang: 'ca', fallbackvoice: true }, //68 Catalan Male fallback

  { name: 'Aylin Compact' }, //69 Turkish Female Mac
  { name: 'tr-TR', rate: 0.25 }, //70 iOS Turkish Female
  { name: 'Fallback Turkish', lang: 'tr', fallbackvoice: true }, //71 Turkish Female fallback

  { name: 'Stine Compact' }, //72 Norweigan Male Mac

  { name: 'no-NO', rate: 0.25 }, //73 iOS Female
  { name: 'Fallback Norwegian', lang: 'no', fallbackvoice: true }, //74 Norwegian Female fallback

  { name: 'Daniel' }, //75 English UK male uk safari 8 mac
  { name: 'Monica' }, //76 Spanish female es safari 8 mac
  { name: 'Amelie' }, //77 French Canadian female fr safari 8 mac
  { name: 'Anna' }, //78 female de safari 8 mac
  { name: 'Alice' }, //79 Italian female it safari 8 mac
  { name: 'Melina' }, //80 Greek female gr safari 8 mac
  { name: 'Mariska' }, //81 Hungarian female hu safari 8 mac
  { name: 'Yelda' }, //82 Turkish female tr safari 8 mac
  { name: 'Milena' }, //83 Russian female ru safari 8 mac

  // Gender Disparity
  { name: 'Xander' }, //84 Dutch female nl safari 8 mac
  { name: 'Alva' }, //85 Swedish female sv safari 8 mac

  // Gender Disparity
  { name: 'Lee Compact' }, //86 Australian Male Mac
  { name: 'Karen' }, //87 Australian Female safari 8 mac
  { name: 'Fallback Australian', lang: 'en-AU', fallbackvoice: true }, //88 Australian Female fallback

  // Gender Disparity
  { name: 'Mikko Compact' }, //89 Finnish Male Mac
  { name: 'Satu' }, //90 Finnish Female safari 8 mac
  { name: 'fi-FI', rate: 0.25 }, //91 iOS
  { name: 'Fallback Finnish', lang: 'fi', fallbackvoice: true }, //92 Finnish Female fallback

  { name: 'Fallback Afrikans', lang: 'af', fallbackvoice: true }, //93 Afrikans Male fallback

  { name: 'Fallback Albanian', lang: 'sq', fallbackvoice: true }, //94 Albanian Male fallback

  { name: 'Maged Compact' }, //95 Arabic Male Mac
  { name: 'Tarik' }, //96 Arabic Male safari 8 mac
  { name: 'ar-SA', rate: 0.25 }, //97 iOS
  { name: 'Fallback Arabic', lang: 'ar', fallbackvoice: true }, //98 Arabic Male fallback

  { name: 'Fallback Armenian', lang: 'hy', fallbackvoice: true }, //99 Armenian Male fallback
  { name: 'Zuzana Compact' }, //100 Czech Female Mac
  { name: 'Zuzana' }, //101 Czech Female safari 8 mac
  { name: 'cs-CZ', rate: 0.25 }, //102 iOS
  { name: 'Fallback Czech', lang: 'cs', fallbackvoice: true }, //103 Czech Female fallback
  { name: 'Ida Compact' }, //104 Danish Female Mac
  { name: 'Sara' }, //105 Danish Female safari 8 mac
  { name: 'da-DK', rate: 0.25 }, //106 iOS
  { name: 'Fallback Danish', lang: 'da', fallbackvoice: true }, //107 Danish Female fallback
  { name: 'Fallback Esperanto', lang: 'eo', fallbackvoice: true }, //108 Esperanto Male fallback
  { name: 'Fallback Hatian Creole', lang: 'ht', fallbackvoice: true }, //109 Hatian Creole Female fallback
  { name: 'Fallback Icelandic', lang: 'is', fallbackvoice: true }, //110 Icelandic Male fallback
  { name: 'Damayanti' }, //111 Indonesian Female safari 8 mac
  { name: 'id-ID', rate: 0.25 }, //112 iOS
  { name: 'Fallback Indonesian', lang: 'id', fallbackvoice: true }, //113 Indonesian Female fallback
  { name: 'Fallback Latin', lang: 'la', fallbackvoice: true }, //114 Latin Female fallback
  { name: 'Fallback Latvian', lang: 'lv', fallbackvoice: true }, //115 Latvian Male fallback
  { name: 'Fallback Macedonian', lang: 'mk', fallbackvoice: true }, //116 Macedonian Male fallback
  { name: 'Fallback Moldavian', lang: 'mo', fallbackvoice: true }, //117 Moldavian Male fallback
  { name: 'Fallback Montenegrin', lang: 'sr-ME', fallbackvoice: true }, //118 Montenegrin Male fallback
  { name: 'Agata Compact' }, //119 Polish Female Mac
  { name: 'Zosia' }, //120 Polish Female safari 8 mac
  { name: 'pl-PL', rate: 0.25 }, //121 iOS
  { name: 'Fallback Polish', lang: 'pl', fallbackvoice: true }, //122 Polish Female fallback
  { name: 'Raquel Compact' }, //123 Brazilian Portugese Female Male Mac
  { name: 'Luciana' }, //124 Brazilian Portugese Female safari 8 mac
  { name: 'pt-BR', rate: 0.25 }, //125 iOS
  { name: 'Fallback Brazilian Portugese', lang: 'pt-BR', fallbackvoice: true }, //126 Brazilian Portugese Female fallback
  { name: 'Joana Compact' }, //127 Portuguese Female Mac
  { name: 'Joana' }, //128 Portuguese Female safari 8 mac
  { name: 'pt-PT', rate: 0.25 }, //129 iOS
  { name: 'Fallback Portuguese', lang: 'pt-PT', fallbackvoice: true }, //130 Portuguese Female fallback
  { name: 'Fallback Serbo-Croation', lang: 'sh', fallbackvoice: true }, //131 Serbo-Croation Male fallback
  { name: 'Laura Compact' }, //132 Slovak Female Mac
  { name: 'Laura' }, //133 Slovak Female safari 8 mac
  { name: 'sk-SK', rate: 0.25 }, //134 iOS
  { name: 'Fallback Slovak', lang: 'sk', fallbackvoice: true }, //135 Slovak Female fallback

  // Gender Disparity
  { name: 'Javier Compact' }, //136 Spanish (Latin American) Male Mac
  { name: 'Paulina' }, //137 Spanish Mexican Female safari 8 mac
  { name: 'es-MX', rate: 0.25 }, //138 iOS
  { name: 'Fallback Spanish (Latin American)', lang: 'es-419', fallbackvoice: true }, //139 Spanish (Latin American) Female fallback
  { name: 'Fallback Swahili', lang: 'sw', fallbackvoice: true }, //140 Swahili Male fallback
  { name: 'Fallback Tamil', lang: 'ta', fallbackvoice: true }, //141 Tamil Male fallback
  { name: 'Narisa Compact' }, //142 Thai Female Mac
  { name: 'Kanya' }, //143 Thai Female safari 8 mac
  { name: 'th-TH', rate: 0.25 }, //144 iOS
  { name: 'Fallback Thai', lang: 'th', fallbackvoice: true }, //145 Thai Female fallback
  { name: 'Fallback Vietnamese', lang: 'vi', fallbackvoice: true }, //146 Vietnamese Male fallback
  { name: 'Fallback Welsh', lang: 'cy', fallbackvoice: true }, //147 Welsh Male fallback

  // Gender Disparity
  { name: 'Oskar Compact' }, //148 Swedish Male Mac
  { name: 'sv-SE', rate: 0.25 }, //149 iOS

  // Gender Disparity
  { name: 'Simona Compact' }, //150 Romanian mac female
  { name: 'Ioana' }, //151 Romanian Female safari 8 mac
  { name: 'ro-RO', rate: 0.25 }, //152 iOS female
  { name: 'Kyoko' }, //153 Japanese Female safari 8 mac
  { name: 'Lekha' }, //154 Hindi Female safari 8 mac
  { name: 'Ting-Ting' }, //155 Chinese Female safari 8 mac
  { name: 'Yuna' }, //156 Korean Female safari 8 mac

  // Gender Disparity
  { name: 'Xander Compact' }, //157 Dutch male or female nl safari 8 mac
  { name: 'nl-NL', rate: 0.25 }, //158 iOS
  { name: 'Fallback UK English Male', lang: 'en-GB', fallbackvoice: true, service: 'g1', voicename: 'rjs' }, //159 UK Male fallback
  { name: 'Finnish Male', lang: 'fi', fallbackvoice: true, service: 'g1', voicename: '' }, //160 Finnish Male fallback
  { name: 'Czech Male', lang: 'cs', fallbackvoice: true, service: 'g1', voicename: '' }, //161 Czech Male fallback
  { name: 'Danish Male', lang: 'da', fallbackvoice: true, service: 'g1', voicename: '' }, //162 Danish Male fallback
  { name: 'Greek Male', lang: 'el', fallbackvoice: true, service: 'g1', voicename: '' }, //163 Greek Male fallback
  { name: 'Hungarian Male', lang: 'hu', fallbackvoice: true, service: 'g1', voicename: '' }, //164 Hungarian Male fallback
  { name: 'Latin Male', lang: 'la', fallbackvoice: true, service: 'g1', voicename: '' }, //165 Latin Male fallback
  { name: 'Norwegian Male', lang: 'no', fallbackvoice: true, service: 'g1', voicename: '' }, //166 Norwegian Male fallback
  { name: 'Slovak Male', lang: 'sk', fallbackvoice: true, service: 'g1', voicename: '' }, //167 Slovak Male fallback
  { name: 'Swedish Male', lang: 'sv', fallbackvoice: true, service: 'g1', voicename: '' }, //168 Swedish Male fallback
  { name: 'Fallback US English Male', lang: 'en', fallbackvoice: true, service: 'tts-api', voicename: '' }, //169 US English Male fallback
  { name: 'German Germany', lang: 'de_DE' }, //170 Android 5 German Female
  { name: 'English United Kingdom', lang: 'en_GB' }, //171 Android 5 English United Kingdom Female
  { name: 'English India', lang: 'en_IN' }, //172 Android 5 English India Female
  { name: 'English United States', lang: 'en_US' }, //173 Android 5 English United States Female
  { name: 'Spanish Spain', lang: 'es_ES' }, //174 Android 5 Spanish Female
  { name: 'Spanish Mexico', lang: 'es_MX' }, //175 Android 5 Spanish Mexico Female
  { name: 'Spanish United States', lang: 'es_US' }, //176 Android 5 Spanish Mexico Female
  { name: 'French Belgium', lang: 'fr_BE' }, //177 Android 5 French Belgium Female
  { name: 'French France', lang: 'fr_FR' }, //178 Android 5 French France Female
  { name: 'Hindi India', lang: 'hi_IN' }, //179 Android 5 Hindi India Female
  { name: 'Indonesian Indonesia', lang: 'in_ID' }, //180 Android 5 Indonesian Female
  { name: 'Italian Italy', lang: 'it_IT' }, //181 Android 5 Italian Female
  { name: 'Japanese Japan', lang: 'ja_JP' }, //182 Android 5 Japanese Female
  { name: 'Korean South Korea', lang: 'ko_KR' }, //183 Android 5 Japanese Female
  { name: 'Dutch Netherlands', lang: 'nl_NL' }, //184 Android 5 Dutch Female
  { name: 'Polish Poland', lang: 'pl_PL' }, //185 Android 5 Polish Female
  { name: 'Portuguese Brazil', lang: 'pt_BR' }, //186 Android 5 Portuguese Brazil Female
  { name: 'Portuguese Portugal', lang: 'pt_PT' }, //187 Android 5 Portuguese Portugal Female
  { name: 'Russian Russia', lang: 'ru_RU' }, //188 Android 5 Russian Female
  { name: 'Thai Thailand', lang: 'th_TH' }, //189 Android 5 Thai Female
  { name: 'Turkish Turkey', lang: 'tr_TR' }, //190 Android 5 Turkish Female
  { name: 'Chinese China', lang: 'zh_CN_#Hans' }, //191 Android 5 Chinese China Female
  { name: 'Chinese Hong Kong', lang: 'zh_HK_#Hans' }, //192 Android 5 Chinese Hong Kong Simplified Female
  { name: 'Chinese Hong Kong', lang: 'zh_HK_#Hant' }, //193 Android 5 Chinese Hong Kong Traditional Female
  { name: 'Chinese Taiwan', lang: 'zh_TW_#Hant' } //194 Android 5 Polish Female
  ],
  defaultTypes: [{ name: 'UK English Female', ids: [3, 5, 1, 6, 7, 171, 8] }, { name: 'UK English Male', ids: [0, 4, 2, 6, 7, 75, 159] }, { name: 'US English Female', ids: [39, 40, 41, 42, 43, 173, 44] }, { name: 'Arabic Male', ids: [96, 95, 97, 98] }, { name: 'Armenian Male', ids: [99] }, { name: 'Australian Female', ids: [87, 86, 5, 88] }, { name: 'Brazilian Portuguese Female', ids: [124, 123, 125, 186, 126] }, { name: 'Chinese Female', ids: [58, 59, 60, 155, 191, 61] }, { name: 'Czech Female', ids: [101, 100, 102, 103] }, { name: 'Danish Female', ids: [105, 104, 106, 107] }, { name: 'Deutsch Female', ids: [27, 28, 29, 30, 31, 78, 170, 32] }, { name: 'Dutch Female', ids: [84, 157, 158, 184, 45] }, { name: 'Finnish Female', ids: [90, 89, 91, 92] }, { name: 'French Female', ids: [21, 22, 23, 77, 178, 26] }, { name: 'Greek Female', ids: [62, 63, 80, 64] }, { name: 'Hatian Creole Female', ids: [109] }, { name: 'Hindi Female', ids: [66, 154, 179, 67] }, { name: 'Hungarian Female', ids: [9, 10, 81, 11] }, { name: 'Indonesian Female', ids: [111, 112, 180, 113] }, { name: 'Italian Female', ids: [33, 34, 35, 36, 37, 79, 181, 38] }, { name: 'Japanese Female', ids: [50, 51, 52, 153, 182, 53] }, { name: 'Korean Female', ids: [54, 55, 56, 156, 183, 57] }, { name: 'Latin Female', ids: [114] }, { name: 'Norwegian Female', ids: [72, 73, 74] }, { name: 'Polish Female', ids: [120, 119, 121, 185, 122] }, { name: 'Portuguese Female', ids: [128, 127, 129, 187, 130] }, { name: 'Romanian Male', ids: [151, 150, 152, 46] }, { name: 'Russian Female', ids: [47, 48, 83, 188, 49] }, { name: 'Slovak Female', ids: [133, 132, 134, 135] }, { name: 'Spanish Female', ids: [19, 16, 17, 18, 20, 76, 174, 15] }, { name: 'Spanish Latin American Female', ids: [137, 136, 138, 175, 139] }, { name: 'Swedish Female', ids: [85, 148, 149, 65] }, { name: 'Tamil Male', ids: [141] }, { name: 'Thai Female', ids: [143, 142, 144, 189, 145] }, { name: 'Turkish Female', ids: [69, 70, 82, 190, 71] }, { name: 'Afrikaans Male', ids: [93] }, { name: 'Albanian Male', ids: [94] }, { name: 'Bosnian Male', ids: [14] }, { name: 'Catalan Male', ids: [68] }, { name: 'Croatian Male', ids: [13] }, { name: 'Czech Male', ids: [161] }, { name: 'Danish Male', ids: [162] }, { name: 'Esperanto Male', ids: [108] }, { name: 'Finnish Male', ids: [160] }, { name: 'Greek Male', ids: [163] }, { name: 'Hungarian Male', ids: [164] }, { name: 'Icelandic Male', ids: [110] }, { name: 'Latin Male', ids: [165] }, { name: 'Latvian Male', ids: [115] }, { name: 'Macedonian Male', ids: [116] }, { name: 'Moldavian Male', ids: [117] }, { name: 'Montenegrin Male', ids: [118] }, { name: 'Norwegian Male', ids: [166] }, { name: 'Serbian Male', ids: [12] }, { name: 'Serbo-Croatian Male', ids: [131] }, { name: 'Slovak Male', ids: [167] }, { name: 'Swahili Male', ids: [140] }, { name: 'Swedish Male', ids: [168] }, { name: 'Vietnamese Male', ids: [146] }, { name: 'Welsh Male', ids: [147] }, { name: 'US English Male', ids: [169] }]
};

},{}],6:[function(require,module,exports){
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

var _enums = require('./common/enums');

var _enums2 = _interopRequireDefault(_enums);

var _cookies = require('./utils/cookies');

var _cookies2 = _interopRequireDefault(_cookies);

var _uuid2 = require('./utils/uuid');

var _uuid3 = _interopRequireDefault(_uuid2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var slice = [].slice;
var _ref = {},
    toString = _ref.toString;
var _trim = String.prototype.trim;

var class2type = {};
var noop = function noop() {};

var indexOf = function indexOf(collection, item) {
  var i = 0,
      k = collection.length;

  for (; i < k; i++) {
    if (collection[i] === item) {
      return i;
    }
  }

  return -1;
};

var _each = function _each(collection, fn) {
  var i = 0,
      k = collection.length;

  for (; i < k; i++) {
    var result = fn.call(collection[i], collection[i], i);

    if (result === false) {
      break;
    }
  }
};

/**
 * Eleven
 * @constructor
 * @param  {Object} options Object containing Eleven's configuration
 * @return {Object}         Eleven instance
 */
var $ = function $(selector, options) {
  return $.initialized || new $.fn.init(selector, options);
};

$.fn = $.prototype = {
  constructor: $,
  version: '1.0.0',
  context: null,
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
      wake: {
        commands: ['eleven', '11'],
        audio: 'https://s3-us-west-1.amazonaws.com/voicelabs/static/chime.mp3',
        commandWait: 10000
      },
      visualizer: {
        height: 140,
        ratio: 2,
        wavesContainer: '.waves',
        width: 280
      },
      template: '\n         <div class="eleven-container">\n          <div class="eleven-container-inner">\n            <div class="eleven-off">\n              <span>ELEVEN</span>\n            </div>\n            <div class="eleven-on">\n              <div class="bg"></div>\n              <div class="waves"></div>\n            </div>\n          </div>\n        </div>\n      '
    };

    this.container = _document2.default.querySelector(selector);
    // store options
    this.options = $.extend(true, {}, defaultConfig, options || {});
    // create markup
    this.container.innerHTML = this.options.template;
    // reference to all of our commands
    this.commands = [];
    // reference hash for installed plugins
    this.plugins = {};
    // create audio sound
    this.wakeSound = new Audio(this.options.wake.audio);
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
      $$.debug = true;
      console.debug(this);
    }
    // allow single instance (Speech API does not support multiple instances yet)
    $.initialized = this;
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
  cookies: _cookies2.default,
  indexOf: indexOf,
  plugins: {},
  each: function each(collection, fn) {
    if (typeof collection === 'function') {
      fn = collection;
      collection = this;
    }

    if (typeof collection.length === 'number') {
      _each(collection, function (item, index) {
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
    return $.isArray(array) ? (result = indexOf(array, item)) && (position ? result : result !== -1) : -1;
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
    return (0, _uuid3.default)();
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
    // if(options.commands){
    //   this.addCommands(options.commands);
    // }
    // setup all SpeechRecognition event listeners
    this.listen();
    // fire activation event
    if ($.isFunction(options.onActivate)) {
      options.onActivate.call(this);
    }

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

    if (this.options.wake.commands.indexOf(result[0].transcript.trim()) !== -1) {
      if (!this.activated) {
        this.activated = true;
        this.container.classList.add('ready');
        this.wakeSound.play();

        this.commandTimer = setTimeout(function () {
          _this4.activated = false;
          _this4.container.classList.remove('ready');
        }, this.options.wake.commandWait);
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

},{"./common/enums":4,"./document":7,"./speechRecognition":11,"./utils/cookies":13,"./utils/uuid":14,"./window":16}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _window2.default.document;

},{"./window":16}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

require('./ajax');

require('./commands');

require('./regexp');

require('./speechSynthesis');

require('./visualizer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _core2.default;

},{"./ajax":1,"./commands":3,"./core":6,"./regexp":10,"./speechSynthesis":12,"./visualizer":15}],9:[function(require,module,exports){
'use strict';

var _eleven = require('./eleven');

var _eleven2 = _interopRequireDefault(_eleven);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (root) {
  return root.Eleven = root.$$ = _eleven2.default;
})(window);

},{"./eleven":8}],10:[function(require,module,exports){
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

},{"./core":6}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _window2.default.SpeechRecognition || _window2.default.webkitSpeechRecognition || _window2.default.mozSpeechRecognition || _window2.default.msSpeechRecognition || _window2.default.oSpeechRecognition;

},{"./window":16}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

var _voiceConfigs = require('./common/voiceConfigs');

var _voiceConfigs2 = _interopRequireDefault(_voiceConfigs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var speechSynthesis = _window2.default.speechSynthesis;

var Speech = {
  init: function init(options) {
    var _this = this;

    this.voiceTypes = _voiceConfigs2.default.defaultTypes;
    this.voiceTypesCollection = _voiceConfigs2.default.allTypes;
    this.deviceSupportedVoices = null;
    this.messageConfig = null;

    this.CHARACTER_LIMIT = 100;
    this.WORDS_PER_MINUTE = 140;

    // wait until system voices are ready and trigger the event OnVoiceReady
    if (speechSynthesis) {
      speechSynthesis.onvoiceschanged = function () {
        _this.deviceSupportedVoices = speechSynthesis.getVoices();
      };
    }

    this.defaultVoiceSelection = this.voiceTypes[0];

    // wait a 100ms before calling getVoices() to correct issues with Chrome
    setTimeout(function () {
      var voices = speechSynthesis.getVoices();

      if (voices.length) {
        console.debug('[Eleven] Voice support is ready');
        _this.deviceVoicesReady(voices);
      } else {
        console.warn('[Eleven] Voice synthesis is not supported.');
      }
    }, 100);

    return this.speak;
  },
  /**
   * [function description]
   * @param  {[type]} voices [description]
   * @return {[type]}        [description]
   */
  deviceVoicesReady: function deviceVoicesReady(voices) {
    this.deviceSupportedVoices = voices;

    this.mapSupportedVoices();
  },
  /**
   * Maps the system voices to our default voices settings
   * @return {[type]} [description]
   */
  mapSupportedVoices: function mapSupportedVoices() {
    var self = this;

    _core2.default.each(this.voiceTypes, function (voiceOption) {
      _core2.default.each(voiceOption.ids, function (id) {
        var voiceInCollection = self.voiceTypesCollection[id],
            systemVoice = !voiceInCollection.fallbackvoice ? self.getDeviceSupportedVoice(voiceInCollection.name) : {};

        voiceOption.mappedProfile = {
          deviceVoice: systemVoice,
          collectionVoice: voiceInCollection
        };

        return false;
      });
    });
  },

  getDeviceSupportedVoice: function getDeviceSupportedVoice(name) {
    var result = null;

    if (!this.deviceSupportedVoices) {
      return null;
    }

    _core2.default.each(this.deviceSupportedVoices, function (voice) {
      if (voice.name === name) {
        result = voice;
        return false;
      }
    });

    return result;
  },

  cancel: function cancel() {
    this.cancelled = true;
    speechSynthesis.cancel();
  },

  getMatchedVoice: function getMatchedVoice(voice) {
    var self = this,
        result = null;

    _core2.default.each(voice.ids, function (id) {
      var find = self.getDeviceSupportedVoice(self.voiceTypesCollection[id].name);

      if (find) {
        result = find;
        return false;
      }
    });

    return result;
  },

  getResponsiveVoice: function getResponsiveVoice(name) {
    var result = null;

    _core2.default.each(this.voiceTypes, function (voice) {
      if (voice.name === name) {
        result = voice;
        return false;
      };
    });

    return result;
  },

  speak: function speak(text, voicename, parameters) {
    if (speechSynthesis.speaking) {
      this.cancelled = true;
      speechSynthesis.cancel();
    }

    text = text.replace(/[\"\`]/gm, '\'');

    this.messageConfig = parameters || {};
    this.msgtext = text;
    this.msgvoicename = voicename;

    // Support for multipart text (there is a limit on characters)
    var multipartText = [];

    if (text.length > this.CHARACTER_LIMIT) {
      var tmptxt = text;

      while (tmptxt.length > this.CHARACTER_LIMIT) {
        // split by common phrase delimiters
        var phrase = tmptxt.search(/[:!?.;]+/),
            part = '';

        // coludn't split by priority characters, try commas
        if (phrase == -1 || phrase >= this.CHARACTER_LIMIT) {
          phrase = tmptxt.search(/[,]+/);
        }

        // couldn't split by normal characters, then we use spaces
        if (phrase == -1 || phrase >= this.CHARACTER_LIMIT) {
          var words = tmptxt.split(' ');

          for (var i = 0; i < words.length; i++) {

            if (part.length + words[i].length + 1 > this.CHARACTER_LIMIT) {
              break;
            }

            part += (i != 0 ? ' ' : '') + words[i];
          }
        } else {
          part = tmptxt.substr(0, phrase + 1);
        }

        tmptxt = tmptxt.substr(part.length, tmptxt.length - part.length);

        multipartText.push(part);
      }

      // add the remaining text
      if (tmptxt.length) {
        multipartText.push(tmptxt);
      }
    } else {
      // small text
      multipartText.push(text);
    }

    // find system voice that matches voice name
    var rv = !voicename ? this.defaultVoiceSelection : this.getResponsiveVoice(voicename),
        profile = {};

    // Map was done so no need to look for the mapped voice
    if (rv.mappedProfile) {
      profile = rv.mappedProfile;
    } else {
      profile.deviceVoice = this.getMatchedVoice(rv);
      profile.collectionVoice = {};

      if (!profile.deviceVoice) {
        console.log('[Eleven] ERROR: No voice found for: ' + voicename);
        return;
      }
    }

    this.msgprofile = profile;

    for (var i = 0; i < multipartText.length; i++) {
      // Create msg object
      var msg = new SpeechSynthesisUtterance();

      _core2.default.extend(msg, {
        voice: profile.deviceVoice,
        voiceURI: profile.deviceVoice.voiceURI,
        volume: this.preferred([profile.collectionVoice.volume, profile.deviceVoice.volume, 1]), // 0 to 1
        rate: this.preferred([profile.collectionVoice.rate, profile.deviceVoice.rate, 1]), // 0.1 to 10
        pitch: this.preferred([profile.collectionVoice.pitch, profile.deviceVoice.pitch, 1]), // 0 to 2
        text: multipartText[i],
        lang: this.preferred([profile.collectionVoice.lang, profile.deviceVoice.lang]),
        rvIndex: i,
        rvTotal: multipartText.length
      });

      if (i == 0) {
        msg.onstart = _core2.default.proxy(this.start, this);
      }

      this.messageConfig.onendcalled = false;

      if (parameters) {
        if (i < multipartText.length - 1 && multipartText.length > 1) {
          msg.onend = parameters.onchunkend;
          msg.addEventListener('end', parameters.onchuckend);
        } else {
          msg.onend = this.stop;
          msg.addEventListener('end', _core2.default.proxy(this.stop, this));
        }

        msg.onerror = parameters.onerror || function (e) {
          console.log('[Eleven] Unknow Error');
          console.log(e);
        };

        msg.onpause = parameters.onpause;
        msg.onresume = parameters.onresume;
        msg.onmark = parameters.onmark;
        msg.onboundary = parameters.onboundary;
        msg.pitch = parameters.pitch ? parameters.pitch : msg.pitch;
        msg.rate = (parameters.rate ? parameters.rate : 1) * msg.rate;
        msg.volume = parameters.volume ? parameters.volume : msg.volume;
      } else {

        msg.onend = _core2.default.proxy(this.end, this);

        msg.onerror = function (e) {
          console.log('[Eleven] Unknow Error');
          console.log(e);
        };
      }

      speechSynthesis.speak(msg);
    }
  },

  start: function start() {
    this.messageConfig.onendcalled = false;

    if (this.messageConfig && _core2.default.isFunction(this.messageConfig.onStart)) {
      this.messageConfig.onStart();
    }
  },

  stop: function stop() {
    // avoid this being automatically called just after calling speechSynthesis.cancel
    if (this.cancelled === true) {
      this.cancelled = false;
      return;
    }

    //console.log("on end fired");
    if (this.messageConfig && this.messageConfig.onendcalled !== true && _core2.default.isFunction(this.messageConfig.onEnd)) {
      //console.log("Speech on end called  -" + this.msgtext);
      this.messageConfig.onendcalled = true;
      this.messageConfig.onEnd();
    }
  },

  preferred: function preferred(a) {
    for (var i = 0, k = a.length; i < k; i++) {
      if (a[i]) {
        return a[i];
      }
    }

    return null;
  }
};

// init SpeechSynthesis
Speech.init();
// export speak
_core2.default.speak = _core2.default.proxy(Speech.speak, Speech);

exports.default = _core2.default;

},{"./common/voiceConfigs":5,"./core":6,"./window":16}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _document = require('../document');

var _document2 = _interopRequireDefault(_document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cookies = {
  /**
   * Determines whether a specific cookie exists
   * @param  {String} key String containing the cookie key/name to for
   * @return {Boolean}    The true/false result
   */
  contains: function contains(key) {
    if (!key) {
      return false;
    }

    return new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=').test(_document2.default.cookie);
  },
  /**
   * Returns a cookie from document.cookies
   * @param  {String} key String containing the cookie name/key to lookup
   * @return {String}     The value of the passed cookie key
   */
  get: function get(key) {
    if (!key) {
      return null;
    }

    return decodeURIComponent(_document2.default.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1'));
  },
  /**
   * Returns all cookies keys found inside document.cookies
   * @return {Array} Collection of cookie key values
   */
  keys: function keys() {
    var keys = _document2.default.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);

    for (var i = 0, k = keys.length; i < k; i++) {
      keys[i] = decodeURIComponent(keys[i]);
    }

    return keys;
  },
  /**
   * Removes a cookie from document.cookies
   * @param  {String} key    String containing the cookie key/name to lookup
   * @param  {String} path   String containing the path defined during cookie creation
   * @param  {String} domain String containing the defined during cookie creation
   * @return {Object}        Cookie singleton
   */
  remove: function remove(key, path, domain) {
    if (!this.contains(key)) {
      return this;
    }

    _document2.default.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '');

    return this;
  },
  /**
   * Creates a new cookie from the passed arguments
   * @param  {String} key     String containing the cookie key/name to lookup
   * @param  {String} value   String containing the value you want to set inside the cookie
   * @param  {Mixed} age      Value of expiration
   * @param  {String} path    String containing the path in which the cookie will be available
   * @param  {String} domain  String containing the domains/subdomains the cookie will be available
   * @param  {Boolean} secure True, if secure
   * @return {Object}         Cookie singleton
   */
  set: function set(key, value, age, path, domain, secure) {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
      return false;
    }

    var expires = '';

    if (age) {
      switch (age.constructor) {
        case Number:
          expires = age === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + age;
          break;
        case String:
          expires = '; expires=' + age;
          break;
        case Date:
          expires = '; expires=' + age.toUTCString();
          break;
      }
    }

    _document2.default.cookie = [encodeURIComponent(key) + '=' + encodeURIComponent(value), expires, domain ? '; domain=' + domain : '', path ? '; path=' + path : '', secure ? '; secure' : ''].join('');

    return this;
  }
};

exports.default = cookies;

},{"../document":7}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

},{}],15:[function(require,module,exports){
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
  var options = config.options.visualizer || {};

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

},{"./core":6}],16:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = global;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[9])
//# sourceMappingURL=eleven.js.map
