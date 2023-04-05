import { Word } from '../../Entities/Word/Word';
import { GetRandomWords } from './ParameterObjects/GetRandomWords';

export interface IWordRepository {
    // queries
    getRandomWords(getRandomWords: GetRandomWords): Promise<Array<Word>>;
}
