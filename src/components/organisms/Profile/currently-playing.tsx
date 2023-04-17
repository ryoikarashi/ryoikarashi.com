import { api } from '@/clientApis';
import { Link, Text } from '@/components/atoms';

export async function CurrentlyPlaying() {
  api.sound.currentlyPlaying.get.preload();
  const track = await api.sound.currentlyPlaying.get.request();
  return (
    <Link href={track.link} target='_blank' noUnderline>
      <Text size='sm' className='mr-1'>
        ♫
      </Text>
      <Text size='sm'>
        {track.isPlaying ? 'Currently Playing' : 'Recently Played'}
      </Text>
      <Text size='sm' className='mr-1'>
        :
      </Text>
      <Text size='sm'>{track.name}</Text>
      <Text size='sm' className='mx-1'>
        -
      </Text>
      <Text size='sm'>{track.artists.map((artist) => artist).join(', ')}</Text>
    </Link>
  );
}
