import React from 'react';
import { type HTMLElementProps, Paragraph } from '@/components/atoms';
import { Links } from './links';
import { Introduction } from './introduction';
import { CurrentlyPlaying } from '@/components/organisms/CurrentlyPlaying';

export type ProfileProps = HTMLElementProps<HTMLDivElement>;

export function Profile(props: ProfileProps): JSX.Element {
  return (
    <div {...props}>
      <Paragraph gap='none'>
        <Introduction />
      </Paragraph>

      <Paragraph gap='sm'>
        <Links />
      </Paragraph>

      <Paragraph gap='sm'>
        <CurrentlyPlaying />
      </Paragraph>
    </div>
  );
}
