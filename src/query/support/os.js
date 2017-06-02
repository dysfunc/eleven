import $ from '../core';
import { userAgent } from '../../common/navigator';

$.os = (() => {
  const match = userAgent.match($.regexp.os);
  const mobile = (/mobile/i).test(userAgent);
  const os = RegExp.$1.toLowerCase();

  if($.device.idevice){
    return 'ios';
  }

  if(os === 'blackberry' && mobile){
    return 'bbmobile';
  }

  if(os === 'macintosh'){
    return 'osx';
  }

  return os;
})();

export default $;
