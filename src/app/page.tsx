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
      <div className='flex w-full grow flex-col items-center justify-center overflow-hidden'>
        <Photo.Frame>
          <Photo.Image />
        </Photo.Frame>
      </div>
      <Profile className='flex w-full flex-col' />
    </main>
  );
}
