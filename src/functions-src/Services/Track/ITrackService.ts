import {Track} from "../../Entities/Track/Track";

export interface ITrackService {
    getCurrentlyListeningTrack(): Promise<Track>;
}
