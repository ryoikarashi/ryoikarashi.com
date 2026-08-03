import React, { type JSX } from 'react';
import { Link, Text } from '@/components/atoms';

export default function NotFound(): JSX.Element {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Link href={'/'} noUnderline className='block' prefetch>
        <Text size='md'>404 Not Found</Text>
      </Link>
    </div>
  );
}
