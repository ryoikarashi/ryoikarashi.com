import {Track} from "../../Domains/Track/Track";

export interface ISpotifyService {
    getCurrentlyListeningTrack(): Promise<Track>;
}
