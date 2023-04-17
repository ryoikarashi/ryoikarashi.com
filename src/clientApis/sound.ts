import { cache } from 'react';
import { type IClientApi } from '@/clientApis/types';
import { request } from '@/utils';
import {
  Track,
  type TrackPlainObj,
} from '@/packages/ryoikarashi/domain/models';

export const currentlyPlaying: Pick<IClientApi<TrackPlainObj>, 'get'> = {
  get: {
    request: cache(
      async () =>
        await request<TrackPlainObj>('/api/sounds/currently-playing').catch(
          () => Track.DEFAULT_PLAIN_OBJ
        )
    ),
    preload: () => {
      void currentlyPlaying.get.request();
    },
  },
};
