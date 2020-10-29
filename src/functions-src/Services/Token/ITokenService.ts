import {Token} from "../../Entities/Token/Token";
import {AccessToken} from "../../Entities/Token/AccessToken";

export interface ITokenService {
    getAccessAndRefreshToken(): Promise<Token>;
    refreshAccessToken(): Promise<AccessToken>;
}
