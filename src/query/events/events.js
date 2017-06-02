import $ from '../core';
import { each } from '../../common/helpers';

const eventsCache = {};

each(['blur', 'change', 'click', 'dblclick', 'enter', 'error', 'focus', 'focusin', 'focusout', 'hashchange', 'keydown', 'keypress',
 'keyup', 'leave', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseenter', 'mouseleave', 'mouseup', 'resize',
 'scroll', 'select', 'submit', 'unload'], function(event){
  $.fn[event] = function(data, fn){

    if(typeof(data) === 'function'){
      fn = data;
      data = null;
    }

    return fn ? this.on(event, data, fn) : this.trigger(event);
  }
});

/**
 * Add or remove one or more event handlers - .on(), .bind() or .off(), .unbind() methods
 * @param  {String}   event    The string containing the event type(s)
 * @param  {String}   selector A selector string to filter the descendants of the selected elements that trigger the event (optional)
 * @param  {Anything} data     Data to be passed to the handler in event.data (optional)
 * @param  {Function} fn       The callback function
 */
each(['on', 'off', 'bind', 'unbind'], function(method, index){
  $.fn[method] = function(events, data, fn, capture){
    if(this[0] === undefined){
      return undefined;
    }

    if(fn == null){
      fn = data;
      data = null;
    }

    return this.each(function(){
      $.events[index % 2 === 0 ? 'add' : 'remove'](this, events, data, fn, capture);
    });
  }
});

$.fn.extend({
  /**
   * Binds to both the mouseenter/mouseover and mouseleave/mouseout of an element
   * @param  {Function} over The function to execute when the mouse enters the element
   * @param  {Function} out  The function to execute when the mouse leaves the element
   * @return {Object}        Y object
   */
  hover(over, out){
    return this.mouseenter(over).mouseleave(out || over);
  },
  /**
   * Bind to the defined events only once
   * @param {String}   events The event(s) to bind to
   * @param {Function} fn     The function to execute on the event
   * @param {Mixed}    data   Data passed to the event handler
   */
  one(events, fn, data){
    var self = this,
        proxy = function(e){
          if(typeof(fn) === 'function'){
            fn.call(this, e, e.data);
            self.off(events, data, proxy);
          }
        };

    return this.each(function(element, index){
      var element = $(this);

      if(typeof(events) === 'object'){
        if(typeof(fn) !== 'function'){
          data = fn;
          fn = null;
        }

        $.each(events, function(key, value){
          element.one(key, value, data);
        });
      }else{
        element.on(events, data, proxy);
      }
    });
  },
  /**
   * Triggers an event on more or more elements
   * @param {String} event The event to trigger
   * @param {Object} data  The event data
   */
  trigger(type, data){
    if(typeof(type) !== 'string'){
      return undefined;
    }

    return this.each(function(){
      var self = this;

      each($.events.find(this, type), function(handler){
        if(handler.fn && typeof(handler.fn) === 'function'){
          if(typeof(data) === 'object'){
            handler.data = data;
          }

          handler.fn({
            currentTarget: self,
            data: handler.data,
            handleObj: handler,
            namespace: handler.namespace,
            timeStamp: (new Date()).getTime(),
            type: handler.type
          }, handler.data);
        }
      });
    });
  }
});

/**
 * Event aliases dictionary
 * @param  {String} event String containing the event name
 * @return {String}       The original event name or the mapped alias
 */
var eventAlias = function(event){
  var alias = {
      blur       : $.supports.focusin ? 'focusout' : 'blur',
      focus      : $.supports.focusin ? 'focusin' : 'focus',
      mouseenter : 'mouseover',
      mouseleave : 'mouseout',
      turn       : 'orientationchange'
    };

  return alias[event] || event;
};

$.events = {
  /**
   * Returns the matching handler(s) of a specified element from the internal event cache
   * @param  {DOM Element} element The DOM element
   * @param  {Object}      event   The event object
   * @param  {Function}    fn      The passed event handler
   * @return {Object}              The matched event handler from the cache
   */
  find(element, event, fn){
    var e = $.events.namespace(event);

    return (eventsCache[element.uid] || []).filter(function(handler){
      return handler
        && (!e.type      || handler.type === e.type)
        && (!e.namespace || handler.namespace === e.namespace)
        && (!fn          || handler.fn === fn)
    });
  },
  /**
   * Helper method for binding events to elements
   * @param {DOM Element} element The DOM element(s)
   * @param {String}      events  The event to bind to
   * @param {Function}    fn      The function to execute on the event
   * @param {Anything}    data    Data passed to the event handler
   * @param {Boolean}     capture The flag to determine if we capture the event or not
   */
  add(element, events, data, fn, capture){
    const unique = element.uid || (element.uid = $.uuid());
    const handler = eventsCache[unique] || (eventsCache[unique] = []);

    each(('' + events).split($.regexp.space), function(event){
      const e = $.events.namespace(event);
      const type = eventAlias[e.type];
      const proxy = $.events.proxy(element, event, data, fn);

      capture = $.supports.focusin && (/focusin|focusout/i).test(event) || capture;

      handler.push({
        data: data,
        fn: fn,
        index: handler.length,
        namespace: e.namespace,
        proxy: proxy,
        type: e.type
      });

      if('addEventListener' in element){
        element.addEventListener(e.type, proxy, !!capture);
      }
    });
  },
  /**
   * Helper method for unbinding events to elements
   * @param {DOM Element} element The DOM element
   * @param {String}      events  The event to unbind
   * @param {Function}    fn      The function that maps to the event
   */
  remove(element, events, data, fn){
    each(('' + events).split($.regexp.space), function(event){
      each($.events.find(element, event, fn), function(handler){
        try {
          delete eventsCache[element.uid][handler.index];
        }catch(e){
          eventsCache[element.uid][handler.index] = null;
        }

        if('removeEventListener' in element){
          element.removeEventListener(handler.type, handler.proxy, false);
        }
      });
    });
  },
  /**
   * Returns an event object containing the type and any custom namespace
   * @param  {String} event String containing the event type
   * @return {Object}       The event properties object
   */
  namespace(event){
    const chunks = event.split('.');

    return {
      type: chunks[0],
      namespace: chunks.slice(1).sort().join(' ')
    }
  },
  /**
   * Helper function for event callback
   * @param  {Element}  element The DOM element
   * @param  {Object}   event   The event object
   * @param  {Function} fn      The event handler function
   * @return {Function}         The proxy function
   */
  proxy(element, event, data, fn){
    return function(event){
      var result;

      if(typeof(fn) === 'function'){
        event.data = data || {};
        result = fn.call(element, event, event.data);
      }

      if(result === false){
        event.preventDefault();
      }

      return result;
    }
  }
};

export default $;
