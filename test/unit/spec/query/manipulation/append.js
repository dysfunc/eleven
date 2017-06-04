import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.append', function(){
  it('should append an <h1> to container', function(){
    var element = $('<div id="test"></div>'),
        h1 = element.append('<h1>append</h1>');

    expect(h1.text()).toMatch('append');
  });

  it('should prepend an <h1> to the container element', function(){
    var element = $('<div id="test"><h2>World</h2></div>');

    element.prepend('<h1>Hello</h1>');

    expect(element.first().text()).toMatch('Hello');
    expect(element.last().text()).toMatch('World');
  });

  it('should insert an <h1> before the container element', function(){
    var element = $('body').append('<div id="test"><h2>World</h2></div>'),
        h1 = $('<h1>before</h1>');

    expect($('#test').before(h1).prev().first().text()).toMatch('before');
  });

  it('should insert an <h1> after the container element', function(){
    var element = $('body').append('<div id="test"><h2>World</h2></div>'),
        h1 = $('<h1>after</h1>');

    expect($('#test').after(h1).next().first().text()).toMatch('after');
  });

  it('should append an <h1> as the last child in container element', function(){
    var element = $('body').append('<div id="test"><h2>World</h2></div>'),
        h1 = $('<h1>appendTo</h1>');

    expect(h1.appendTo('#test').text()).toMatch('appendTo');
  });


  it('should prepend an <h1> as the first child in the container element', function(){
    var element = $('body').append('<div id="test"><h2>World</h2></div>'),
        h1 = $('<h1>prependTo</h1>');

    expect(h1.prependTo('#test').parent().first().text()).toMatch('prependTo');
  });
});
