import $ from '../core';

/**
 * Remove all child nodes from each parent element in the matched set
 * @return {Object} Query object
 */
$.fn.empty = function(){
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
};

export default $;
