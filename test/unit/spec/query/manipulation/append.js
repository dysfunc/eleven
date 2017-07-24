import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.append + $.fn.appendTo', () => {
  it('should append an <h1> to container', () => {
    const element = $('<div id="test"></div>');
    const h1 = element.append('<h1>append</h1>');

    expect(h1.text()).toMatch('append');
  });

  it('should append an <h1> as the last child in container element', () => {
    const h1 = $('<h1>appendTo</h1>');

    $('body').append('<div id="test"><h2>World</h2></div>');

    expect(h1.appendTo('#test').text()).toMatch('appendTo');
  });
});
