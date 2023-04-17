import React from 'react';
import { Loading as LoadingComponent } from '@/components/atoms';

export default function Loading(): JSX.Element {
  return (
    <div className='bg-white transition duration-500 dark:bg-black'>
      <div className='fixed inset-0 flex justify-center'>
        <div className='flex min-h-screen w-full items-center justify-center'>
          <LoadingComponent />
        </div>
      </div>
    </div>
  );
}
