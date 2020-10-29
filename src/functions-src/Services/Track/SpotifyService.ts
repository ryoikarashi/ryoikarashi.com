import {Track} from "../../Entities/Track/Track";
import {ITrackService} from "./ITrackService";
import {ITrackRepository} from "../../Repositories/TrackRepository/ITtrackRepository";
import {ITokenService} from "../Token/ITokenService";

export class SpotifyService implements ITrackService {
    private readonly _trackRepo: ITrackRepository;
    private readonly _tokenService: ITokenService;

    constructor(trackRepo: ITrackRepository, tokenService: ITokenService) {
        this._trackRepo = trackRepo;
        this._tokenService = tokenService;
    }

    // get a currently listening track
    public async getCurrentlyListeningTrack(): Promise<Track> {
        const token = await this._tokenService.getAccessAndRefreshToken();
        return await this._trackRepo.getCurrentlyListeningTrack(token.accessToken, async () => {
            return await this._tokenService.refreshAccessToken();
        });
    }
}
