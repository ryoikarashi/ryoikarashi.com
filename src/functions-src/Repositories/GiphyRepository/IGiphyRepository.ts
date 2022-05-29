import { Giphy } from '../../Entities/Giphy/Giphy';

export interface IGiphyRepository {
    // queries
    getRandom(): Promise<Giphy>;
}
