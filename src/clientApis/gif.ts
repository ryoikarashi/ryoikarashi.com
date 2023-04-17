import { cache } from 'react';
import { type IClientApi } from '@/clientApis/types';
import { request } from '@/utils';
import {
  Giphy,
  type GiphyPlainObj,
} from '@/packages/ryoikarashi/domain/models';

export const randomGif: Pick<IClientApi<GiphyPlainObj>, 'get'> = {
  get: {
    request: cache(
      async () =>
        await request<GiphyPlainObj>('/api/gifs/random').catch(
          () => Giphy.DEFAULT_PLAIN_OBJ
        )
    ),
    preload: () => {
      void randomGif.get.request();
    },
  },
};
