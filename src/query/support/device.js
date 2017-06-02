import $ from '../core';
import window from '../../common/window';
import { userAgent, vendor } from '../../common/navigator';

$.device = (() => {
  const match = userAgent.match($.regexp.device);
  const device = RegExp.$1.toLowerCase();
  const detectMobile = (() => $.regexp.mobile.test(userAgent || vendor || window.opera))();

  return {
    idevice     : (/((ip)(hone|ad|od))/i).test(device),
    ipad        : device === 'ipad',
    iphone      : device === 'iphone',
    ipod        : device === 'ipod',
    isDesktop   : !detectMobile,
    isMobile    : detectMobile,
    orientation : () => window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
    playbook    : device === 'playbook',
    touchpad    : device === 'hp-tablet'
  }
})();

export default $;
