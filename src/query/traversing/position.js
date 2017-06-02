import $ from '../core';
import { slice } from '../../common/helpers';

$.fn.extend({
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
   * Returns the first matched element in the collection
   * @return {Object} The first matched element
   */
  first(){
    return $(this[0]);
  },
  /**
   * Retrieve the DOM element at the specified index the Query object collection
   * @param  {Integer} index A zero-based index indicating which element to retrieve
   * @return {Mixed}         A matched DOM element. If no index is specified all of the matched DOM elements are returned.
   */
  get(index){
    return index !== undefined ? (index < 0 ? this[this.length + index] : this[index]) : slice.call(this);
  },
  /**
   * Returns the last element in a matched set
   * @return {Object} The last element
   */
  last(){
    return $(this[this.length - 1]);
  }
});

export default $;
