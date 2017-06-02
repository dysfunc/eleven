import $ from '../core';

/**
 * Returns the text from the first element in the matched set, or sets the
 * text value for one or more elements
 * @param  {String} text The text content to set
 * @return {Mixed}       Gets or sets the text content of the element(s)
 */
$.fn.text = function(text){
  if(!this[0] === undefined){
    return undefined;
  }

  if(!text){
    return this[0].textContent;
  }

  var i = 0,
      k = this.length;

  for(; i < k; i++){
    var element = this[i];

    if(element.nodeType){
      $(element).empty();

      if(typeof(text) === 'function'){
        element.textContent = text.call(element, i, element.textContent);
      }else{
        element.textContent = text;
      }
    }

    element = null;
  }

  return this;
};

export default $;
