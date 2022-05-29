import { Giphy } from '../../Entities/Giphy/Giphy';

export interface IGiphyService {
    getRandom(): Promise<Giphy>;
}
