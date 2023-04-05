import { IWordService } from './IWordService';
import { Word } from '../../Entities/Word/Word';
import { WordRepository } from '../../Repositories/WordRepository/WordRepository';
import { GetRandomWords } from '../../Repositories/WordRepository/ParameterObjects/GetRandomWords';

export class WordService implements IWordService {
    private readonly _wordRepository: WordRepository;

    constructor(wordRepository: WordRepository) {
        this._wordRepository = wordRepository;
    }

    public async getARandomWord(): Promise<Word> {
        const getRandomWords = new GetRandomWords(1);
        return (await this._wordRepository.getRandomWords(getRandomWords))[0];
    }
}
