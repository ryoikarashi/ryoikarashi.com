import { cache } from 'react';
import { request } from '@/libs/utils';
import {
  Track,
  type TrackPlainObj,
} from '@/packages/ryoikarashi/domain/models';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export const getCurrentlyPlaying = cache(
  async () =>
    await request<TrackPlainObj>('/api/sounds/currently-playing').catch(
      () => Track.DEFAULT_PLAIN_OBJ
    )
);

export const preloadCurrentlyPlaying = (): void => {
  void getCurrentlyPlaying();
};

export function useGetCurrentlyPlaying(): UseQueryResult<TrackPlainObj> {
  return useQuery<TrackPlainObj>({
    queryKey: ['@sounds/currently-playing'],
    queryFn: getCurrentlyPlaying,
  });
}
