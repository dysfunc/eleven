import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.data', function(){
  var element;

  beforeEach(function(){
    element = $('<div id="test"></div>').data({ hello: 'world' });
  });

  afterEach(function(){
    element = $('<div id="test"></div>').data({ hello: 'world' });
  });

  it('should set and retrieve the correct data from the element cache', function(){
    expect(element.data('hello')).toMatch('world');
  });

  it('should remove the value of "hello"', function(){
    expect(element.data('hello', null).data('hello')).toBeUndefined();
  });

  it('should remove the element data cache entirely', function(){
    element.data('destroy');
    expect(element.data()).toBeUndefined();
  });

  it('should add data to the entire collection', function(){
    element = $('<div></div><div></div><div></div><div></div><div></div><div></div><div></div>');
    expect(element.data('hello', 'world').eq(3).data('hello')).toMatch('world');
  });

  it('should remove data from the entire collection', function(){
    element = $('<div></div><div></div><div></div><div></div><div></div><div></div><div></div>');
    expect(element.data('hello', 'world').data('destroy').eq(3).data()).toBeUndefined();
  });

  it('should return undefined on null elements', function(){
    element = $([]);
    expect(element.data()).toBeUndefined();
  });
});

describe('$.data', function(){
  var element;

  beforeEach(function(){
    element = $.data($('<div id="test"></div>'), { hello: 'world' });
  });

  afterEach(function(){
    element = $.data($('<div id="test"></div>'), { hello: 'world' });
  });

  it('should set and retrieve the correct data from the element cache', function(){
    expect($.data(element, 'hello')).toMatch('world');
  });

  it('should remove the value of "hello"', function(){
    expect($.data(element, 'hello', null).data('hello')).toBeUndefined();
  });

  it('should remove the element data cache entirely', function(){
    $.data(element, 'destroy');
    expect($.data(element)).toBeUndefined();
  });
});
