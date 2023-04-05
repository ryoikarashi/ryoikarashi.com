import { Token } from './Token';
import { AccessToken, RefreshToken } from './ValueObjects';

describe('Test Token Entity', () => {
    const token = new Token(AccessToken.of('access_token'), RefreshToken.of('refresh_token'));

    const expectedPlainObj = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
    };

    it('returns a correct plainObj', () => {
        expect(token.toPlainObj()).toStrictEqual(expectedPlainObj);
    });

    it('returns a correct JSON stringified plainObj', () => {
        expect(token.toJson()).toStrictEqual(JSON.stringify(expectedPlainObj));
    });

    it('is a valid token', () => {
        expect(token.isValid()).toStrictEqual(true);
    });

    it('returns a corresponding value object', () => {
        expect(token.accessToken).toStrictEqual(AccessToken.of('access_token'));
        expect(token.refreshToken).toStrictEqual(RefreshToken.of('refresh_token'));
    });

    const invalidToken = new Token(AccessToken.of(''), RefreshToken.of('refresh_token'));

    it('is an invalid token', () => {
        expect(invalidToken.isValid()).toStrictEqual(false);
    });
});
