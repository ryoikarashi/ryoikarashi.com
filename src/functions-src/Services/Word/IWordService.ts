import { Word } from '../../Entities/Word/Word';
import { GetRandomWords } from '../../Repositories/WordRepository/ParameterObjects/GetRandomWords';

export interface IWordService {
    getARandomWord(getRandomWords: GetRandomWords): Promise<Word>;
}
