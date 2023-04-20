import { type Word } from '@/packages/ryoikarashi/domain/models/Word/Word';
import { type GetRandomWords } from './ParameterObjects/GetRandomWords';

export interface IWordRepository {
  // queries
  getRandomWords: (getRandomWords: GetRandomWords) => Promise<Word[]>;
}
