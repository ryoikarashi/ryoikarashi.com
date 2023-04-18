import 'server-only';
import { cache } from 'react';
import { type IClientApi } from '@/clientApis/types';
import { request } from '@/utils';
import {
  Word,
  type WordPlainObject,
} from '@/packages/ryoikarashi/domain/models';

export const randomPaliWord: Pick<IClientApi<WordPlainObject>, 'get'> = {
  get: {
    request: cache(
      async () =>
        await request<WordPlainObject>(
          '/api/dictionaries/random-pali-word'
        ).catch(() => Word.DEFAULT_PLAIN_OBJ)
    ),
    preload: () => {
      void randomPaliWord.get.request();
    },
  },
};
