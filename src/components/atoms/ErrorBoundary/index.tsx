'use client';

import React, { type PropsWithChildren } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorComponent(): JSX.Element {
  return <>Something went wrong :(</>;
}

export function ErrorBoundary({ children }: PropsWithChildren): JSX.Element {
  return (
    <ReactErrorBoundary fallback={<ErrorComponent />}>
      {children}
    </ReactErrorBoundary>
  );
}
