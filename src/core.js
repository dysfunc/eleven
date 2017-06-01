import window from './common/window';
import SpeechRecognition from './speech/speechRecognition';
import { document } from './common/document';
import { each, indexOf } from './common/helpers';
import { toString } from './common/objects';
import { trim } from './common/strings';
import { concat, slice } from './common/arrays';

var initialized = null;

/**
 * Eleven
 * @constructor
 * @param  {Object} options Object containing Eleven's configuration
 * @return {Object}         Eleven instance
 */
const $ = (selector, options) => initialized || new $.fn.init(selector, options);

$.fn = $.prototype = {
  constructor: $,
  version: '1.0.0',
  init(selector, options){
    const defaultConfig = {
      debug: false,
      language: 'en-US',
      commands: [],
      autoRestart: true,
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      requiresWakeWord: true,
      speechAgent: 'Google UK English Female',
      useEngine: false,
      wakeCommands: ['eleven', '11'],
      wakeSound: 'https://s3-us-west-1.amazonaws.com/voicelabs/static/chime.mp3',
      wakeCommandWait: 10000,
      template: `
         <div class="eleven-container">
          <div class="eleven-container-inner">
            <div class="eleven-off">
              <span>ELEVEN</span>
            </div>
            <div class="eleven-on">
              <div class="bg"></div>
              <div class="waves"></div>
            </div>
          </div>
        </div>
      `
    };
    // create a ref to the container element
    this.container = document.querySelector(selector);
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
    // buffer restarts and prevent insanity
    this.lastStartTime = this.restartCount = 0;
    // used to manage eventing
    this.listening = false;
    // create interactive audio wave orb (aka Eleven)
    this.visualize();
    // prevent initialize until called
    if(!this.options.delayStart){
      // enable all the things!
      this.enable();
    }
    // print the instance config
    if(this.options.debug){
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
$.apply = function(target, config, defaults){
  defaults && $.apply(target, defaults);

  if(target && config && typeof(config) === 'object'){
    for(const i in config){
      target[i] = config[i];
    }
  }

  return target;
};

// type check cache
const class2type = {};

$.apply($, {
  /**
   * Converts a dasherized strings to camelCase
   * @param  {String} str The string to modify
   * @return {String}     The modified string
   */
  camelCase: (str) => str.trim().replace($.regexp.camel, (match, chr) => chr ? chr.toUpperCase() : ''),
  /**
   * Iterates over an Array or Object executing a callback function on each item
   * @param  {Mixed}    collection Array or Object to iterate over
   * @param  {Function} fn         Function to execute on each item
   * @return {Object}
   */
  each(collection, fn){
    if(typeof(collection) === 'function'){
      fn = collection;
      collection = this;
    }

    if(typeof(collection.length) === 'number'){
      each(collection, (item, index) => fn.call(item, item, index));
    }else if(typeof(collection) === 'object'){
      for(const key in collection){
        const result = fn.call(collection[key], key, collection[key]);

        if(result === false){
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
  dasherize: (str) => str.trim().replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase(),
  /**
   * Sets a timer to delay the execution of a function
   * @param  {Function} fn        The function to execute
   * @param  {Object}   context   The object that will set the context (this) of the function
   * @param  {Integer}  wait      The delay before executing the function (Defaults to 100)
   * @param  {Boolean}  immediate Execute the function immediately -> overrides delay
   */
  debounce(fn, context, delay, immediate){
    var timer = null,
        args = arguments;

    if(typeof(context) === 'number'){
      immediate = delay;
      delay = context;
      context = null;
    }

    return function(){
      var scope = context || this,
          delayed, now;

      delayed = function(){
        timer = null;
        !now && fn.apply(scope, args);
      };

      now = immediate && !timer;

      clearTimeout(timer);

      timer = setTimeout(delayed, delay || 200);

      now && fn.apply(scope, args);
    }
  },
  /**
   * Merge the contents of two or more objects into the target object
   * @param  {Boolean} deep      If true, the merge becomes recursive (optional)
   * @param  {Object}  target    Object receiving the new properties
   * @param  {Object}  arguments One or more additional objects to merge with the first
   * @return {Object}            The target object with the new contents
   */
  extend(){
    var i = 1,
        deep = false,
        target = arguments[0] || {},
        length = arguments.length;

    if($.isBoolean(target)){
      deep = target;
      target = arguments[1] || {};
      i++;
    }

    if(i === length){
      target = this;
      i--;
    }

    each(slice.call(arguments, i), (obj) => {
      var src, copy, isArray, clone;

      if(obj === target){
        return;
      }

      if(deep && $.isArray(obj)){
        target = target.concat(obj);
      }else{
        for(const key in obj){
          src = target[key];
          copy = obj[key];

          if(target === copy || src === copy){
            continue;
          }

          if(deep && copy && ($.isPlainObject(copy) || (isArray = $.isArray(copy)))){
            if(isArray){
              isArray = false;
              clone = src && $.isArray( src ) ? src : [];
            }else{
              clone = src && $.isPlainObject( src ) ? src : {};
            }

            target[key] = $.extend(deep, clone, copy);
          }
          else if(copy !== undefined){
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
  flatten: (array) => [...array],
  /**
   * Returns a formatted string template from the values of the passed argument
   * @param  {String} template The string template containing the place-holders
   * @param  {Mixed}  values   The argument containing the indexed values or property keys
   * @return {String}          The formatted string
   */
  format(template, values){
    if(!values || !($.isObject(values) || $.isArray(values))){
      return undefined;
    }

    const match = $.isObject(values) ? 'keys' : 'indexed';

    return template.replace($.regexp.templates[match], (match, key) => values[key] || '');
  },
  /**
   * Determines whether the array contains a specific value
   * @param  {Mixed}   item     The item to look for in the array
   * @param  {String}  array    The array of items
   * @param  {Boolean} position Set true to return the index of the matched item or -1
   * @return {Mixed}            The value of true or false, or the index at which the value can be found
   */
  inArray: (item, array, position) => array.includes(item, position),
  /**
   * Determines if the passed obj is an array or array-like object (NodeList, Arguments, etc...)
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isArrayLike(obj){
    const type = $.type(obj);
    const length = obj.length;

    if(type === 'function' || obj === window || type === 'string'){
      return false;
    }

    if(obj.nodeType === 1 && length){
      return true;
    }

    return type === 'array' || length === 0 || typeof(length) === 'number' && length > 0 && (length - 1) in obj;
  },
  /**
   * Determines if the passed obj is empty
   * @param  {Object}  obj Object to check the contents of
   * @return {Boolean}     The true/false result
   */
  isEmptyObject(obj){
    for(const key in obj){
      return false;
    }

    return true;
  },
  /**
   * Determines whether the passed object is a number
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isNumber: (obj) => !isNaN(parseFloat(obj)) && isFinite(obj),
  /**
   * Determines whether the passed object is numeric
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isNumeric: (obj) => !$.isArray(obj) && obj - parseFloat(obj) >= 0,
  /**
   * Determine whether an Object is a plain object or not (created using "{}" or "new Object")
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isPlainObject: (obj) => $.isObject(obj) && !$.isWindow(obj) && !obj.nodeType && Object.getPrototypeOf(obj) === Object.prototype,
  /**
   * Determines whether the passed object is the Window object
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isWindow: (obj) => obj !== null && obj === global,
  /**
   * Returns a new array from the results of the mapping
   * @param  {Array}    elements The array to map
   * @param  {Function} fn       The function to execute on each item
   * @return {Array}             The new array
   */
  map(elements, fn){
    const k = elements.length;
    const values = [];

    if(elements.length){
      var i = 0;

      for(; i < k; i++){
        const value = fn(elements[i], i);

        if(value !== null){
          values.push(value);
        }
      }
    }else{
      for(const key in elements){
        const value = fn(elements[key], key);

        if(value !== null){
          values.push(value);
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
  merge(first, second){
    const total = second.length;
    var length = first.length;
    var i = 0;

    if(typeof(total) === 'number'){
      for(; i < total; i++){
        first[length++] = second[i];
      }
    }else{
      while(second[i] !== undefined){
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
  parseJSON(text, reviver){
    try {
      return JSON.parse(`${text}`, reviver);
    }catch(error){
      throw `Error occurred while trying to parse JSON string: ${error}`;
    }
  },
  /**
   * Parse a string as XML
   * @param  {String} xml The XML string to parse
   * @return {Object}     The DOM XML Object
   */
  parseXML(xml){
    var parsed;

    if(!xml || typeof(xml) !== 'string'){
      return null;
    }

    try {
      parsed = (new DOMParser).parseFromString(xml, 'text/xml');
    }catch(error){
      parsed = null;
    }

    if(!parsed || parsed.getElementsByTagName('parsererror').length){
      throw Error(`Invalid XML: ${xml}`);
    }

    return parsed;
  },
  /**
   * Executes a function within a specific scope
   * @param  {Function} fn    The function whose scope will change
   * @param  {Object}   scope The scope in which the function should be called
   * @return {Function}       The function with the modified scope
   */
  proxy(fn, scope){
    const args = slice.call(arguments, 2);

    return $.isFunction(fn) ? function proxy(){
      return fn.apply(scope || this, [...args, ...arguments])
    } : undefined;
  },
  /**
   * Executes the passed function when the DOM is "ready"
   * @param {Function} fn The function to execute
   */
  ready(fn){
    if(($.regexp.readyState).test(document.readyState)){
      fn.call();
    }else{
      document.addEventListener('DOMContentLoaded', fn, false);
    }

    return this;
  },
  /**
   * Removes all rendered elements from the viewport and executes a callback
   * @param  {Function} fn Function to execute once the view has been cleared
   */
  resetView(selector = '.results', fn){
    if($.isFunction(selector)){
      fn = selector;
      selector = '.results';
    }

    const results = document.querySelectorAll(selector);

    if(results && results.length){
      results.forEach((element) => element.parentNode && element.parentNode.removeChild(element));
    }

    if($.isFunction(fn)){
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
  stringify(value, replacer, spaces){
    try {
      return JSON.stringify(value, replacer, spaces);
    }catch(error){
      throw `Error occurred while trying to stringify JSON: ${error}`;
    }
  },
  /**
   * Converts anything that can be iterated over into a real JavaScript Array
   * @param  {Mixed}   item  Can be a string, array or arugments object
   * @param  {Integer} start Zero-based index to start the array at (optional)
   * @param  {Integer} end   Zero-based index to end the array at (optional)
   * @return {Array}         The new array
   */
  toArray(item, start, end){
    const array = [];

    if(!item || !item.length){
      return array;
    }

    $.isString(item) && (item = item.split(''));

    end = (end && end < 0 && item.length + end || end) || item.length;

    for(var i = (start || 0); i < end; i++){
      array.push(item[i]);
    }

    return array;
  },
  /**
   * Returns the internal JavaScript [Class]] of an Object
   * @param  {Object} obj Object to check the class property of
   * @return {String}     Only the class property of the Object
   */
  type: (obj) => obj === null ? String(obj) : class2type[toString.call(obj)],
  /**
   * Filters an array and by removing duplicates items
   * @param  {Array} collection The array to filter
   * @return {Array}            The modified array
   */
  unique(collection){
    for(var i = 0; i < collection.length; i++){
      if(indexOf(collection, collection[i]) !== i){
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
  uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
});

/**
 * Creates type class check methods $.isArray(), $.isBoolean(), ...
 * @param  {Object}  obj The Object to type check
 * @return {Boolean}     The value of true or false
 */
each(['Array', 'Boolean', 'Date', 'Error', 'Function', 'Object', 'RegExp', 'String'], function(name){
  class2type[`[object ${name}]`] = name.toLowerCase();

  $[`is${name}`] = (obj) => $.type(obj) === name.toLowerCase();
});

$.fn.init.prototype = $.fn;

$.apply($.fn, {
  extend: $.extend,
  /**
   * Iterates over a collection of objects
   * @param {Mixed}    collection Collection to iterate over
   * @param {Function} fn         Callback function
   */
  error(event){
    const { error } = event;

    if(error === 'not-allowed' || error === 'network'){
      this.options.autoRestart = false;
    }

    if(this.options.debug){
      console.warn(`[Eleven] SpeechRecognition event error: ${error}`);
    }
  },
  /**
   * Initializes the SpeechRecognition API, adds commands and binds event
   * listeners. To avoid overlap with other tabs listening we used the
   * `pagevisibility` API to abort the inactive tab instance.
   * @return {Object} Eleven instance
   */
  enable(){
    const options = this.options;
    // reference to SpeechRecognition instance
    this.recognition = new SpeechRecognition();
    // set language
    if(options.lang){
      this.recognition.lang = options.lang;
    }
    // set max alternative results
    this.recognition.maxAlternatives = options.maxAlternatives;
    // set continuous listening
    this.recognition.continuous = options.continuous;
    // return results immediately so we can emulate audio waves
    this.recognition.interimResults = options.interimResults;
    // if true, this will pass all speech back to the onCommand callback
    if(options.useEngine){
      this.addCommands({
        '*msg': options.onCommand
      });
    }
    // add commands
    this.addCommands('eleven', {
      'stop': () => {
        if(this.listening){
          $.resetView(() => {
            document.body.classList.remove('interactive');
          });

          this.stop();
        }

        if($.isFunction(options.onStop)){
          this.context = null;
          options.onStop.call(this);
        }
      }
    });

    // load user defined commands
    if(options.commands){
      this.addCommands('eleven', options.commands);
    }
    // setup all SpeechRecognition event listeners
    this.listen();
    // fire activation event
    if($.isFunction(options.onActivate)){
      options.onActivate.call(this);
    }

    const autoRestartConfig = options.autoRestart;

    document.addEventListener('visibilitychange', () => {
      if(document.hidden){
        if(this.recognition && this.recognition.abort && this.listening){
          if(this.debug){
            console.debug('[Eleven] User switched to another tab. Disabling listeners.');
          }

          this.options.autoRestart = false;
          this.stop();
          this.recognition.abort();
        }
      }else{
        if(this.recognition && !this.listening){
          if(this.debug){
            console.debug('[Eleven] User switched back to this tab. Enabling listeners.');
          }

          this.options.autoRestart = autoRestartConfig;
          this.start();
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
  listen(){
    this.recognition.onend = $.proxy(this.stop, this);
    this.recognition.onerror = $.proxy(this.error, this);
    this.recognition.onresult = $.proxy(this.result, this);
    this.recognition.onstart = $.proxy(this.start, this);
    this.recognition.onaudioend = $.proxy(this.stop, this);
    this.recognition.onaudiostart = () => {
      if($.isFunction(this.options.onStart)){
        this.options.onStart.call(this);
      }
    };
  },

  restart(){
    const timeSinceLastStart = new Date().getTime() - this.lastStartTime;

    this.restartCount += 1;

    if(this.restartCount % 10 === 0){
      if(this.options.debug){
        console.debug('[Eleven] Speech Recognition is repeatedly stopping and starting.');
      }
    }

    if(timeSinceLastStart < 1000){
      setTimeout(() => {
        this.start();
      }, 1000 - timeSinceLastStart);
    }else{
      this.start();
    }
  },

  start(){
    if(!this.listening){
      this.listening = true;

      this.lastStartTime = new Date().getTime();

      try {
        this.recognition.start();
      }
      catch(e){
        if(this.options.debug){
          console.warn(`[Eleven] Error trying to start SpeechRecognition: ${e.message}`);
        }
      }
    }

    return this;
  },

  stop(){
    if(this.listening){
      this.listening = false;

      if(this.running && this.visualizer){
        this.running = false;
        this.visualizer.stop();
      }

      if($.isFunction(this.options.onEnd)){
        this.options.onEnd.call(this);
      }

      if(this.options.autoRestart){
        this.restart();
      }
    }

    return this;
  }
});

export default $;
