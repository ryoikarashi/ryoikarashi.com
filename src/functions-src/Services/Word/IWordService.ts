import { Word } from '../../Entities/Word/Word';
import { GetRandomWords } from '../../Repositories/WordRepository/ParamterObjects/GetRandomWords';

export interface IWordService {
    getARandomWord(getRandomWords: GetRandomWords): Promise<Word>;
}
