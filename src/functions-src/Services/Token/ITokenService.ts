import {Token} from "../../Domains/Token/Token";
import {AccessToken} from "../../Domains/Token/AccessToken";

export interface ITokenService {
    getAccessAndRefreshToken(): Promise<Token>;
    refreshAccessToken(): Promise<AccessToken>;
}
