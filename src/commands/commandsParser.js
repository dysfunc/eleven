import Eleven from '../core';

const parser = (command) => {
  command = command
  .replace(Eleven.regexp.escapeRegExp, '\\$&')
  .replace(Eleven.regexp.optionalParam, '(?:$1)?')
  .replace(Eleven.regexp.namedParam, (match, optional) => optional ? match : '([^\\s]+)')
  .replace(Eleven.regexp.splatParam, '(.*?)')
  .replace(Eleven.regexp.optionalRegex, '\\s*$1?\\s*');

  return new RegExp('^' + command + '$', 'i');
};

export default parser;
