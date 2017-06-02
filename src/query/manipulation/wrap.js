import $ from '../core';

/**
 * Wrap an HTML fragment around each element in the matched set
 * @param {Array} node The element(s) to wrap
 */
$.fn.wrap = function(node){
  if(this[0] === undefined){
    return;
  }

  var node = $(node),
      i = 0,
      k = this.length,
      element = null;

  for(; i < k; i++){
    element = $(this[i]);
    element.before(node) && node.append(element);
  }

  return this;
};

export default $;
