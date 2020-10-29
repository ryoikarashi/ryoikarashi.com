import {Track} from "../../Domains/Track/Track";

export interface ITrackService {
    getCurrentlyListeningTrack(): Promise<Track>;
}
