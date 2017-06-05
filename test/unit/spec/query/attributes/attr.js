import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.attr', () => {
  it('should set and retrieve the correct attribute value', () => {
    const element = $('<div id="test"></div>').attr('hello', 'world');

    expect(element.attr('hello')).toMatch('world');
  });
});
