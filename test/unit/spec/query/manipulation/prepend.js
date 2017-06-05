import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.prepend + $.fn.prependTo', () => {
  it('should prepend an <h1> to the container element', () => {
    var element = $('<div id="test"><h2>World</h2></div>');

    element.prepend('<h1>Hello</h1>');

    expect(element.first().text()).toMatch('Hello');
    expect(element.last().text()).toMatch('World');
  });

  it('should prepend an <h1> as the first child in the container element', () => {
    const h1 = $('<h1>prependTo</h1>');
    $('body').append('<div id="test"><h2>World</h2></div>');

    expect(h1.prependTo('#test').parent().first().text()).toMatch('prependTo');
  });
});
