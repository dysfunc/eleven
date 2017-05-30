import $ from '../core';
import { getComputedStyle } from '../../common/helpers';

const cssNumber = { 'columns': 1, 'columnCount': 1, 'fillOpacity': 1, 'flexGrow': 1, 'flexShrink': 1, 'fontWeight': 1, 'lineHeight': 1, 'opacity': 1, 'order': 1, 'orphans': 1, 'widows': 1, 'zIndex': 1, 'zoom': 1 };
const formatValue = (prop, value) => typeof(value) === 'number' && !cssNumber[prop] && (parseFloat(value) + 'px') || value;

$.fn.extend({
  /**
   * Get the value of a style property for the first element in the set of matched
   * elements or set the style property value for one or more elements
   * @param  {Mixed} property The style property to set or get
   * @param  {Mixed} value    The value to set for the given property
   * @return {Mixed}          The style property value or this
   */
  css(property, value){
    var element = this[0],
        isString = typeof(property) === 'string',
        returnZero = { width: 1, height: 1 },
        process = function(element, prop, value, get){
          if(value == null || value !== value && get){
            return;
          }

          var camelCase = $.camelCase(prop);

          if(get){
            value = element.style[camelCase] || getComputedStyle(element, null)[camelCase];
          }

          if(parseFloat(value) < 0 && returnZero[camelCase]){
            value = 0;
          }

          if(value === ''){
            if(camelCase === 'opacity'){
              value = 1;
            }

            if(returnZero[camelCase]){
              return '0px';
            }
          }

          if(get){
            return $.regexp.cssNumbers.test(camelCase) ? parseFloat(value) : value;
          }else{
            element.style[camelCase] = formatValue(camelCase, value);
          }
        };

    if(!element || element.nodeType === 3 || element.nodeType === 8 || !element.style){
      return;
    }

    if(isString && value === undefined){
      return process(element, property, '1', true);
    }

    var i = 0,
        k = this.length;

    for(; i < k; i++){
      element = this[i];

      if(!element || element.nodeType === 3 || element.nodeType === 8 || !element.style){
        return;
      }

      if(isString){
        process(element, property, value);
      }else{
        for(var key in property){
          process(element, key, property[key]);
        }
      }
    }

    return this;
  }
});

export default $;
