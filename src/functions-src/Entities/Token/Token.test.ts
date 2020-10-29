import { Token } from './Token';
import { AccessToken } from './AccessToken';
import { RefreshToken } from './RefreshToken';

describe('Test Token Entity', () => {
    const token = new Token(AccessToken.of('access_token'), RefreshToken.of('refresh_token'));

    const expectedPlainObj = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
    };

    test('should return a correct plainObj', () => {
        expect(token.toPlainObj()).toStrictEqual(expectedPlainObj);
    });

    test('should return a correct JSON stringified plainObj', () => {
        expect(token.toJson()).toStrictEqual(JSON.stringify(expectedPlainObj));
    });

    test('should be a valid token', () => {
        expect(token.isValid()).toStrictEqual(true);
    });

    test('should return a corresponding value object', () => {
        expect(token.accessToken).toStrictEqual(AccessToken.of('access_token'));
        expect(token.refreshToken).toStrictEqual(RefreshToken.of('refresh_token'));
    });

    const invalidToken = new Token(AccessToken.of(''), RefreshToken.of('refresh_token'));

    test('should be an invalid token', () => {
        expect(invalidToken.isValid()).toStrictEqual(false);
    });
});
