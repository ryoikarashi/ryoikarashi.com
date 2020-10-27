import axios, {AxiosStatic} from 'axios';
import {ISpotifyService} from "./ISpotifyService";
import {ISpotifyTokenRepository} from "../../Repositories/TokenRepository/ISpotifyTokenRepository";
import {ITrackRepository} from "../../Repositories/TrackRepository/ITtrackRepository";
import {Token} from "../../Domains/Token/Token";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {RefreshToken} from "../../Domains/Token/RefreshToken";
import {Track} from "../../Domains/Track/Track";

export interface SpotifyConfig {
    clientId: string;
    clientSecret: string;
    authorizationCode: string;
}

export class SpotifyService implements ISpotifyService {
    private readonly _tokenRepo: ISpotifyTokenRepository;
    private readonly _trackRepo: ITrackRepository;
    private readonly _http: AxiosStatic;
    private readonly _config: SpotifyConfig;

    constructor(tokenRepo: ISpotifyTokenRepository, trackRepo: ITrackRepository, http: AxiosStatic, config: SpotifyConfig) {
        this._tokenRepo = tokenRepo;
        this._trackRepo = trackRepo;
        this._http = http;
        this._config = config;
    }

    // encode authorization code to Base64
    private encodeAuthorizationCode(): string {
        return Buffer
            .from(`${this._config.clientId}:${this._config.clientSecret}`, 'utf-8')
            .toString('base64');
    }

    // get an access token and refresh token with authorization code
    public async getToken(): Promise<Token> {
        try {
            const currentToken = await this._tokenRepo.getFirstToken();

            if (currentToken.accessToken.isValid() && currentToken.refreshToken.isValid()) {
                return currentToken;
            }

            const tokenIssuedByAuthorizationCode =
                await this._tokenRepo.getTokenByAuthorizationCode(
                    axios,
                    this.encodeAuthorizationCode(),
                    this._config.authorizationCode
                );

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
        const refreshedToken = await this._tokenRepo.refreshToken(axios, token, this.encodeAuthorizationCode());
        await this._tokenRepo.storeAccessTokenAndMaybeRefreshToken(refreshedToken);
        return refreshedToken.accessToken;
    }
}
