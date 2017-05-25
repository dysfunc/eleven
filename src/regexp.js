import $ from './core';

$.regexp = {
  callback      : /\?(.+)=\?/,
  escapeRegExp  : /[\-{}\[\]+?.,\\\^$|#]/g,
  optionalParam : /\s*\((.*?)\)\s*/g,
  optionalRegex : /(\(\?:[^)]+\))\?/g,
  namedParam    : /(\(\?)?:\w+/g,
  readyState    : /^(?:complete|loaded|interactive)$/i,
  splatParam    : /\*\w+/g,
  trim          : /^\s+|\s+$/g,
  whitespaces   : /^\s*$/g
};

export default $;
