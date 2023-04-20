'use client';

import React, { type PropsWithChildren } from 'react';
import { PusherProvider as _PusherProvider } from '@harelpls/use-pusher';

const config = {
  options: {
    cluster: 'ap3',
  },
  channelName: 'spotify',
  eventName: 'fetch-currently-listening-track',
  clientKey: 'f3f5751318b2c7958521',
  cluster: 'ap3',
};

export function PusherProvider({ children }: PropsWithChildren): JSX.Element {
  return <_PusherProvider {...config}>{children}</_PusherProvider>;
}
