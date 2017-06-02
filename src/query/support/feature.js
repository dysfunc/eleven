import $ from '../core';
import window from '../../common/window';
import { navigator } from '../../common/navigator';
import { documentElement } from '../../common/document';

const supports = function(name){
  return $.camelCase($.browser.prefix.replace($.regexp.ms, 'ms-')) + name;
};

$.supports = {
  cssAnimationEvents : supports('AnimationName') in documentElement.style,
  cssTransform       : supports('Transform') in documentElement.style,
  cssTransitionEnd   : supports('TransitionEnd') in documentElement.style,
  cssTransition      : supports('Transition') in documentElement.style,
  cssTransform3d     : ('WebKitCSSMatrix' in window) && ('m11' in new WebKitCSSMatrix()),
  homescreen         : ('standalone' in navigator),
  localStorage       : typeof(window.localStorage) !== undefined,
  pushState          : ('pushState' in window.history) && ('replaceState' in window.history),
  retina             : ('devicePixelRatio' in window) && window.devicePixelRatio > 1,
  touch              : ('ontouchstart' in window)
};

export default $;
