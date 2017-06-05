import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.before', () => {
  it('should insert an <h1> before the container element', () => {
    const h1 = $('<h1>before</h1>');

    $('body').append('<div id="test"><h2>World</h2></div>');

    expect($('#test').before(h1).prev().first().text()).toMatch('before');
  });
});
