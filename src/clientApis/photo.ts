import 'server-only';
import { cache } from 'react';
import { request } from '@/libs/utils';
import {
  Photo,
  type PhotoPlainObj,
} from '@/packages/ryoikarashi/domain/models';

export const getRandomPhoto = cache(
  async () =>
    await request<PhotoPlainObj>('/api/photos/random').catch(
      () => Photo.DEFAULT_PLAIN_OBJ
    )
);

export const preloadRandomPhoto = (): void => {
  void getRandomPhoto();
};
