import {AxiosStatic} from "axios";
import {Token} from "../../Domains/Token/Token";
import {GoogleApiConfig} from "../../Services/GooglePhoto/GooglePhotoService";

export interface IGoogleTokenRepository {
    // queries
    getFirstToken(): Promise<Token>;
    getTokenByAuthorizationCode(http: AxiosStatic, config: GoogleApiConfig): Promise<Token>;
    refreshToken(http: AxiosStatic, expiredToken: Token, config: GoogleApiConfig): Promise<Token>;
    // commands
    storeAccessTokenAndMaybeRefreshToken(token: Token): Promise<void>;
}
