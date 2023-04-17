import { type Track } from '@/packages/ryoikarashi/domain/models/Track/Track';
import { type ITrackService } from './ITrackService';
import { type ITrackRepository } from '@/packages/ryoikarashi/infrastructure/repositories/TrackRepository/ITtrackRepository';
import { type ITokenService } from '../Token/ITokenService';

export class SpotifyService implements ITrackService {
  private readonly _trackRepo: ITrackRepository;
  private readonly _tokenService: ITokenService;

  constructor(trackRepo: ITrackRepository, tokenService: ITokenService) {
    this._trackRepo = trackRepo;
    this._tokenService = tokenService;
  }

  public async getCurrentlyListeningTrack(): Promise<Track> {
    const token = await this._tokenService.getAccessAndRefreshToken();
    return await this._trackRepo.getCurrentlyListeningTrack(
      token.accessToken,
      async () => {
        return await this._tokenService.refreshAccessToken();
      }
    );
  }
}
