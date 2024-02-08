import React from 'react';
import { Text } from '@/components/atoms';

export function Introduction(): JSX.Element {
  return (
    <Text size='sm'>
      Hi, I&apos;m{' '}
      <Text size='sm' link='https://me.ryoikarashi.com'>
        Ryo Ikarashi
      </Text>
      ,<br className={'md:hidden'} /> a freelance software developer based in
      Kyoto, Japan.
    </Text>
  );
}
