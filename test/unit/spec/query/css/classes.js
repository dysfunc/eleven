import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('CSS className helpers: .hasClass, .swapClass, .toggleClass, .removeClass, .addClass', () => {
  var element;

  beforeEach(() => {
    element = $('<div id="test"></div>');
  });

  afterEach(() => {
    $('#test').removeClass();
  });

  describe('$.fn.hasClass', () => {
    it('should detect the defined className', () => {
      element.addClass('test')

      expect(element.hasClass('test')).toBe(true);
    });

    it('should NOT detect the defined className', () => {
      expect(element.hasClass('test')).toBe(false);
    });
  });

  describe('$.fn.swapClass', () => {
    it('should swap one className for another', () => {
      element.addClass('hello')
      element.swapClass('hello', 'world');

      expect(element.hasClass('hello')).toBe(false);
      expect(element.hasClass('world')).toBe(true);
    });
  });

  describe('$.fn.toggleClass', () => {
    it('should add/remove a defined className', () => {
      expect(element.hasClass('hello')).toBe(false);

      element.toggleClass('hello');

      expect(element.hasClass('hello')).toBe(true);
    });
  });

  describe('$.fn.addClass', () => {
    it('should add a single className to an element', () => {
      element.addClass('hello')

      expect(element.get(0).className).toEqual('hello');
    });

    it('should add multiple classNames to an element', () => {
      element.addClass('hello world')

      expect(element.get(0).className).toEqual('hello world');
    });

    it('should not add duplicate classNames that already exist', () => {
      element.addClass('hello');
      element.addClass('hello');

      expect(element.get(0).className).toEqual('hello');
    });
  });

  describe('$.fn.removeClass', () => {
    it('should remove a single className from an element', () => {
      element.addClass('hello world')

      element.removeClass('hello')

      expect(element.get(0).className).toEqual('world');
    });

    it('should remove multiple classNames from an element', () => {
      element.removeClass('hello world')

      expect(element.get(0).className).toEqual('');
    });

    it('should remove all classNames from an element', () => {
      element.removeClass();

      expect(element.get(0).className).toEqual('');
    });
  });
});
