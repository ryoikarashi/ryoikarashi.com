import { type IWordService } from './IWordService';
import { type Word } from '@/packages/ryoikarashi/domain/models/Word/Word';
import { type WordRepository } from '@/packages/ryoikarashi/infrastructure/repositories/WordRepository/WordRepository';
import { GetRandomWords } from '@/packages/ryoikarashi/infrastructure/repositories/WordRepository/ParameterObjects/GetRandomWords';

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
