import { Track } from "@/packages/ryoikarashi/domain/models/Track/Track";

export interface ITrackService {
  getCurrentlyListeningTrack(): Promise<Track>;
}
