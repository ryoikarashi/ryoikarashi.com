import { Word } from '@/packages/ryoikarashi/domain/models/Word/Word';
import { GetRandomWords } from '@/packages/ryoikarashi/infrastructure/repositories/WordRepository/ParameterObjects/GetRandomWords';

export interface IWordService {
  getARandomWord(getRandomWords: GetRandomWords): Promise<Word>;
}
