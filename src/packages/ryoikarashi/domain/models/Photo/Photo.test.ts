import { Photo } from './Photo';
import { Url, Width, Height } from './ValueObjects';

describe('Test Photo Entity', () => {
    const photo = new Photo(Url.of('https://example.com/a-path-to-photo'), Width.of('100'), Height.of('100'));

    const expectedPlainObj = {
        width: '100',
        height: '100',
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

    const invalidPhoto = new Photo(Url.of(''), Width.of(''), Height.of(''));

    it('is an invalid photo', () => {
        expect(invalidPhoto.isValid()).toStrictEqual(false);
    });
});
