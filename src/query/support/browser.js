import $ from '../core';
import window from '../../common/window';
import { language, userAgent, vendor } from '../../common/navigator';

$.browser = (() => {
  const match = userAgent.match($.regexp.browser);
  const browser = RegExp.$1.toLowerCase();
  const types = {
    'chrome' : 'webkit',
    'firefox': 'moz',
    'msie'   : 'ms',
    'opera'  : 'o',
    'safari' : 'webkit',
    'trident': 'ms'
  };
  const prefix = types[browser] || '';
  const nativeSelector = prefix + 'MatchesSelector';
  const language = language;

  return {
    chrome         : browser === 'chrome' && !('doNotTrack' in window),
    cssPrefix      : '-' + prefix + '-',
    firefox        : browser === 'firefox',
    language       : language && language.toLowerCase(),
    msie           : browser === 'msie' || browser === 'trident',
    nativeSelector : prefix.length > 0 ? nativeSelector : nativeSelector[0].toLowerCase(),
    opera          : browser === 'opera',
    prefix         : prefix,
    safari         : browser === 'safari' && ('doNotTrack' in window),
    version        : userAgent.match(/version\/([\.\d]+)/i) !== null ? RegExp.$1 : match[2],
    webkit         : prefix === 'webkit'
  }
})();

export default $;
