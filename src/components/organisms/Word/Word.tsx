import { api } from '@/clientApis';
import { Text } from '@/components/atoms';

export async function Word() {
  api.dictionary.randomPaliWord.get.preload();
  const word = await api.dictionary.randomPaliWord.get.request();
  return <Text>{word.name}</Text>;
}
