import $ from '../core';

/**
 * Returns the value for the first element in a matched
 * set or sets the value for one or more elements
 * @param  {Mixed} value The value to set
 * @return {Mixed}       The property value
 */
$.fn.val = function(value){
  if(this[0] === undefined){
    return;
  }

  if(value === undefined){
    return this[0].value;
  }

  for(var i = 0, k = this.length; i < k; i++){
    this[i].value = value;
  }

  return this;
};

export default $;
