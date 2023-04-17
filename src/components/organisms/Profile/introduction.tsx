import { Text } from '@/components/atoms';

export function Introduction() {
  return (
    <Text size='sm'>
      Hi, I&apos;m{' '}
      <Text size='sm' link='https://me.ryoikarashi.com'>
        Ryo Ikarashi
      </Text>
      , a freelance software developer based in Kyoto, Japan.
    </Text>
  );
}
