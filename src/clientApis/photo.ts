import { cache } from 'react';
import { type IClientApi } from '@/clientApis/types';
import { request } from '@/utils';
import {
  Photo,
  type PhotoPlainObj,
} from '@/packages/ryoikarashi/domain/models';

export const random: Pick<IClientApi<PhotoPlainObj>, 'get'> = {
  get: {
    request: cache(
      async () =>
        await request<PhotoPlainObj>('/api/photos/random').catch(
          () => Photo.DEFAULT_PLAIN_OBJ
        )
    ),
    preload: () => {
      void random.get.request();
    },
  },
};
