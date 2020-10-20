import {ISpotifyCurrentlyListeningTrackData} from "../../Services/Spotify/ISpotifyCurrentlyListeningTrackData";
import {Track} from "../../Domains/Track/Track";
import {AccessToken} from "../../Domains/Token/AccessToken";

export interface ITrackRepository {
    // queries
    getLastPlayedTrack(): Promise<Track>;
    getCurrentlyListeningTrack(accessToken: AccessToken, callback: () => Promise<AccessToken>): Promise<Track>;
    //commands
    storeLastPlayedTrack(data: ISpotifyCurrentlyListeningTrackData): Promise<void>;
}
