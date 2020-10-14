import {ISpotifyCurrentlyListeningTrackData} from "./ISpotifyCurrentlyListeningTrackData";
import {Token} from "../../Domains/Token/Token";
import {AccessToken} from "../../Domains/Token/AccessToken";

export interface ISpotifyService {
    refreshAccessToken(): Promise<string>;
    getCurrentlyListeningTrack(accessToken: AccessToken): Promise<ISpotifyCurrentlyListeningTrackData>;
    getToken(): Promise<Token>;
}
