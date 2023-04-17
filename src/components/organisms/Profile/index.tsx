import { Suspense } from 'react';
import { HTMLElementProps, Loading, Paragraph, Text } from '@/components/atoms';
import { CurrentlyPlaying } from './currently-playing';
import { Links } from './links';
import { Introduction } from './introduction';

export type ProfileProps = HTMLElementProps<HTMLDivElement>;

export function Profile(props: ProfileProps) {
  return (
    <div {...props}>
      <Paragraph gap='none'>
        <Introduction />
      </Paragraph>

      <Paragraph gap='sm'>
        <Links />
      </Paragraph>

      <Paragraph gap='sm'>
        <Suspense fallback={<Loading.Placeholder className='mt-4' />}>
          {/*@ts-expect-error Server Component */}
          <CurrentlyPlaying />
        </Suspense>
      </Paragraph>
    </div>
  );
}
