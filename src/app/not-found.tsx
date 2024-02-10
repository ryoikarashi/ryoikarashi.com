import React from 'react';
import { Link, Text } from '@/components/atoms';

export default function NotFound(): JSX.Element {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Link href={'/'} noUnderline={true} className='block'>
        <Text size='md'>404 Not Found</Text>
      </Link>
    </div>
  );
}
