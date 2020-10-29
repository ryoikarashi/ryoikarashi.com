import { AxiosStatic } from 'axios';
import { Token } from '../../Entities/Token/Token';

export interface IOAuthConfig {
    clientId: string;
    clientSecret: string;
    authorizationCode: string;
    basicAuthorizationCode?: string;
    redirectUri: string;
}

export interface ITokenRepository {
    // queries
    getFirstToken(): Promise<Token>;
    getTokenByAuthorizationCode(http: AxiosStatic, config: IOAuthConfig): Promise<Token>;
    refreshToken(http: AxiosStatic, expiredToken: Token, config: IOAuthConfig): Promise<Token>;
    // commands
    storeAccessTokenAndMaybeRefreshToken(token: Token): Promise<void>;
}
