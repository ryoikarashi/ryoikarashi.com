import React from 'react';
import { type TrackPlainObj } from '@/packages/ryoikarashi/domain/models';
import { Link, Text } from '@/components/atoms';

export interface CurrentlyPlayingProps {
  track: TrackPlainObj;
}

export function Track({ track }: CurrentlyPlayingProps): JSX.Element {
  return (
    <Link href={track.link} target='_blank' noUnderline>
      <Text size='sm' className='mr-1'>
        ♫
      </Text>
      <Text size='sm'>
        {track.isPlaying ? 'Currently Playing' : 'Recently Played'}
      </Text>
      <Text size='sm' className='mr-1'>
        :
      </Text>
      <Text size='sm'>{track.name}</Text>
      <Text size='sm' className='mx-1'>
        -
      </Text>
      <Text size='sm'>{track.artists.map((artist) => artist).join(', ')}</Text>
    </Link>
  );
}
