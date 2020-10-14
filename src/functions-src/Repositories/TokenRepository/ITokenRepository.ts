import {Token} from "../../Domains/Token/Token";

export interface ITokenRepository {
    // queries
    getFirstToken(): Promise<Token>;
    // commands
    storeAccessTokenAndMaybeRefreshToken(token: Token): Promise<void>;
}
