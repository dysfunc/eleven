import $ from '../core';
import { documentElement } from '../../common/document';
import { each } from '../../common/helpers';

/**
 * .width() and .height() methods; Returns width or height of the
 * matched element or set the height and width of one or more elements
 *
 * .outerWidth and .outerHeight will return the elements
 *  width + padding + borders + margins (optional, pass true as param)
 * @param  {Mixed} value  If passed true, it will return the width/height including margins, otherwise, sets the value
 * @return {Mixed}        The property value, or the matched set
 */
each(['width', 'height', 'outerWidth', 'outerHeight'], (method) => {
  $.fn[method] = function(value){
    var element = this[0],
        dimension = method.replace('outer', '').toLowerCase(),
        property = dimension[0].toUpperCase() + dimension.slice(1),
        scrollOffset = 'scroll' + property,
        clientOffset = 'client' + property,
        offsetProperty = 'offset' + property,
        padding = 0, margin = 0, extra = 0;

    if(!element){
      return undefined;
    }

    if($.isWindow(element)){
      return element['inner' + property];
    }

    if(element.nodeType === 9){
      var doc = documentElement;

      return Math.max(
        element.body[scrollOffset],
        element.body[offsetProperty],
        doc[scrollOffset],
        doc[offsetProperty],
        doc[clientOffset]
      );
    }

    if(value === undefined && method.indexOf('outer') < 0){
      return this.css(method);
    }

    if(method.indexOf('outer') !== -1){
      padding = dimension === 'width' ? (this.css('paddingLeft') + this.css('paddingRight')) : (this.css('paddingTop') + this.css('paddingBottom'));
      margin = value === true ? (dimension === 'width' ? (this.css('marginLeft') + this.css('marginRight')) : (this.css('marginTop') + this.css('marginBottom'))) : (dimension === 'width' ? (this.css('borderLeftWidth') + this.css('borderRightWidth')) : (this.css('borderTopWidth') + this.css('borderBottomWidth')));

      return this.css(dimension) + padding + margin + extra;
    }

    return this.css(method, value);
  };
});

export default $;
