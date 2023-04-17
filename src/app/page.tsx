import React, { Suspense } from 'react';
import { ThemeSwitcher } from '@/components/molecules';
import { PaliWord, Photo, Profile } from '@/components/organisms';

export default function Page(): JSX.Element {
  return (
    <main
      className={`flex max-h-screen min-h-screen flex-col items-center justify-between p-4`}
    >
      <div className='flex w-full justify-between'>
        <ThemeSwitcher />
        <PaliWord className='m-3' />
      </div>
      <div className='flex w-full grow items-center justify-center'>
        <Suspense fallback={<Photo.Loading />}>
          {/* @ts-expect-error Server Component */}
          <Photo />
        </Suspense>
      </div>
      <Profile className='w-full' />
    </main>
  );
}
