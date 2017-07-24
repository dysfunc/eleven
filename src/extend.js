import Eleven from './core';
import { each } from './common/helpers';

// expose query library utility methods to Eleven
each([
  'ajax',
  'ajaxSettings',
  'appendQuery',
  'apply',
  'browser',
  'camelCase',
  'dasherize',
  'debounce',
  'deparam',
  'device',
  'each',
  'extend',
  'format',
  'get',
  'getJSON',
  'inArray',
  'isArray',
  'isArrayLike',
  'isEmptyObject',
  'isFunction',
  'isNumber',
  'isNumeric',
  'isObject',
  'isPlainObject',
  'isString',
  'isWindow',
  'jsonP',
  'map',
  'merge',
  'os',
  'params',
  'parseJSON',
  'proxy',
  'regexp',
  'ready',
  'serialize',
  'stringify',
  'supports',
  'toArray',
  'unique',
  'uuid'
], (item) => {
  Eleven[item] = Eleven.query[item];
});

Eleven.fn.extend = Eleven.query.extend;

export default Eleven;
