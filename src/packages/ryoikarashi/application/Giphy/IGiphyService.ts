import { type Giphy } from '@/packages/ryoikarashi/domain/models/Giphy/Giphy';

export interface IGiphyService {
  getRandom: () => Promise<Giphy>;
}
