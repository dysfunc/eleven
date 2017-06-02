import $ from '../core';

$.fn.extend({
  /**
   * Creates a reference to the original matched collection for chain breaking (e.g. using .end())
   * @param  {Object} collection The collection to add the prev reference to
   * @return {Object}            The modified collection
   */
  chain(collection){
    return !!collection && (collection.prevObject = this) && $(collection) || $();
  },
  /**
   * Breaks the current chain and returns the set of matched elements defined in `prevObject` (i.e. previous state)
   * @return {Object}  The matched elements from its previous state
   */
  end(){
    return this.prevObject || $();
  }
});

export default $;
