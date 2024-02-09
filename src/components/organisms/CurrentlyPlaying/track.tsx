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
    <ReactMarquee
      speed={20}
      pauseOnHover={true}
      className='z-0'
      autoFill={true}
    >
      {children}
    </ReactMarquee>
  ) : (
    <>{children}</>
  );
}

export function Track({ track }: CurrentlyPlayingProps): JSX.Element {
  return (
    <div className='flex items-center'>
      <div className='shrink-0'>
        <Text size='sm' className='mr-1'>
          ♫
        </Text>
        <Text size='xs'>
          {track.isPlaying ? 'Currently Playing' : 'Recently Played'}
        </Text>
        <Text size='xs' className='ml-1'>
          :
        </Text>
      </div>
      <Link
        href={track.link}
        target='_blank'
        noUnderline
        className={`block overflow-hidden text-ellipsis whitespace-nowrap lg:overflow-visible ${
          track.isPlaying ? 'max-w-full md:max-w-[350px]' : ''
        }`}
      >
        <Marquee isPlaying={track.isPlaying}>
          <Text size='xs'>{track.name}</Text>
          <Text size='xs' className='mx-1'>
            -
          </Text>
          <Text size='xs'>
            {track.artists.map((artist) => artist).join(', ')}
            {track.isPlaying ? <span className='mx-2'>{'.'}</span> : null}
          </Text>
        </Marquee>
      </Link>
    </div>
  );
}
