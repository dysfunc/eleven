import $ from '../core';

$.regexp = {
  alpha         : /[A-Za-z]/,
  browser       : /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i,
  callback      : /\?(.+)=\?/,
  camel         : /-([\da-z])/gi,
  cssNumbers    : /^((margin|padding|border)(top|right|bottom|left)(width|height)?|height|width|zindex?)$/i,
  device        : /((ip)(hone|ad|od)|playbook|hp-tablet)/i,
  escape        : /('|\\)/g,
  fragments     : /^\s*<(\w+|!)[^>]*>/,
  jsonCallback  : /\?(.+)=\?/,
  jsonString    : /^(\{|\[)/i,
  manipulation  : /insert|to/i,
  mixed         : /^(?:\s*<[\w!]+>|body|head|#\w(?:[\w-]*)|\.\w(?:[\w-]*))$/,
  mobile        : /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i,
  ms            : /^-ms-/,
  nodes         : /^(?:1|3|8|9|11)$/,
  numbers       : /^(0|[1-9][0-9]*)$/i,
  os            : /(android|blackberry|bb10|macintosh|webos|windows)/i,
  protocol      : /^((http|ftp|file)(s?)\:)?/,
  queries       : /[&?]{1,2}/,
  quotes        : /^["']|["']$/g,
  ready         : /^(?:complete|loaded|interactive)$/i,
  relative      : /^([-+=])/,
  responseOK    : /^(20[0-6]|304)$/g,
  root          : /^(?:body|html)$/i,
  space         : /\s+/g,
  tags          : /^[\w-]+$/,
  templates: {
    keys        : /\{(\w+)\}/g,
    indexed     : /\{(\d+)\}/g
  },
  trim          : /^\s+|\s+$/g,
  whitespaces   : /^\s*$/g,

  // commands regexp
  escapeRegExp  : /[\-{}\[\]+?.,\\\^$|#]/g,
  optionalParam : /\s*\((.*?)\)\s*/g,
  optionalRegex : /(\(\?:[^)]+\))\?/g,
  namedParam    : /(\(\?)?:\w+/g,
  readyState    : /^(?:complete|loaded|interactive)$/i,
  splatParam    : /\*\w+/g,

  // speech splitting
  textChunks    : /.{1,140}(?:\s+|\w+)/g
};

export default $;
