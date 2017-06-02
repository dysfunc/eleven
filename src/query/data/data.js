import $ from '../core';

/**
 * Data cache
 * @type {Object}
 */
const cache = {};

/**
 * Removes the cache of a given element
 * @param  {DOM Element} element The element we want to remove the data cache from
 * @return {Object}              Always returns true
 */
const removeDataCache = (element) => {
  const id = element.uid;

  if(cache[id]){
    delete cache[id];
  }

  return true;
};

$.extend({
  /**
   * Sets or gets arbitrary data of one or more elements
   * @param  {Array} collection The matched set or a single DOM element
   * @param  {Mixed} key        String containing the key to retrieve or modify, or an Object of key/value pairs to set
   * @param  {Mixed} value      The value to assign to the key. If key is an Object, value should be undefined
   * @return {Mixed}            The key value, the current data object (no key/value defined), or the set of match elements (setting values across multiple elements)
   */
  data(collection, key, value){
    const elevObject = (collection instanceof $);
    const elements = elevObject ? collection : [collection];

    if(elements[0] === undefined || elements[0] && elements[0].nodeType !== 1){
      return undefined;
    }

    var id = elements[0].uid,
        k = elements.length,
        i = 0;

    if(key === undefined && value === undefined){
      return cache[id] || undefined;
    }

    if(typeof(key) === 'string' && key !== 'destroy' && value === undefined){
      return cache[id] && cache[id][key] || undefined;
    }

    for(; i < k; i++){
      if(elements[i].nodeType === 1){
        if(key === 'destroy' && 'uid' in elements[i]){
          removeDataCache(elements[i]);
        }else{
          id = (elements[i].uid || (elements[i].uid = $.uuid()));

          if(!cache[id]){
            cache[id] = {};
          }

          if(typeof(key) === 'object'){
            for(const i in key){
              cache[id][i] = key[i];
            }
          }else{
            cache[id][key] = value;
          }
        }
      }
    }

    return collection;
  }
});

$.fn.extend({
  /**
   * Store arbitrary data associated with an element - Shortcut for $.data
   * @param  {String} key   The key in the dataset
   * @param  {Mixed}  value The value to assign to the property
   * @return {Mixed}        The key value or the set of match elements
   */
  data(key, value){
    return $.data(this, key, value);
  }
});

export default $;
