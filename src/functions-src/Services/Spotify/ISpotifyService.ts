import {Token} from "../../Domains/Token/Token";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {Track} from "../../Domains/Track/Track";

export interface ISpotifyService {
    refreshAccessToken(): Promise<AccessToken>;
    getCurrentlyListeningTrack(accessToken: AccessToken): Promise<Track>;
    getToken(): Promise<Token>;
}
