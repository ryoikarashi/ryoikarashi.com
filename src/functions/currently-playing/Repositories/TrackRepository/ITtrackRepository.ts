import {ISpotifyCurrentlyListeningTrackData} from "../../Services/Spotify/ISpotifyCurrentlyListeningTrackData";
import {Track} from "../../Domains/Track/Track";

export interface ITrackRepository {
    // queries
    exists(): Promise<boolean>;
    getLastPlayedTrack(): Promise<Track>;
    //commands
    storeLastPlayedTrack(data: ISpotifyCurrentlyListeningTrackData): Promise<void>;
}
