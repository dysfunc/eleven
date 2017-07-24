import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.empty', () => {
  var element;
  
  beforeEach(() => {
    element = $('<div id="test"><h1>Hello world!<span>BOOM</span></h1</div>');
  });

  it('should remove the children of a given element', () => {
    element.empty();
    expect(element.children().length).toEqual(0);
  });
});
