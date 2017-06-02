import $ from '../core';
import { getComputedStyle } from '../../common/helpers';

$.fn.extend({
  /**
   * Hides each element in the matched set of elements
   * @return {Object} Query object
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
   * Shows each element in the matched set of elements
   * @return {Object} Query object
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
  }
});

export default $;
