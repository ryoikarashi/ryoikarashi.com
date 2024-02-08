import React, { type ReactNode } from 'react';

export function Frame({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className='flex h-full max-h-[80%] w-full max-w-[1000px] grow items-center justify-center'>
      {children}
    </div>
  );
}
