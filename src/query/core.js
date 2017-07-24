import Eleven from '../core';
import window from '../common/window';
import { document } from '../common/document';
import { toString } from '../common/objects';
import { concat, forEach, reduce, slice, splice } from '../common/arrays';
import { each, indexOf } from '../common/helpers';

const fragmentContainer = {};

/**
 * Define a local copy of $
 * @param {Mixed} selector String containing CSS selector(s), HTML tags to create, or DOM Element
 * @param {Mixed} context  Context in which to perform the search (can be a CSS Selector or DOM Element)
 */
const $ = (selector, context) => new $.fn.init(selector, context);

$.fn = $.prototype = {
  constructor: $,
  version: '1.0.0',
  init(selector, context){
    this.length = 0;

    if(!selector){
      return this;
    }

    if(selector.constructor === $){
      return selector;
    }

    var type = typeof(selector);

    if(type === 'function'){
      return $(document).ready(selector);
    }

    this.selector = selector;
    this.context = context;

    if(selector === 'body' || selector === document.body){
      this[this.length++] = this.context = document.body;
      return this;
    }

    if(selector === window || selector.nodeType || selector === 'body'){
      this[this.length++] = this.context = selector;
      return this;
    }

    if(type === 'string'){
      selector = selector.trim()

      if(selector[0] === '<' && selector[selector.length - 1] === '>' && ($.regexp.fragments).test(selector)){
        selector = $.fragment(document.createElement(fragmentContainer[RegExp.$1] || 'div'), selector);
        this.selector = selector;
      }
    }

    if(selector.length !== undefined && toString.call(selector) === '[object Array]'){
      var i = 0,
          k = selector.length;

      for(; i < k; i++){
        this[this.length++] = selector[i] instanceof $ ? selector[i][0] : selector[i];
      }

      return this;
    }

    if(this.context === undefined){
      this.context = document;
    }else{
      this.context = $(this.context)[0];
    }

    return $.merge(this, $.query(this.selector, this.context));
  }
};

/**
 * Creates a dictionary of fragment containers for
 * proper DOM node creation when using $.fragment
 */
each(['tbody', 'thead', 'tfoot', 'tr', 'th', 'td'], (item) => {
   fragmentContainer[item] = (item === 'th' || item === 'td') ? 'tr' : 'table';
});

/**
 * Returns the created DOM node(s) from a passed HTML string
 * @param  {String} html The string containing arbitrary HTML
 * @return {Array}       The DOM node(s)
 */
$.fragment = (container, html) => {
  container.innerHTML = ('' + html);

  const items = [...container.childNodes];

  each(items, (element) => container.removeChild(element));

  return items;
};

/**
 * Traverses the DOM and returns matched elements
 * @param  {Mixed} selector String containing CSS selector(s), HTML tags to create, or DOM Element
 * @param  {Mixed} context  Context in which to perform the search (can be a CSS Selector or DOM Element)
 * @return {Array}          NodeList of matched selectors
 */
$.query = (selector, context) => {
  var query = [];
  const noSpace = selector.length && selector.indexOf(' ') < 0;

  if(selector[0] === '#' && context === document && noSpace){
    const element = context.getElementById(selector.slice(1));

    if(element){
      return [element];
    }
  }else{
    if(context.nodeType === 1 || context.nodeType === 9){
      if(selector[0] === '.' && noSpace){
        query = context.getElementsByClassName(selector.slice(1));
      }else if(($.regexp.tags).test(selector)){
        query = context.getElementsByTagName(selector);
      }else{
        query = context.querySelectorAll(selector);
      }
    }
  }

  return [...query];
};

/**
 * class2type cache
 * @type {Object}
 */
const class2type = {};

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

$.extend($.fn, {
  concat,
  indexOf,
  reduce,
  splice,
  each: $.each,
  extend: $.extend
});

Eleven.query = $;

export default $;
