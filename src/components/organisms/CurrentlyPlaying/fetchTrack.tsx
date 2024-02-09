import React from 'react';
import { Track } from './track';
import {
  getCurrentlyPlaying,
  preloadCurrentlyPlaying,
} from '@/clientApis/sound';

export async function FetchTrack(): Promise<JSX.Element> {
  preloadCurrentlyPlaying();
  const track = await getCurrentlyPlaying();
  return <Track initialTrack={track} />;
}
