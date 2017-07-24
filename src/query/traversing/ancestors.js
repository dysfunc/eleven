import $ from '../core';
import { each, indexOf } from '../../common/helpers';

$.fn.extend({
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

    while(element && indexOf(query, element) < 0){
      element = element !== context && element !== document && element.parentNode;
    }

    return this.chain($(element || []));
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
   * Get the ancestors of each element in a set, optionally filtered by a CSS selector
   * @param  {String} selector A string containing the CSS selector to filter elements by
   * @return {Object}          Query object containing DOM elements of  elements of the selected element,
   */
  parents(selector){
    if(!this.length){
      return this;
    }

    var collection = [],
        i = 0,
        k = this.length;

    for(; i < k; i++){
      const element = this[i];
      var parentNode = element.parentNode;

      while(parentNode){
        if(parentNode !== document && indexOf(collection, parentNode) < 0){
          collection.push(parentNode);
        }

        parentNode = parentNode.parentNode;
      }
    }

    collection = selector ? $(collection).filter(selector) : $(collection);

    return collection;
  }
});

export default $;
