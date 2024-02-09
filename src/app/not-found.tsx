import React from 'react';
import { Photo } from '@/components/organisms';
import { Link, Text } from '@/components/atoms';

export default function NotFound(): JSX.Element {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Link href={'/'} noUnderline={true} className='block'>
        <div className='h-full w-full'>
          <Photo.Frame>
            <Photo.Image />
          </Photo.Frame>
        </div>
        <div className='mt-3 text-right'>
          <Text size='md'>404 NOT FOUND</Text>
        </div>
      </Link>
    </div>
  );
}
