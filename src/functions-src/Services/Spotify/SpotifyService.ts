import axios, {AxiosStatic} from 'axios';
import {ISpotifyService} from "./ISpotifyService";
import {ITokenRepository} from "../../Repositories/TokenRepository/ITokenRepository";
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
    private readonly tokenRepo: ITokenRepository;
    private readonly trackRepo: ITrackRepository;
    private readonly http: AxiosStatic;
    private readonly config: SpotifyConfig;

    constructor(tokenRepo: ITokenRepository, trackRepo: ITrackRepository, http: AxiosStatic, config: SpotifyConfig) {
        this.tokenRepo = tokenRepo;
        this.trackRepo = trackRepo;
        this.http = http;
        this.config = config;
    }

    // encode authorization code to Base64
    private encodeAuthorizationCode(): string {
        return Buffer
            .from(`${this.config.clientId}:${this.config.clientSecret}`, 'utf-8')
            .toString('base64');
    }

    // get an access token and refresh token with authorization code
    async getToken(): Promise<Token> {
        try {
            const currentToken = await this.tokenRepo.getFirstToken();

            if (currentToken.accessToken().isValid() && currentToken.refreshToken().isValid()) {
                return currentToken;
            }

            const tokenIssuedByAuthorizationCode =
                await this.tokenRepo.getTokenByAuthorizationCode(
                    axios,
                    this.encodeAuthorizationCode(),
                    this.config.authorizationCode
                );

            await this.tokenRepo.storeAccessTokenAndMaybeRefreshToken(tokenIssuedByAuthorizationCode);
            return Promise.resolve(tokenIssuedByAuthorizationCode);
        } catch(e) {
            const token = new Token(
                new AccessToken(null),
                new RefreshToken(null),
            );
            return Promise.resolve(token);
        }
    }

    // get a currently listening track
    async getCurrentlyListeningTrack(accessToken: AccessToken): Promise<Track | null> {
        return await this.trackRepo.getCurrentlyListeningTrack(accessToken, async () => {
            return await this.refreshAccessToken();
        });
    }

    // refresh access token with refresh token (access token expires within 1 hour)
    async refreshAccessToken(): Promise<AccessToken> {
        const token = await this.tokenRepo.getFirstToken();
        const refreshedToken = await this.tokenRepo.refreshAccessToken(axios, token, this.encodeAuthorizationCode());
        await this.tokenRepo.storeAccessTokenAndMaybeRefreshToken(refreshedToken);
        return refreshedToken.accessToken();
    }
}
