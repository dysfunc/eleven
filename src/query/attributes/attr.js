import $ from '../core';

$.fn.extend({
  /**
   * Get the value of an attribute for the first element in the set of matched
   * elements or set one or more attributes for every matched element
   * @param  {Mixed} name  The name of the attribute to get or a hash of key/value pairs to set
   * @param  {Mixed} value The value to set for one or more elements (optional)
   * @return {Mixed}       The attribute value or the matched set
   */
  attr(name, value){
    var element = this[0];

    if(!element || element && element.nodeType !== 1){
      return undefined;
    }

    if(typeof(name) === 'string' && value === undefined && value != 'null'){
      if(typeof(name) === 'string'){
        return element.getAttribute(name);
      }
    }else{
      var i = 0,
          k = this.length,
          process = function(element, key, value){
            if(value == null){
              element.removeAttribute(key);
            }else{
              element.setAttribute(key, value);
            }
          };

      for(; i < k; i++){
        element = this[i];

        if(!element || element && element.nodeType !== 1){
          return undefined;
        }

        if(typeof(name) === 'string'){
          process(element, name, value);
        }

        if(typeof(name) === 'object'){
          for(var key in name){
            process(element, key, name[key]);
          }
        }
      }
    }

    return this;
  },
  /**
   * Removes one or more attributes from a set of matched elements in a collection
   * @param {Mixed} name The string or array of properties names to remove
   */
  removeAttr(name){
    if(this[0] === undefined){
      return;
    }

    var i = 0,
        k = this.length;

    for(; i < k; i++){
      var element = this[i];

      if(element.nodeType !== 1){
        continue;
      }

      if(typeof(name) === 'string'){
        element.removeAttribute(name);
      }
      else if(typeof(name) === 'array'){
        var  j = 0,
             l = name.length;

        for(; j < l; j++){
          var property = name[j];
          element[property] && element.removeAttribute(property);
        }
      }

      element = null;
    }

    return this;
  }
});

export default $;
