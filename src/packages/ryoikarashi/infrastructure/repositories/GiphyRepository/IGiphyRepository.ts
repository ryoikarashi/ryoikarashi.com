import { Giphy } from '@/packages/ryoikarashi/domain/models/Giphy/Giphy';

export interface IGiphyRepository {
  // queries
  getRandom(): Promise<Giphy>;
}
