import $ from '../core';
import { each } from '../../common/helpers';

$.fn.extend({
  /**
   * Determines whether an element has a specific CSS class
   * @param  {String}  name String containing the CSS class name to search
   * @return {Boolean}      True/false result
   */
  hasClass(name){
    return this[0].classList.contains(name);
  },
  /**
   * Swaps one CSS className for another
   * @param  {String} remove String containing the class name to remove
   * @param  {String} add    String containing the class name to add
   * @return {Object}        Query collection
   */
  swapClass(remove, add){
    return this.length ? this.removeClass(remove).addClass(add) : undefined;
  },
  /**
   * Toggles a specific class on one or more elements
   * @param {Mixed} cls The CSS class to toggle or the function to execute
   */
  toggleClass(cls, fn){
    return this.length ? (this[(this.hasClass(cls) ? 'removeClass' : 'addClass')](fn && fn(cls) || cls)) : undefined;
  }
});

/**
 * Add or remove one or more CSS classes from one or more elements
 * @param {Mixed} cls The CSS class to add/remove or the function to execute
 */
each(['addClass', 'removeClass'], (method, index) => {
  $.fn[method] = function(name){
    if(this[0] === undefined){
      return undefined;
    }

    var i = 0,
        k = this.length,
        type = typeof(name),
        names = type === 'string' ? name.split(' ') : [],
        remove = method === 'removeClass';

    for(; i < k; i++){
      const element = this[i];

      if(type === 'function'){
        name.call(element, element.classList, i);
      }else{
        if(remove && name === undefined){
          element.className = '';
        }else{
          if(remove){
            element.classList.remove(...names);
          }else{
            element.classList.add(...names);
          }
        }
      }
    }

    return this;
  }
});

export default $;
