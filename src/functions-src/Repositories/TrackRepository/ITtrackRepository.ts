import { Track, TrackPlainObj } from '../../Entities/Track/Track';
import { AccessToken } from '../../Entities/Token/ValueObjects';

export interface HTTPTrackResponse {
    name: string;
}

export interface ITrackRepository {
    // queries
    getLastPlayedTrack(): Promise<Track>;
    getCurrentlyListeningTrack(accessToken: AccessToken, callback: () => Promise<AccessToken>): Promise<Track>;
    //commands
    storeLastPlayedTrack(data: TrackPlainObj): Promise<void>;
}
