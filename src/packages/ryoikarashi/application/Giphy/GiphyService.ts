import { type Giphy } from '@/packages/ryoikarashi/domain/models/Giphy/Giphy';
import { type IGiphyService } from './IGiphyService';
import { type IGiphyRepository } from '@/packages/ryoikarashi/infrastructure/repositories/GiphyRepository/IGiphyRepository';

export class GiphyService implements IGiphyService {
  private readonly _giphyRepo: IGiphyRepository;

  constructor(giphyRepo: IGiphyRepository) {
    this._giphyRepo = giphyRepo;
  }

  async getRandom(): Promise<Giphy> {
    return await this._giphyRepo.getRandom();
  }
}
