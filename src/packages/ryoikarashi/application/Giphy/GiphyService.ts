import { Giphy } from "@/packages/ryoikarashi/domain/models/Giphy/Giphy";
import { IGiphyService } from "./IGiphyService";
import { IGiphyRepository } from "@/packages/ryoikarashi/infrastructure/repositories/GiphyRepository/IGiphyRepository";

export class GiphyService implements IGiphyService {
  private readonly _giphyRepo: IGiphyRepository;

  constructor(giphyRepo: IGiphyRepository) {
    this._giphyRepo = giphyRepo;
  }

  async getRandom(): Promise<Giphy> {
    return await this._giphyRepo.getRandom();
  }
}
