import { type Word } from '@/packages/ryoikarashi/domain/models/Word/Word';
import { type GetRandomWords } from '@/packages/ryoikarashi/infrastructure/repositories/WordRepository/ParameterObjects/GetRandomWords';

export interface IWordService {
  getARandomWord: (getRandomWords: GetRandomWords) => Promise<Word>;
}
