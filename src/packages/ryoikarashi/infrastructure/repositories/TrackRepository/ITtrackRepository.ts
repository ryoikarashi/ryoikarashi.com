import {
  type Track,
  type TrackPlainObj,
} from '@/packages/ryoikarashi/domain/models/Track/Track';
import { type AccessToken } from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';

export interface ITrackRepository {
  // queries
  getLastPlayedTrack: () => Promise<Track>;
  getCurrentlyListeningTrack: (
    accessToken: AccessToken,
    callback: () => Promise<AccessToken>
  ) => Promise<Track>;
  // commands
  storeLastPlayedTrack: (data: TrackPlainObj) => Promise<void>;
}
