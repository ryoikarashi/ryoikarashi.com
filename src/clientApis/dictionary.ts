import 'server-only';
import { cache } from 'react';
import { request } from '@/libs/utils';
import {
  Word,
  type WordPlainObject,
} from '@/packages/ryoikarashi/domain/models';

export const getRandomPaliWord = cache(
  async () =>
    await request<WordPlainObject>('/api/dictionaries/pali/random').catch(
      () => Word.DEFAULT_PLAIN_OBJ
    )
);
export const preloadRandomPaliWord = (): void => {
  void getRandomPaliWord();
};
