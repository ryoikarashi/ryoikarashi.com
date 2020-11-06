import { Word } from '../../Entities/Word/Word';
import { GetRandomWords } from './ParamterObjects/GetRandomWords';

export interface IWordRepository {
    // queries
    getRandomWords(getRandomWords: GetRandomWords): Promise<Array<Word>>;
}
