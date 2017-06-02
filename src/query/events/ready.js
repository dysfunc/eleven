import $ from '../core';
import { document } from '../../common/document';
/**
 * Executes a function when the DOM is ready
 * @param {Function} fn The function to execute
 */
$.fn.ready = function(fn){
  if(($.regexp.ready).test(document.readyState)){
    fn.call();
  }else{
    document.addEventListener('DOMContentLoaded', fn, false);
  }

  return this;
};

export default $;
