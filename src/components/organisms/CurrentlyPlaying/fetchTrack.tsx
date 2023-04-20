'use client';

import React from 'react';
import { useChannel, useEvent } from '@harelpls/use-pusher';
import isEqual from 'lodash.isequal';
import { Track } from './track';
import { type TrackPlainObj } from '@/packages/ryoikarashi/domain/models';
import { useStore } from '@/stores';
import { useGetCurrentlyPlaying } from '@/clientApis/sound';

export function FetchTrack(): JSX.Element {
  const { data: initialTrack } = useGetCurrentlyPlaying();
  const track = useStore((state) => state.currentlyPlayingTrack);
  const updateTrack = useStore((state) => state.updateCurrentlyPlayingTrack);

  const channel = useChannel('spotify');
  useEvent<TrackPlainObj>(
    channel,
    'fetch-currently-listening-track',
    (newTrack) => {
      if (newTrack !== undefined && !isEqual(track, newTrack)) {
        updateTrack(newTrack);
      }
    }
  );

  return initialTrack !== undefined ? (
    <Track track={track ?? initialTrack} />
  ) : (
    <></>
  );
}
