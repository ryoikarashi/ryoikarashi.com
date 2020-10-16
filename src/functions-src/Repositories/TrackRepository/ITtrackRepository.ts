import {ISpotifyCurrentlyListeningTrackData} from "../../Services/Spotify/ISpotifyCurrentlyListeningTrackData";
import {Track} from "../../Domains/Track/Track";
import {AccessToken} from "../../Domains/Token/AccessToken";

export interface ITrackRepository {
    // queries
    exists(): Promise<boolean>;
    getLastPlayedTrack(): Promise<Track>;
    getCurrentlyListeningTrack(accessToken: AccessToken, callback: () => Promise<AccessToken>): Promise<Track | null>;
    //commands
    storeLastPlayedTrack(data: ISpotifyCurrentlyListeningTrackData): Promise<void>;
}
