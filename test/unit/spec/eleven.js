import Eleven from '../../../src/eleven';

describe('Eleven: init', () => {
  it('should in', () => {
    Eleven.query('<div id="eleven"></div>').appendTo(document.body);
    const e = Eleven('#eleven', {});
    expect(e.listening).toEqual(true);
  });
});
