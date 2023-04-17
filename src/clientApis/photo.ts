import { cache } from 'react';
import { IClientApi } from '@/clientApis/types';
import { request } from '@/utils';
import { Photo, PhotoPlainObj } from '@/packages/ryoikarashi/domain/models';

export const random: Pick<IClientApi<PhotoPlainObj>, 'get'> = {
  get: {
    request: cache(async () => {
      return request<PhotoPlainObj>('/api/photos/random').catch(
        () => Photo.DEFAULT_PLAIN_OBJ
      );
    }),
    preload: () => {
      void random.get.request();
    },
  },
};
