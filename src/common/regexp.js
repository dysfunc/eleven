import $ from '../core';

$.regexp = {
  jsonCallback  : /\?(.+)=\?/,
  escapeRegExp  : /[\-{}\[\]+?.,\\\^$|#]/g,
  optionalParam : /\s*\((.*?)\)\s*/g,
  optionalRegex : /(\(\?:[^)]+\))\?/g,
  namedParam    : /(\(\?)?:\w+/g,
  readyState    : /^(?:complete|loaded|interactive)$/i,
  splatParam    : /\*\w+/g,
  textChunks    : /.{1,140}(?:\s+|\w+)/g
};

export default $;
