import $ from '../core';

$.fn.extend({
  /**
   * Determines if a DOM element is a descendant of another DOM element
   * @param  {Mixed} selector The CSS selector or DOM element
   * @return {Boolean}        The true or false value
   */
  contains(selector){
    return $.contains(this, selector);
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
   * Slice a matched collection
   * @return {Object} The modified collection
   */
  slice(){
    return $(slice.apply(this, arguments));
  },
  /**
   * Converts anything that can be iterated over into a real JavaScript Array
   * @param  {Integer} start Zero-based index to start the array at (optional)
   * @param  {Integer} end   Zero-based index to end the array at (optional)
   * @return {Array}         The new array
   */
  toArray(start, end){
    return $.toArray(this, start, end);
  }
});

export default $;
