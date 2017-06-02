import Eleven from '../core/';
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

  const items = slice.call(container.childNodes);

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
      query = [element];
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

  return slice.call(query);
};

// extend $ with existing Eleven methods
each([
  'ajax',
  'ajaxSettings',
  'appendQuery',
  'browser',
  'camelCase',
  'dasherize',
  'debounce',
  'deparam',
  'device',
  'each',
  'extend',
  'format',
  'get',
  'getJSON',
  'inArray',
  'isArray',
  'isArrayLike',
  'isEmptyObject',
  'isFunction',
  'isNumber',
  'isNumeric',
  'isObject',
  'isPlainObject',
  'isString',
  'isWindow',
  'jsonP',
  'map',
  'merge',
  'os',
  'params',
  'proxy',
  'regexp',
  'ready',
  'serialize',
  'supports',
  'toArray',
  'unique',
  'uuid'
], (item) => {
  $[item] = Eleven[item];
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
