import 'server-only';
import { cache } from 'react';
import { request } from '@/libs/utils';
import {
  Giphy,
  type GiphyPlainObj,
} from '@/packages/ryoikarashi/domain/models';

export const getRandomGif = cache(
  async () =>
    await request<GiphyPlainObj>('/api/gifs/random').catch(
      () => Giphy.DEFAULT_PLAIN_OBJ
    )
);

export const preloadRandomGif = (): void => {
  void getRandomGif();
};
