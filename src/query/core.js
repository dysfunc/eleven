import Eleven from '../core/';
import window from '../common/window';
import { document, documentElement } from '../common/document';
import { toString } from '../common/objects';
import { trim } from '../common/strings';
import { concat, filter, forEach, pop, push, reduce, slice, splice, reverse, shift, unshift } from '../common/arrays';
import { each, getComputedStyle, indexOf } from '../common/helpers';

const classCache = {};
const channels = {};
const fragmentContainer = {};
const classRE = (name) => {
  return name in classCache ? classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
};

var _channelsUID = -1;

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

    if(!this.context && this.context !== document){
      context = this.context = document;
    }else{
      context = $(this.context)[0];
    }

    return $.merge(this, $.query(selector, context));
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

Eleven.apply($, {
  /**
   * Determines if a DOM element is a descendant of another DOM element
   * @param  {Object}  container The DOM element or Y object that may contain the child element
   * @param  {Object}  contained The DOM element or Y object that may be a descendant of the parent
   * @return {Boolean}           True if the child element is a descendant of the parent, otherwise false
   */
  contains(container, contained){
   return (!container || !contained) ? false : !!((container = $(container)[0]) && (contained = $(contained)[0]) && container.contains(contained));
  },
  /**
   * Get the children of each element in the set of matched elements, including text and comment nodes
   * @return {DOM Element} The DOM element
   * @return {Object}      The collection of matched elements
   */
  contents(element){
    var name = function(o, n){
      return o.nodeName && o.nodeName.toUpperCase() === n.toUpperCase();
    };

    return name(element, 'iframe') ? $(element.contentDocument || element.contentWindow.document) : $(slice.call(element.childNodes));
  },
  /**
   * Determine whether or not a DOM element matches a given selector
   * @param  {DOM Element} element  The DOM element to perform the test on
   * @param  {String}      selector The selector to test
   * @return {Boolean}              The value true or false
   */
  match(element, selector){

    if(!element || element.nodeType !== 1){
      return;
    }

    const matches = (element, selector) => {
      const nativeSelector = element[Eleven.browser.nativeSelector];
      return element && nativeSelector && nativeSelector.call(element, selector);
    };

    return matches(element, selector || '*');
  },
  /**
   * Get the siblings of each element in the collection
   * @param  {Object}      nodes   The collection of DOM nodes
   * @param  {DOM Element} element The sibling to exclude from the collection (optional)
   * @return {Array}       The collection of siblings
   */
  siblings(nodes, element){
    var collection = [];

    if(nodes == undefined){
      return collection;
    }

    for(; nodes; nodes = nodes.nextSibling){
      if(nodes.nodeType == 1 && nodes !== element){
        collection.push(nodes);
      }
    }

    return collection;
  }
});

/**
 * Map select methods from Eleven
 */
each([
  'ajax',
  'ajaxSettings',
  'appendQuery',
  'camelCase',
  'dasherize',
  'debounce',
  'deparam',
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

Eleven.apply($.fn, {
  concat  : concat,
  forEach : each,
  indexOf : indexOf,
  reduce  : reduce,
  splice  : splice,
  each    : $.each,
  extend  : $.extend,
  /**
   * Add additional items to an existing Y collection
   * @param  {Mixed}  selector The Object or CSS selector
   * @param  {Mixed}  context  The context of the selector
   * @return {Object}          The modified Y Object
   */
  add(selector, context){
    return this.chain($.unique($.merge(this, $(selector, context))));
  },
  /**
   * Creates a reference to the original matched collection for chain breaking (e.g. using .end())
   * @param  {Object} collection The collection to add the prev reference to
   * @return {Object}            The modified collection
   */
  chain(collection){
    return !!collection && (collection.prevObject = this) && $(collection) || $();
  },
  /**
   * Return the child elements of each element in the set of matched elements
   * @param  {String} selector Filter by a selector (optional)
   * @return {Object}          The collection of child elements
   */
  children(selector){
    var collection = [];

    if(this[0] === undefined){
      return undefined;
    }

    var i = 0,
        k = this.length;

    if(this.length === 1){
      collection = $.siblings(this[0].firstChild);
    }else{
      for(; i < k; i++){
        collection = collection.concat($.siblings(this[i].firstChild));
      }
    }

    return this.chain($(collection).filter(selector));
  },
  /**
   * Create a copy, or deep copy (optional), of a node
   * @param {Boolean} deep If true, the children of the node will also be cloned
   */
  clone(deep){
    var collection = this.map(function(){
      return this.cloneNode(!!deep);
    });

    return $(collection);
  },
  /**
   * Find the closest ancestor of the element that matches a given selector
   * @param  {Mixed}  selector The selector we are looking for
   * @param  {Mixed}  context  The context in which to perform the search
   * @return {Object}          The matched element
   */
  closest(selector, context){
    if(!this.length){
      return undefined;
    }

    var element = this[0],
        query = $(selector, context);

    if(!query.length){
      return $();
    }

    while(element && query.indexOf(element) < 0){
      element = element !== context && element !== document && element.parentNode;
    }

    return this.chain($(element || []));
  },
  /**
   * Determines if a DOM element is a descendant of another DOM element
   * @param  {Mixed} selector The CSS selector or DOM element
   * @return {Boolean}        The true or false value
   */
  contains(selector){
    return $.contains(this, selector);
  },
  /**
   * Get the children of each element in the set of matched elements, including text and comment nodes.
   * @return {Object} The collection of matched elements
   */
  contents(){
    return this[0] !== undefined && $.contents(this[0]);
  },
  /**
   * Remove all child nodes from each parent element in the matched set
   * @return {Object} The Y object
   */
  empty(){

    if(this[0] === undefined){
      return;
    }

    var i = 0,
        k = this.length;

    for(; i < k; i++){
      var element = this[i];

      while(element.firstChild){
        if('uid' in element.firstChild){
          $.data(element.firstChild, 'destroy');
        }

        element.removeChild(element.firstChild);
      }

      element = null;
    }

    return this;
  },
  /**
   * Breaks the current chain and returns the set of matched elements defined in `prevObject` (i.e. previous state)
   * @return {Object}  The matched elements from its previous state
   */
  end(){
    return this.prevObject || $();
  },
  /**
   * Reduce the set of matched elements to the one at a specified index. If a negative integer is used
   * it will do a reverse search of the set - eq(-1) will return the last item in the array.
   * @param  {Integer} index Zero-based index of the element to match
   * @return {Object}        The matched element in specified index of the collection
   */
  eq(index){
    return $(index < 0 ? this[index += (this.length - 1)] : this[index]);
  },
  /**
   * Search descendants of an element and returns matches
   * @param  {String} selector The element(s) to search for
   * @return {Object}          The matched set of elements
   */
  find(selector){
    var search;

    if(!selector || typeof(selector) !== 'string'){
      return [];
    }

    if(this.length === 1){
      search = $(
        $.query(selector, this[0])
      );
    }else{
      search = $(
        $.map(this, function(node){
          return $.query(selector, node);
        })
      );
    }

    return this.chain(search);
  },
  /**
   * Returns the first matched element in the collection
   * @return {Object} The first matched element
   */
  first(){
    return $(this[0]);
  },
  /**
   * Reduce the collection of matched elements to that of the passed selector
   * @param  {String} selector A string containing a selector to match the current set of elements against
   * @return {Object}          The matached elements object
   */
  filter(selector){
    if(!selector){
      return this;
    }

    return $(filter.call(this, (element) => $.match(element, selector)));
  },
  /**
   * Retrieve the DOM element at the specified index the Y object collection
   * @param  {Integer} index A zero-based index indicating which element to retrieve
   * @return {Mixed}         A matched DOM element. If no index is specified all of the matched DOM elements are returned.
   */
  get(index){
    return index !== undefined ? (index < 0 ? this[this.length + index] : this[index]) : slice.call(this);
  },
  /**
   * Determines whether an element has a specific CSS class
   * @param  {String}  name String containing the CSS class name to search
   * @return {Boolean}      True/false result
   */
  hasClass(name){
    return classRE(name).test(this[0].className);
  },
  /**
   * Hides each element in the matched set of elements
   * @return {Object} The Y object
   */
  hide(){
    if(this[0] === undefined){
      return this;
    }

    var i = 0,
        k = this.length;

    for(; i < k; i++){
      var element = this[i],
          display = getComputedStyle(element, null)['display'];

      if(element.nodeType === 1 && display !== 'none'){
        element.displayRef = display;
        element.style.display = 'none';
      }

      element = display = null;
    }

    return this;
  },
  /**
   * Returns the HTML contents of the first element in a matched set or updates the contents of one or more elements
   * @param  {String} html The HTML string to replace the contents with
   * @return {Mixed}       The contents of an individual element, or sets the contents for each element in the matched set
   */
  html(html){
    if(!this.length || this[0] === undefined){
      return undefined;
    }

    if(!html){
      return this[0].innerHTML;
    }

    return this.empty().each(function(){
      $(this).append(html);
    })
  },
  /**
   * Returns the position of an element. If no element is provided, returns position of the current element among its siblings else -1 if not found.
   * @param  {Mixed}  element The DOM element or CSS selector
   * @return {Integer}        The index of the element
   */
  index(selector){
    return this.length ? (selector ? indexOf(this, $(selector)[0]) : indexOf(this[0].parentNode.children, this[0])) : undefined;
  },
  /**
   * Returns the last element in a matched set
   * @return {Object} The last element
   */
  last(){
    return $(this[this.length - 1]);
  },
  /**
   * Returns a new $ collection of values by mapping each element
   * in a collection through the iterative function
   * @param {Function} fn The function to process each item against in the collection
   */
  map(fn){
    return $($.map(this, (element, index) => fn.call(element, index, element)));
  },
  /**
   * Returns the offset object for the first matched element in a collection
   * @return {Object} The offset object: height, left, top, width
   */
  offset(properties){

    if(!this.length || this[0] === undefined){
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
   * Get the closest positioned parent element
   * @return {Object} The parent DOM Element
   */
  offsetParent(){
    return this.map(function(){
      var offsetParent = this.offsetParent || document.body;

      while(offsetParent && (!($.regexp.root).test(offsetParent.nodeName) && $(offsetParent).css('position') === 'static')){
        offsetParent = offsetParent.offsetParent;
      }

      return offsetParent;
    });
  },
  /**
   * Returns an HTML string of the element and its descendants
   * @return {HTML String} The container element and its children
   */
  outerHTML(){
    return this[0] !== undefined && this[0].outerHTML || undefined;
  },
  /**
   * Return the parent element of the first matched element
   * @param  {String} selector The selector to filter by (optional)
   * @return {Object}          The parent element object
   */
  parent(selector){
    var result;

    if(!this[0].parentNode){
      return this;
    }

    if(selector){
      result = $(this[0].parentNode).filter(selector)
    }else{
      result = $(this[0].parentNode || []);
    }

    return this.chain(result);
  },
  /**
   * Returns the current position of an element relative to its offset parent
   * @return {Object} The position object containing the top and left coordinates
   */
  position(){

    if(!this.length){
      return undefined;
    }

    var element = $(this[0]),
        offsetParent = $(this.offsetParent()),
        offset = this.offset(),
        first = offsetParent.eq(0),
        parentOffset = ($.regexp.root).test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

    offset.top  -= parseFloat(element.css('marginTop')) || 0,
    offset.left -= parseFloat(element.css('marginLeft')) || 0,

    parentOffset.top  += parseFloat(first.css('borderTopWidth')) || 0;
    parentOffset.left += parseFloat(first.css('borderLeftWidth')) || 0;

    return {
      top:  offset.top  - parentOffset.top,
      left: offset.left - parentOffset.left
    };
  },
  /**
   * Executes a function when the DOM is ready
   * @param {Function} fn The function to execute
   */
  ready(fn){
    if(($.regexp.ready).test(document.readyState)){
      fn.call();
    }else{
      document.addEventListener('DOMContentLoaded', fn, false);
    }

    return this;
  },
  /**
   * Shows each element in the matched set of elements
   * @return {Object} The Y object
   */
  show(){
    if(!this.length || this[0] === undefined){
      return this;
    }

    var i = 0,
        k = this.length;

    for(; i < k; i++){
      var element = this[i];

      if(element.nodeType === 1 && getComputedStyle(element, null)['display'] === 'none'){
        element.style.display = element.displayRef || 'block';
        try {
          delete element.displayRef;
        }catch(e){
          element.displayRef = null;
        }
      }

      element = null;
    }

    return this;
  },
  /**
   * Get the siblings of each element in the set of matched elements
   * @param  {String} selector Selector to filter by (optional)
   * @return {Object}          The siblings of the matched elements in the set
   */
  siblings(selector){
    var collection = [];

    if(!this.length){
      return undefined;
    }

    var i = 0,
        k = this.length;

    if(this.length === 1){
      if(this[0].nodeType == 1){
        this[0].parentNode && (collection = $.siblings(this[0].parentNode.firstChild, this[0]));
      }
    }else{
      for(; i < k; i++){
        if(this[i].nodeType == 1){
          this[i].parentNode && (collection = collection.concat($.siblings(this[i].parentNode.firstChild, this[i])));
        }
      }
    }

    return this.chain($(collection).filter(selector));
  },
  /**
   * Slice a matched collection
   * @return {Object} The modified collection
   */
  slice(){
    return $(slice.apply(this, arguments));
  },
  /**
   * Swaps one CSS class name for another
   * @param  {String} remove String containing the class name to remove
   * @param  {String} add    String containing the class name to add
   * @return {Object}        The Y collection
   */
  swapClass(remove, add){
    if(!this.length){
      return undefined;
    }

    return this.removeClass(remove).addClass(add);
  },
  /**
   * Returns the text from the first element in the matched set, or sets the
   * text value for one or more elements
   * @param  {String} text The text content to set
   * @return {Mixed}       Gets or sets the text content of the element(s)
   */
  text(text){
    if(!this[0] === undefined){
      return undefined;
    }

    if(!text){
      return this[0].textContent;
    }

    var i = 0,
        k = this.length;

    for(; i < k; i++){
      var element = this[i];

      if(element.nodeType){
        $(element).empty();

        if(typeof(text) === 'function'){
          element.textContent = text.call(element, i, element.textContent);
        }else{
          element.textContent = text;
        }
      }

      element = null;
    }

    return this;
  },
  /**
   * Converts anything that can be iterated over into a real JavaScript Array
   * @param  {Integer} start Zero-based index to start the array at (optional)
   * @param  {Integer} end   Zero-based index to end the array at (optional)
   * @return {Array}         The new array
   */
  toArray(start, end){
    return $.toArray(this, start, end);
  },
  /**
   * Toggles a specific class on one or more elements
   * @param {Mixed} cls The CSS class to toggle or the function to execute
   */
  toggleClass(cls, fn){
    if(!this.length){
      return undefined;
    }

    return this[(this.hasClass(cls) ? 'removeClass' : 'addClass')](fn && fn(cls) || cls);
  },
  /**
   * Gets the value for the first element in the matched set or sets the value for one or more elements
   * @param  {Mixed} value The value to set
   * @return {Mixed}       The property value
   */
  val(value){

    if(this[0] === undefined){
      return;
    }

    if(value === undefined){
      return this[0].value;
    }

    var i = 0,
        k = this.length;

    for(; i < k; i++){
      this[i].value = value;
    }

    return this;
  },
  /**
   * Wrap an HTML fragment around each element in the matched set
   * @param {Array} node The element(s) to wrap
   */
  wrap(node){

    if(this[0] === undefined){
      return;
    }

    var node = $(node),
        i = 0,
        k = this.length,
        element = null;

    for(; i < k; i++){
      element = $(this[i]);
      element.before(node) && node.append(element);
    }

    return this;
  }
});

/**
 * Add or remove one or more CSS classes from one or more elements
 * @param {Mixed} cls The CSS class to add/remove or the function to execute
 */
each(['addClass', 'removeClass'], function(method, index){
  $.fn[method] = function(name){
    if(this[0] === undefined){
      return undefined;
    }

    var i = 0,
        k = this.length,
        self = this,
        type = typeof(name),
        names = type === 'string' ? name.split(' ') : [],
        l = names.length,
        remove = method === 'removeClass';

    for(; i < k; i++){
      if(remove && (name === undefined || name.length === 0)){
        this[i].className = '';
      }else{
        var element = this[i],
            classnames = element.className,
            classes = ('' + classnames).split(' '),
            j = 0;

        if(type === 'function'){
          name.call(element, classnames, i);
        }else{
          for(; j < l; j++){
            var index = indexOf(classes, names[j]);

            if(remove && index !== -1){
              element.className = element.className.replace(classRE(names[j]), '');
            }else{
              if(index < 0){
                element.className = (element.className + ' ' + names[j]);
              }
            }
          }

          element.className = element.className.trim();
        }
      }
    }

    return this;
  }
});

/**
 * Removes an element from the DOM
 * @return {Object}
 */
each(['detach', 'remove'], function(method, index){
  $.fn[method] = function(selector){

    if(!this.length || this[0] === undefined){
      return;
    }

    var i = 0,
        k = this.length;

    for(; i < k; i++){
      var element = this[i];

      if(element.nodeType === 1){
        if(index === 1 && 'uid' in element){
          $.data(element, 'destroy');
        }

        element.parentNode && element.parentNode.removeChild(element);
      }

      element = null;
    }

    return this;
  }
});

/**
 * .parents(), .next() and .prev() - get the next or previous sibling of
 * the first matched in a collection or get the ancestors of each element in
 * the set of matched elements
 * @param  {String} selector The selector to filter the elements against
 * @return {Object}          The matched element(s)
 */
$.each({ parents: 'parentNode', next: 'nextElementSibling', prev: 'previousElementSibling' }, function(method, property){
  $.fn[method] = function(selector){
    if(!this.length){
      return undefined;
    }

    var collection = [],
        elements = this;

    while(elements.length > 0){
      elements = $.map(elements, function(element){
        element = element[property];

        if(element && element.nodeType === 1 && indexOf(collection, element) < 0){
          return collection.push(element) && element;
        }
      });
    }

    collection = selector ? $(collection).filter(selector) : $(collection);

    return method !== 'parents' ? collection.first() : collection;
  }
});

/**
 * Get all preceding or following siblings of the first matched element in a collection
 * @param  {String} selector Filter siblings by a selector (optional)
 * @return {Array}           The collection of child elements
 */
each(['nextAll', 'prevAll'], function(method){
  $.fn[method] = function(selector){

    if(!this.length || this[0] === undefined || !this[0].parentNode){
      return this;
    }

    var index = this.index(),
        items = $(this[0].parentNode).children(selector),
        collection = [];

    each(items, function(item, i){
      if(method === 'nextAll' ? i > index : i < index){
        collection.push(this);
      }
    });

    return $(collection);
  }
});

/**
 * .width() and .height() methods; Returns width or height of the
 * matched element or set the height and width of one or more elements
 *
 * .outerWidth and .outerHeight will return the elements
 *  width + padding + borders + margins (optional, pass true as param)
 * @param  {Mixed} value  If passed true, it will return the width/height including margins, otherwise, sets the value
 * @return {Mixed}        The property value, or the matched set
 */
each(['width', 'height', 'outerWidth', 'outerHeight'], function(method){
  $.fn[method] = function(value){
    var element = this[0],
        dimension = method.replace('outer', '').toLowerCase(),
        property = dimension.charAt(0).toUpperCase() + dimension.slice(1),
        scrollOffset = 'scroll' + property,
        clientOffset = 'client' + property,
        offsetProperty = 'offset' + property,
        padding = 0, margin = 0, extra = 0;

    if(!element){
      return undefined;
    }

    if($.isWindow(element)){
      return element['inner' + property];
    }

    if(element.nodeType === 9){
      var doc = documentElement;

      return Math.max(
        element.body[scrollOffset],
        element.body[offsetProperty],
        doc[scrollOffset],
        doc[offsetProperty],
        doc[clientOffset]
      );
    }

    if(value === undefined && method.indexOf('outer') < 0){
      return this.css(method);
    }else if(method.indexOf('outer') !== -1){
      padding = dimension === 'width' ? (this.css('paddingLeft') + this.css('paddingRight')) : (this.css('paddingTop') + this.css('paddingBottom'));
      margin = value === true ? (dimension === 'width' ? (this.css('marginLeft') + this.css('marginRight')) : (this.css('marginTop') + this.css('marginBottom'))) : (dimension === 'width' ? (this.css('borderLeftWidth') + this.css('borderRightWidth')) : (this.css('borderTopWidth') + this.css('borderBottomWidth')));

      return this.css(dimension) + padding + margin + extra;
    }else{
      return this.css(method, value);
    }
  };
});

/**
 * Sets or gets the scroll position for the first element - .scrollLeft() and .scrollTop()
 * @return {Mixed} The current X/Y scroll position or this
 */
each(['scrollLeft', 'scrollTop'], function(method, index){
  var top = index === 1,
      property = top ? 'pageYOffset' : 'pageXOffset';

  $.fn[method] = function(value){

    if(this[0] === undefined){
      return undefined;
    }

    var elem = this[0],
        win = $.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;

    return value === undefined ? win ? (property in win) ? win[property] : documentElement[method] : elem[method] : win ? win.scrollTo(!top ? value : $(win).scrollLeft(), top ? value : $(win).scrollTop()) : elem[method] = value;
  }
});

Eleven.query = $;

export default $;
