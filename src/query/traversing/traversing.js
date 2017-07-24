import $ from '../core';
import { filter, slice } from '../../common/arrays';
import { each, indexOf } from '../../common/helpers';

$.extend({
  /**
   * Get the children of each element in the set of matched elements, including text and comment nodes
   * @return {DOM Element} The DOM element
   * @return {Object}      The collection of matched elements
   */
  contents(element){
    const name = (o, n) => o.nodeName && o.nodeName.toUpperCase() === n.toUpperCase();

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
      const nativeSelector = element[$.browser.nativeSelector];
      return element && nativeSelector && nativeSelector.call(element, selector);
    };

    return matches(element, selector || '*');
  }
});

$.fn.extend({
  /**
   * Add additional items to an existing Query collection
   * @param  {Mixed}  selector The Object or CSS selector
   * @param  {Mixed}  context  The context of the selector
   * @return {Object}          The modified Query Object
   */
  add(selector, context){
    return this.chain($.unique($.merge(this, $(selector, context))));
  },
  /**
   * Get the children of each element in the set of matched elements, including text and comment nodes.
   * @return {Object} The collection of matched elements
   */
  contents(){
    return this[0] !== undefined && $.contents(this[0]);
  },
  /**
   * Reduce the collection of matched elements to that of the passed selector
   * @param  {String} selector A string containing a selector to match the current set of elements against
   * @return {Object}          The matached elements object
   */
  filter(selector){
    return !selector ? this : $(filter.call(this, (element) => $.match(element, selector)));
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
      search = $($.query(selector, this[0]));
    }else{
      search = $($.map(this, (node) => $.query(selector, node)));
    }

    return this.chain(search);
  }
});

/**
 * .next() and .prev() - Get the next or previous sibling of the first matched element in a set
 * @param  {String} selector The selector to filter the elements against
 * @return {Object}          The matched element(s)
 */
$.each({ next: 'nextElementSibling', prev: 'previousElementSibling' }, (method, property) => {
  $.fn[method] = function(selector){
    if(this[0] === undefined){
      return undefined;
    }

    const collection = [];
    var i = 0, k = this.length;

    for(; i < k; i++){
      const element = this[i];

      if(element[property] && indexOf(collection, element[property]) < 0){
        collection.push(element[property]);
      }
    };

    return selector ? $(collection).filter(selector) : $(collection);
  }
});

/**
 * Get all preceding or following siblings of the first matched element in a collection
 * @param  {String} selector Filter siblings by a selector (optional)
 * @return {Array}           The collection of child elements
 */
each(['nextAll', 'prevAll'], (method) => {
  $.fn[method] = function(selector){
    const parentNode = this[0].parentNode;

    if(this[0] === undefined || !parentNode){
      return this;
    }

    const index = this.index();
    const items = $(parentNode).children(selector);
    const collection = [];

    each(items, function(item, i){
      if(method === 'nextAll' ? i > index : i < index){
        collection.push(this);
      }
    });

    return $(collection);
  }
});

export default $;
