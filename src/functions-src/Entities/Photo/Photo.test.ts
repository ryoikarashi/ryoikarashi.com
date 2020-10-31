import { Photo } from './Photo';
import { Url } from './Url';

describe('Test Photo Entity', () => {
    const photo = new Photo(Url.of('https://example.com/a-path-to-photo'));

    const expectedPlainObj = {
        url: 'https://example.com/a-path-to-photo',
    };

    it('returns a correct plainObj', () => {
        expect(photo.toPlainObj()).toStrictEqual(expectedPlainObj);
    });

    it('returns a correct JSON stringified plainObj', () => {
        expect(photo.toJson()).toStrictEqual(JSON.stringify(expectedPlainObj));
    });

    it('is a valid token', () => {
        expect(photo.isValid()).toStrictEqual(true);
    });

    it('returns a corresponding value object', () => {
        expect(photo.url).toStrictEqual(Url.of('https://example.com/a-path-to-photo'));
    });

    const invalidPhoto = new Photo(Url.of(''));

    it('is an invalid photo', () => {
        expect(invalidPhoto.isValid()).toStrictEqual(false);
    });
});
