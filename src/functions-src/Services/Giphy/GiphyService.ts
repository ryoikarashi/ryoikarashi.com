import { Giphy } from '../../Entities/Giphy/Giphy';
import { IGiphyService } from './IGiphyService';
import { IGiphyRepository } from '../../Repositories/GiphyRepository/IGiphyRepository';

export class GiphyService implements IGiphyService {
    private readonly _giphyRepo: IGiphyRepository;

    constructor(giphyRepo: IGiphyRepository) {
        this._giphyRepo = giphyRepo;
    }

    async getRandom(): Promise<Giphy> {
        return await this._giphyRepo.getRandom();
    }
}
