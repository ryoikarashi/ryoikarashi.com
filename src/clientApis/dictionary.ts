import { cache } from 'react';
import { IClientApi } from '@/clientApis/types';
import { request } from '@/utils';
import { Word, WordPlainObject } from '@/packages/ryoikarashi/domain/models';

export const randomPaliWord: Pick<IClientApi<WordPlainObject>, 'get'> = {
  get: {
    request: cache(async () => {
      return request<WordPlainObject>(
        '/api/dictionaries/random-pali-word'
      ).catch(() => Word.DEFAULT_PLAIN_OBJ);
    }),
    preload: () => {
      void randomPaliWord.get.request();
    },
  },
};
