import $ from '../core';
import { documentElement } from '../../common/document';
import { each } from '../../common/helpers';

/**
 * Sets or gets the scroll position for the first element - .scrollLeft() and .scrollTop()
 * @return {Mixed} The current X/Y scroll position or this
 */
each(['scrollLeft', 'scrollTop'], (method, index) => {
  var top = index === 1,
      property = top ? 'pageYOffset' : 'pageXOffset';

  $.fn[method] = function(value){

    if(this[0] === undefined){
      return undefined;
    }

    var elem = this[0],
        win = $.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;

    return value === undefined ? win ? (property in win) ? win[property] : documentElement[method] : elem[method] : win ? win.scrollTo(!top ? value : $(win).scrollLeft(), top ? value : $(win).scrollTop()) : elem[method] = value;
  }
});

export default $;
