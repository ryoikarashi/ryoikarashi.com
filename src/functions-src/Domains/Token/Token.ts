import {RefreshToken} from "./RefreshToken";
import {AccessToken} from "./AccessToken";

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
}
