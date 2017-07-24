import $ from '../core';
import { each } from '../../common/helpers';

/**
 * Get the siblings of each element in the collection
 * @param  {Object}      nodes   The collection of DOM nodes
 * @param  {DOM Element} element The sibling to exclude from the collection (optional)
 * @return {Array}       The collection of siblings
 */
$.siblings = function(nodes, element){
  const collection = [];

  if(nodes == undefined){
    return collection;
  }

  for(; nodes; nodes = nodes.nextSibling){
    if(nodes.nodeType == 1 && nodes !== element){
      collection.push(nodes);
    }
  }

  return collection;
};

$.fn.extend({
  /**
   * Return the child elements of each element in the set of matched elements
   * @param  {String} selector Filter by a selector (optional)
   * @return {Object}          The collection of child elements
   */
  children(selector){
    var collection = [];

    if(this[0] === undefined){
      return undefined;
    }

    if(this.length === 1){
      collection = $.siblings(this[0].firstChild);
    }else{
      var i = 0,
          k = this.length;

      for(; i < k; i++){
        collection = [...collection, ...$.siblings(this[i].firstChild)];
      }
    }

    return this.chain($(collection).filter(selector));
  },
  /**
   * Get the siblings of each element in the set of matched elements
   * @param  {String} selector Selector to filter by (optional)
   * @return {Object}          The siblings of the matched elements in the set
   */
  siblings(selector){
    var collection = [];

    if(!this.length){
      return undefined;
    }

    var i = 0,
        k = this.length;

    if(this.length === 1){
      if(this[0].nodeType == 1){
        this[0].parentNode && (collection = $.siblings(this[0].parentNode.firstChild, this[0]));
      }
    }else{
      for(; i < k; i++){
        if(this[i].nodeType == 1){
          this[i].parentNode && (collection = [...collection, $.siblings(this[i].parentNode.firstChild, this[i])]);
        }
      }
    }

    return this.chain($(collection).filter(selector));
  }
});

export default $;
