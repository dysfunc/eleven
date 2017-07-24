import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.data', () => {
  var element;

  beforeEach(() => {
    element = $('<div id="test"></div>').data({ hello: 'world' });
  });

  afterEach(() => {
    element = $('<div id="test"></div>').data({ hello: 'world' });
  });

  it('should set and retrieve the correct data from the element cache', () => {
    expect(element.data('hello')).toMatch('world');
  });

  it('should remove the value of "hello"', () => {
    expect(element.data('hello', null).data('hello')).toBeUndefined();
  });

  it('should remove the element data cache entirely', () => {
    element.data('destroy');
    expect(element.data()).toBeUndefined();
  });

  it('should add data to the entire collection', () => {
    element = $('<div></div><div></div><div></div><div></div><div></div><div></div><div></div>');
    expect(element.data('hello', 'world').eq(3).data('hello')).toMatch('world');
  });

  it('should remove data from the entire collection', () => {
    element = $('<div></div><div></div><div></div><div></div><div></div><div></div><div></div>');
    expect(element.data('hello', 'world').data('destroy').eq(3).data()).toBeUndefined();
  });

  it('should return undefined on null elements', () => {
    element = $([]);
    expect(element.data()).toBeUndefined();
  });
});

describe('$.data', () => {
  var element;

  beforeEach(() => {
    element = $.data($('<div id="test"></div>'), { hello: 'world' });
  });

  afterEach(() => {
    element = $.data($('<div id="test"></div>'), { hello: 'world' });
  });

  it('should set and retrieve the correct data from the element cache', () => {
    expect($.data(element, 'hello')).toMatch('world');
  });

  it('should remove the value of "hello"', () => {
    expect($.data(element, 'hello', null).data('hello')).toBeUndefined();
  });

  it('should remove the element data cache entirely', () => {
    $.data(element, 'destroy');
    expect($.data(element)).toBeUndefined();
  });
});
