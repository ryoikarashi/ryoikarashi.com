import axios, {AxiosStatic} from 'axios';
import {ISpotifyService} from "./ISpotifyService";
import {ITokenRepository} from "../../Repositories/TokenRepository/ITokenRepository";
import {ITrackRepository} from "../../Repositories/TrackRepository/ITtrackRepository";
import {ISpotifyCurrentlyListeningTrackData} from "./ISpotifyCurrentlyListeningTrackData";
import {Token} from "../../Domains/Token/Token";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {RefreshToken} from "../../Domains/Token/RefreshToken";

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

            const tokenIssuedWithAuthorizationCode =
                await Token.firstlyGetTokenWithAuthorizationCode(
                    axios,
                    this.encodeAuthorizationCode(),
                    this.config.authorizationCode
                );

            await this.tokenRepo.storeAccessTokenAndMaybeRefreshToken(tokenIssuedWithAuthorizationCode);
            return Promise.resolve(tokenIssuedWithAuthorizationCode);
        } catch(e) {
            const token = new Token(
                new AccessToken(null),
                new RefreshToken(null),
            );
            return Promise.resolve(token);
        }
    }

    // get a currently listening track
    async getCurrentlyListeningTrack(accessToken: AccessToken): Promise<ISpotifyCurrentlyListeningTrackData> {
        try {
            const options = {
                "headers": { "Authorization": `Bearer  ${accessToken.value()}` },
            };
            const { status, data } = await this.http.get("https://api.spotify.com/v1/me/player/currently-playing", options);

            switch (status) {
                // when listening to a track on spotify
                case 200: {
                    await this.trackRepo.storeLastPlayedTrack(data);
                    return data;
                }

                // when nothing's playing
                default: {
                    const lastPlayedTrack = await this.trackRepo.getLastPlayedTrack();
                    if (lastPlayedTrack === null) {
                        return null;
                    }
                    return Object.assign({}, lastPlayedTrack, {is_playing: false});
                }
            }
        } catch(e) {
            // when having an expired access token (unauthorized request)
            const accessToken = await this.refreshAccessToken();
            return await this.getCurrentlyListeningTrack(AccessToken.of(accessToken));
        }
    }

    // refresh access token with refresh token (access token expires within 1 hour)
    async refreshAccessToken(): Promise<string> {
        const token = await this.tokenRepo.getFirstToken();
        const refreshedToken = await token.refresh(axios, this.encodeAuthorizationCode(), token);
        await this.tokenRepo.storeAccessTokenAndMaybeRefreshToken(refreshedToken);
        return refreshedToken.accessToken().value();
    }
}
