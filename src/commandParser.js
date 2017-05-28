import $ from './core';

const parser = (command) => {
  command = command
  .replace($.regexp.escapeRegExp, '\\$&')
  .replace($.regexp.optionalParam, '(?:$1)?')
  .replace($.regexp.namedParam, (match, optional) => optional ? match : '([^\\s]+)')
  .replace($.regexp.splatParam, '(.*?)')
  .replace($.regexp.optionalRegex, '\\s*$1?\\s*');

  return new RegExp('^' + command + '$', 'i');
};

export default parser;
