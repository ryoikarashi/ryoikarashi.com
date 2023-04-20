import React from 'react';
import { ThemeSwitcher } from '@/components/molecules';
import { PaliWord, Photo, Profile } from '@/components/organisms';

export default function Page(): JSX.Element {
  return (
    <main
      className={`flex h-full flex-col items-center justify-between overscroll-none p-4`}
    >
      <div className='flex w-full justify-between'>
        <ThemeSwitcher />
        <PaliWord className='m-3' />
      </div>
      <div className='flex w-full grow items-center justify-center'>
        <Photo />
      </div>
      <Profile className='w-full' />
    </main>
  );
}
