import { Giphy, type GiphyPlainObj } from './Giphy';
import { Src } from './ValueObjects';

describe('Test Giphy Entity', () => {
  const gif = new Giphy(Src.of('https://example.com/a-path-to-photo'));

  const expectedPlainObj: GiphyPlainObj = {
    src: 'https://example.com/a-path-to-photo',
  };

  it('returns a correct plainObj', () => {
    expect(gif.toPlainObj()).toStrictEqual(expectedPlainObj);
  });

  it('returns a correct JSON stringified plainObj', () => {
    expect(gif.toJson()).toStrictEqual(JSON.stringify(expectedPlainObj));
  });

  it('is a valid token', () => {
    expect(gif.isValid()).toStrictEqual(true);
  });

  it('returns a corresponding value object', () => {
    expect(gif.src).toStrictEqual(
      Src.of('https://example.com/a-path-to-photo')
    );
  });

  const invalidGiphy = new Giphy(Src.of(''));

  it('is an invalid gif', () => {
    expect(invalidGiphy.isValid()).toStrictEqual(false);
  });
});
