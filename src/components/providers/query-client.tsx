import React, { type PropsWithChildren, useState, type JSX } from 'react';
import { QueryClientProvider as RQQueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/libs';

export function QueryClientProvider({
  children,
}: PropsWithChildren): JSX.Element {
  const [queryClient] = useState(getQueryClient);

  return (
    <RQQueryClientProvider client={queryClient}>
      {children}
    </RQQueryClientProvider>
  );
}
