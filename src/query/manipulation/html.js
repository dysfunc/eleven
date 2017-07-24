import $ from '../core';
import { each } from '../../common/helpers';

$.fn.extend({
  /**
   * Returns the HTML contents of the first element in a matched set or updates the contents of one or more elements
   * @param  {String} html The HTML string to replace the contents with
   * @return {Mixed}       The contents of an individual element, or sets the contents for each element in the matched set
   */
  html(html){
    if(!this.length || this[0] === undefined){
      return undefined;
    }

    if(!html){
      return this[0].innerHTML;
    }

    return this.empty().each(() => $(this).append(html));
  },
  /**
   * Returns an HTML string of the element and its descendants
   * @return {HTML String} The container element and its children
   */
  outerHTML(){
    return this[0] !== undefined && this[0].outerHTML || undefined;
  }
});

export default $;
