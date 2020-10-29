import {Photo} from "./Photo";
import {Url} from "./Url";

describe('Test Photo Entity', () => {
    const photo = new Photo(
        Url.of('https://example.com/a-path-to-photo')
    );

    const expectedPlainObj = {
        url: 'https://example.com/a-path-to-photo',
    };

    test('should return a correct plainObj', () => {
        expect(photo.toPlainObj()).toStrictEqual(expectedPlainObj);
    });

    test('should return a correct JSON stringified plainObj', () => {
        expect(photo.toJson()).toStrictEqual(JSON.stringify(expectedPlainObj));
    });

    test('should be a valid token', () => {
        expect(photo.isValid()).toStrictEqual(true);
    });

    test('should return a corresponding value object', () => {
        expect(photo.url).toStrictEqual(Url.of('https://example.com/a-path-to-photo'));
    });

    const invalidPhoto = new Photo(
        Url.of(''),
    );

    test('should be an invalid photo', () => {
        expect(invalidPhoto.isValid()).toStrictEqual(false);
    });
});
