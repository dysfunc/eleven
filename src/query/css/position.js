import $ from '../core';

$.fn.extend({
  /**
   * Returns the offset object for the first matched element in a collection
   * @return {Object} The offset object: height, left, top, width
   */
  offset(properties){

    if(!this.length || this[0] === undefined){
      return undefined;
    }

    var element = this[0].getBoundingClientRect();

    return {
      bottom: element.top + element.height + window.pageYOffset,
      height: element.height,
      left: element.left + window.pageXOffset,
      right: element.left + element.width + window.pageXOffset,
      top: element.top + window.pageYOffset,
      width: element.width
    };
  },
  /**
   * Returns the current position of an element relative to its offset parent
   * @return {Object} The position object containing the top and left coordinates
   */
  position(){
    if(!this.length){
      return undefined;
    }

    var element = $(this[0]),
        offsetParent = $(this.offsetParent()),
        offset = this.offset(),
        first = offsetParent.eq(0),
        parentOffset = ($.regexp.root).test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

    offset.top  -= parseFloat(element.css('marginTop')) || 0,
    offset.left -= parseFloat(element.css('marginLeft')) || 0,

    parentOffset.top  += parseFloat(first.css('borderTopWidth')) || 0;
    parentOffset.left += parseFloat(first.css('borderLeftWidth')) || 0;

    return {
      top:  offset.top  - parentOffset.top,
      left: offset.left - parentOffset.left
    };
  }
});

export default $;
