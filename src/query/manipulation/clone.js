import $ from '../core';

/**
 * Create a copy, or deep copy (optional), of a node
 * @param {Boolean} deep If true, the children of the node will also be cloned
 */
$.fn.clone = function(deep){
  const collection = this.map((item) => item.cloneNode(!!deep));

  return $(collection);
};

export default $;
