import axios, {AxiosStatic} from 'axios';
import {ISpotifyService} from "./ISpotifyService";
import {ITokenRepository} from "../../Repositories/TokenRepository/ITokenRepository";
import {ITrackRepository} from "../../Repositories/TrackRepository/ITtrackRepository";
import {IOAuthConfig} from "../../Repositories/TokenRepository/ITokenRepository";
import {Token} from "../../Domains/Token/Token";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {RefreshToken} from "../../Domains/Token/RefreshToken";
import {Track} from "../../Domains/Track/Track";

export class SpotifyService implements ISpotifyService {
    private readonly _tokenRepo: ITokenRepository;
    private readonly _trackRepo: ITrackRepository;
    private readonly _http: AxiosStatic;
    private readonly _config: IOAuthConfig;

    constructor(tokenRepo: ITokenRepository, trackRepo: ITrackRepository, http: AxiosStatic, config: IOAuthConfig) {
        this._tokenRepo = tokenRepo;
        this._trackRepo = trackRepo;
        this._http = http;
        this._config = config;
    }

    // get an access token and refresh token with authorization code
    public async getToken(): Promise<Token> {
        try {
            const currentToken = await this._tokenRepo.getFirstToken();

            if (currentToken.accessToken.isValid() && currentToken.refreshToken.isValid()) {
                return currentToken;
            }

            const tokenIssuedByAuthorizationCode =
                await this._tokenRepo.getTokenByAuthorizationCode(axios, this._config);

            await this._tokenRepo.storeAccessTokenAndMaybeRefreshToken(tokenIssuedByAuthorizationCode);
            return Promise.resolve(tokenIssuedByAuthorizationCode);
        } catch(e) {
            return Promise.resolve(
                new Token(
                    AccessToken.of(null),
                    RefreshToken.of(null),
                )
            );
        }
    }

    // get a currently listening track
    public async getCurrentlyListeningTrack(accessToken: AccessToken): Promise<Track> {
        return await this._trackRepo.getCurrentlyListeningTrack(accessToken, async () => {
            return await this.refreshAccessToken();
        });
    }

    // refresh access token with refresh token (access token expires within 1 hour)
    public async refreshAccessToken(): Promise<AccessToken> {
        const token = await this._tokenRepo.getFirstToken();
        const refreshedToken = await this._tokenRepo.refreshToken(axios, token, this._config);
        await this._tokenRepo.storeAccessTokenAndMaybeRefreshToken(refreshedToken);
        return refreshedToken.accessToken;
    }
}
