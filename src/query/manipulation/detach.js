import $ from '../core';
import { each } from '../../common/helpers';

/**
 * Removes one or more elements from the DOM
 * @return {Object}
 */
each(['detach', 'remove'], (method, index) => {
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

export default $;
