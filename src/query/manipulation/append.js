import $ from '../core';
import { document } from '../../common/document';
import { documentFragments } from '../../common/helpers';

$.fn.extend({
  /**
   * Insert content to the end of each element in the matched set
   * @param {Mixed}   element DOM element, array of elements, HTML string, or Query object
   * @param {Boolean} insert  Flag for managing the insertion point (internal)
   * @return {Object}         Query object
   */
  append(element, insert){
    if(element && element.length != undefined && !element.length){
      return this;
    }

    if(!element.constructor === Array || typeof(element) === 'object'){
      element = $(element);
    }

    var i = 0,
        k = this.length;

    for(; i < k; i++){
      if(element.length && typeof(element) === 'string'){
        var obj = ($.regexp.fragments).test(element) ? $(element) : undefined;

        if(obj == undefined || !obj.length){
          obj = document.createTextNode(element);
        }

        if(obj.constructor === $){
          var l = 0,
              j = obj.length;

          for(;l < j; l++){
            documentFragments($(obj[l]), this[i], insert);
          }
        }else{
          insert != undefined ? this[i].insertBefore(obj, this[i].firstChild) : this[i].appendChild(obj);
        }
      }else{
        documentFragments($(element), this[i], insert);
      }
    }

    return this;
  }
});

export default $;
