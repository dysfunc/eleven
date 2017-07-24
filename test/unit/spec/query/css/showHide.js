import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('Hide/Show', () => {
  var element;

  beforeEach(() => {
    element = $('<div id="test"></div>');
  });

  describe('$.fn.show', () => {
    it('should show an element', () => {
      element.show();
      expect(element.get(0).style.display).toBe('');
    });
  });

  describe('$.fn.hide', () => {
    it('should hide an element', () => {
      element.hide();
      expect(element.get(0).style.display).toBe('none');
    });
  });
});
