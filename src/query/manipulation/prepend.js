import $ from '../core';
import { each } from '../../common/helpers';

/**
 * DOM Maniuplation methods .appendTo() .prependTo() .prepend()
 * @param  {Mixed}  selector The CSS selector or DOM element to append/prepend
 * @return {Object}          Selector Query object
 */
each(['appendTo', 'prependTo', 'prepend'], function(method, index){
  $.fn[method] = function(selector){
    var target = this,
        selector = $(selector);

    if(index !== 2){
      target = $(selector);
      selector = this;
    }

    target.append(selector, index !== 0);

    return selector;
  }
});

export default $;
