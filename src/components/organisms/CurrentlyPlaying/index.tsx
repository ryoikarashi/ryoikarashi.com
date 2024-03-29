import { ErrorBoundary, Loading } from '@/components/atoms';
import React, { Suspense } from 'react';
import { FetchTrack } from './fetchTrack';

export function CurrentlyPlaying(): JSX.Element {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading.Placeholder />}>
        <FetchTrack />
      </Suspense>
    </ErrorBoundary>
  );
}
