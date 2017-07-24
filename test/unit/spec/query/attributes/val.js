import Eleven from '../../../../../src/eleven';
const $ = Eleven.query;

describe('$.fn.val', () => {
  it('should set and retrieve the correct value', () => {
    const element = $('<input id="test">').val('hello');

    expect(element.val()).toMatch('hello');
  });
});
