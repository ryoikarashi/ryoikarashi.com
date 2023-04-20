'use client';

import React, { type PropsWithChildren } from 'react';
import { ThemeProvider } from './theme';
import { PusherProvider } from './pusher';
import { QueryClientProvider } from './query-client';

export function Providers({ children }: PropsWithChildren): JSX.Element {
  return (
    <QueryClientProvider>
      <ThemeProvider attribute={'class'}>
        <PusherProvider>{children}</PusherProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
