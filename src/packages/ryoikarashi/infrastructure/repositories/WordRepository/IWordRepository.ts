import { Word } from '@/packages/ryoikarashi/domain/models/Word/Word';
import { GetRandomWords } from './ParameterObjects/GetRandomWords';

export interface IWordRepository {
  // queries
  getRandomWords(getRandomWords: GetRandomWords): Promise<Array<Word>>;
}
