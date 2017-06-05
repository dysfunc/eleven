import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.after', () => {
  it('should insert an <h1> after the container element', () => {
    const h1 = $('<h1>after</h1>');

    $('body').append('<div id="test"><h2>World</h2></div>');

    expect($('#test').after(h1).next().first().text()).toMatch('after');
  });
});
