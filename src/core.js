import document from './document';
import window from './window';
import SpeechRecognition from './speechRecognition';
import SpeechSynthesis from './speechSynthesis';
import SpeechSynthesisOverrides from './speechSynthesisOverrides';
import { each, indexOf, slice, toString, trim } from './utils';

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
      maxAlternatives: 5,
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
    if(!this.options.delayStart){
      // enable all the things!
      this.enable();
    }
    // print the instance config
    if(this.options.debug){
      $.debug = true;
      console.debug(this);
    }
    // configure speechSynthesis
    this.synthesis();
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
// plugin registry cache
const plugins = {};

$.apply($, {
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

    $.each(slice.call(arguments, i), (obj) => {
      var src, copy, isArray, clone;

      if(obj === target){
        return;
      }

      if(deep && $.isArray(obj)){
        target = target.concat(obj);
      }else{
        for(var key in obj){
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
   * Determines whether the array contains a specific value
   * @param  {Mixed}   item     The item to look for in the array
   * @param  {String}  array    The array of items
   * @param  {Boolean} position Set true to return the index of the matched item or -1
   * @return {Mixed}            The value of true or false, or the index at which the value can be found
   */
  inArray(item, array, position){
    var result;
    return $.isArray(array) ? (result = indexOf(array, item)) && (position ? result : result !== -1) : -1;
  },
  /**
   * Determines whether the passed object is a number
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isNumber(obj){
    return !isNaN(parseFloat(obj)) && isFinite(obj);
  },
  /**
   * Determines whether the passed object is numeric
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isNumeric(obj){
    return !$.isArray(obj) && obj - parseFloat(obj) >= 0;
  },
  /**
   * Determine whether an Object is a plain object or not (created using "{}" or "new Object")
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isPlainObject(obj){
    return $.isObject(obj) && !$.isWindow(obj) && !obj.nodeType && Object.getPrototypeOf(obj) === Object.prototype;
  },
  /**
   * Determines whether the passed object is the Window object
   * @param  {Object}  obj Object to type check
   * @return {Boolean}     The true/false result
   */
  isWindow(obj){
    return obj !== null && obj === global;
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
   * Adds plugin to the plugin registry for any Eleven instance to bind to
   * @param {String}  name String containing the plugins unique name
   * @param {Functio} fn   Constructor function of plugin
   */
  plugin(name, fn){
    if(!plugins[name]){
      if(!$.isFunction(fn)){
        throw `"${name}" does not have a constructor.`;
      }else{
        plugins[name] = fn;
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
    return JSON.stringify(value, replacer, spaces);
  },
  /**
   * Returns the internal JavaScript [Class]] of an Object
   * @param  {Object} obj Object to check the class property of
   * @return {String}     Only the class property of the Object
   */
  type(obj){
    return obj === null ? String(obj) : class2type[toString.call(obj)];
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
$.each(['Array', 'Boolean', 'Date', 'Error', 'Function', 'Object', 'RegExp', 'String'], function(name){
  class2type[`[object ${name}]`] = name.toLowerCase();

  $[`is${name}`] = (obj) => $.type(obj) === name.toLowerCase();
});

$.fn.init.prototype = $.fn;

$.apply($.fn, {
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
  getPlugin(name){
    if(!this.plugins[name]){
      throw `"${name}" plugin does not exist!`;
    }

    return this.plugins[name];
  },
  /**
   * Registers a plugin with a given Eleven instance
   * @param {String} name    String containing the plugins unique name
   * @param {Object} options Object containing the options for that plugin
   * @type {Object}          Eleven
   */
  plugin(name, options = {}){
    // console.log(name, options.commands);
    if(!this.plugins[name] && plugins[name]){

      if(options.commands){
        this.addCommands(name, options.commands);
      }

      this.plugins[name] = new plugins[name](options);
    }else{
      throw `"${name}" plugin does not exist!`;
    }

    return this;
  },
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

  parser(results){
    var scoped = false;

    if($.isFunction(this.options.onResult)){
      this.options.onResult.call(this, results);
    }

    setTimeout(() => {
      if(this.running && this.visualizer){
        this.running = false;
        this.visualizer.stop();
      }

      this.container.classList.remove('ready');
      this.activated = false;
    }, 750);

    for(var i = 0, k = results.length; i < k; i++){
      const recognizedSpeech = results[i].trim();

      if(this.options.debug){
        console.debug(`[Eleven] Speech recognized: ${recognizedSpeech}`);
      }

      if(this.context){
        scoped = this.lookup(this.context, this.commands[this.context], recognizedSpeech);
      }

      if(!scoped){
        this.context = null;

        for(const context in this.commands){
          const result = this.lookup(context, this.commands[context], recognizedSpeech);

          if(result){
            break;
          }
        }
      }
    }

    if($.isFunction(this.options.onResultNoMatch)){
      options.onResultNoMatch.call(this, results);
    }

    return this;
  },

  lookup(name, context, speech) {
    for(const item in context){
      const command = context[item];
      const plugin = name === 'eleven' ? this : this.getPlugin(name);
      const phrase = command.phrase;
      const result = command.regexp.exec(speech);

      if(result){
        this.context = name;

        var parameters = result.slice(1);

        if(this.options.debug){
          console.debug(`[Eleven] Command match: ${name} - ${phrase}`);

          if(parameters.length){
            console.debug(`[Eleven] Command results contain parameters: ${JSON.stringify(parameters, null, 2)}`);
          }
        }

        command.callback.call(this, parameters, speech, phrase, plugin);

        if($.isFunction(this.options.onResultMatch)){
          this.options.onResultMatch.call(this, parameters, speech, phrase, results);
        }

        this.container.classList.remove('ready');

        this.activated = false;

        return true;
      }
    }

    return false;
  },

  result(event){
    const result = event.results[event.resultIndex];
    const results = [];

    if(this.options.wakeCommands.indexOf(result[0].transcript.trim()) !== -1){
      if(!this.activated){
        this.activated = true;
        this.container.classList.add('ready');
        this.wakeSound.play();

        this.commandTimer = setTimeout(() => {
          this.activated = false;
          this.container.classList.remove('ready');
        }, this.options.wakeCommandWait);
      }
    }else {
      if(this.activated){
        if(!this.running && this.visualizer){
          this.running = true;
          this.visualizer.start();
          clearTimeout(this.commandTimer);
        }

        for(var i = 0, k = result.length; i < k; i++){
          if(result.isFinal){
            results[i] = result[i].transcript.trim();
          }
        }

        if(results.length){
          this.parser(results);
        }
      }
    }

    return this;
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
  },

  synthesis() {
    // setup speech synthesis
    SpeechSynthesis.onvoiceschanged = () => {
      $.supportedVoices = SpeechSynthesis.getVoices();
    };
    // hack to fix issues with Chrome
    setTimeout(() => {
      if(!SpeechSynthesis){
        console.warn('[Eleven] Voice synthesis is not supported.');
      }else{
        $.supportedVoices = SpeechSynthesis.getVoices();

        if($.supportedVoices.length > 0){
          $.mappedSupportedVoices = $.supportedVoices.slice().reduce((obj, item) => {
            const overrides = SpeechSynthesisOverrides[item.name] || {};

            obj[item.name] = $.extend({}, item, overrides, { suppportedVoice: item });

            return obj;
          }, {});

          $.speechAgent = $.mappedSupportedVoices[this.options.speechAgent] || $.mappedSupportedVoices[0];
        }
      }
    }, 500);

    return SpeechSynthesis;
  }
});

export default $;
