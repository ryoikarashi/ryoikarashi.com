'use client';

import React, { type PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: PropsWithChildren): JSX.Element {
  return <ThemeProvider attribute={'class'}>{children}</ThemeProvider>;
}
