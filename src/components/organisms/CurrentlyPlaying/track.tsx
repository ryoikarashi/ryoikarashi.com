'use client';

import React, { type ReactNode } from 'react';
import ReactMarquee from 'react-fast-marquee';
import { type TrackPlainObj } from '@/packages/ryoikarashi/domain/models';
import { Link, Text } from '@/components/atoms';

export interface CurrentlyPlayingProps {
  track: TrackPlainObj;
}

function Marquee({
  isPlaying,
  children,
}: {
  isPlaying: boolean;
  children: ReactNode;
}): JSX.Element {
  return isPlaying ? (
    <ReactMarquee speed={20} pauseOnHover={true} className='z-0'>
      {children}
    </ReactMarquee>
  ) : (
    <>{children}</>
  );
}

export function Track({ track }: CurrentlyPlayingProps): JSX.Element {
  return (
    <div className='flex items-center'>
      <div className='mr-2 shrink-0'>
        <Text size='sm' className='mr-1'>
          ♫
        </Text>
        <Text size='sm'>
          {track.isPlaying ? 'Currently Playing' : 'Recently Played'}
        </Text>
        <Text size='sm' className='ml-1'>
          :
        </Text>
      </div>
      <Link href={track.link} target='_blank' noUnderline className='block'>
        <Marquee isPlaying={track.isPlaying}>
          <Text size='sm'>{track.name}</Text>
          <Text size='sm' className='mx-1'>
            -
          </Text>
          <Text size='sm'>
            {track.artists.map((artist) => artist).join(', ')}
            <span className='mx-2'>{'//'}</span>
          </Text>
        </Marquee>
      </Link>
    </div>
  );
}
