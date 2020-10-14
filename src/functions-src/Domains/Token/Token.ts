import {stringify as QsStringify, stringify} from "query-string";
import {RefreshToken} from "./RefreshToken";
import {AccessToken} from "./AccessToken";
import {AxiosStatic} from "axios";

export class Token {
    private readonly _accessToken: AccessToken;
    private readonly _refreshToken: RefreshToken;

    constructor(accessToken: AccessToken, refreshToken: RefreshToken) {
        this._accessToken = accessToken;
        this._refreshToken = refreshToken;
    }

    accessToken(): AccessToken {
        return this._accessToken;
    }

    refreshToken(): RefreshToken {
        return this._refreshToken;
    }

    public static async firstlyGetTokenWithAuthorizationCode(http: AxiosStatic, encodedBasicAuthorizationCode: string, authorizationCode: string): Promise<Token> {
        const headers = {
            "Authorization": `Basic ${encodedBasicAuthorizationCode}`,
            "Content-Type": 'application/x-www-form-urlencoded',
        };
        const params = {
            "grant_type": "authorization_code",
            "code": authorizationCode,
            "redirect_uri": "https://example.com/callback"
        };

        const { data: { access_token: accessToken, refresh_token: refreshToken } } =
            await http.post("https://accounts.spotify.com/api/token", QsStringify(params), { headers });

        return new Token(
            AccessToken.of(accessToken),
            RefreshToken.of(refreshToken),
        );
    }

    async refresh(http: AxiosStatic, encodedAuthorizationCode: string, currentToken: Token): Promise<Token> {
        const headers = {
            "Authorization": `Basic ${encodedAuthorizationCode}`,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const payload = {
            "grant_type": "refresh_token",
            "refresh_token": currentToken.refreshToken().value(),
        };

        const { data: { access_token: accessToken, refresh_token: refreshToken } } =
            await http.post("https://accounts.spotify.com/api/token", stringify(payload), { headers });

        return Promise.resolve(
            new Token(
                AccessToken.of(accessToken),
                RefreshToken.of(refreshToken)
            )
        );
    }
}
