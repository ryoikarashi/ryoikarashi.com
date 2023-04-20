import React from 'react';
import { Text } from '@/components/atoms';
import {
  getRandomPaliWord,
  preloadRandomPaliWord,
} from '@/clientApis/dictionary';

export async function WordExplanation(): Promise<JSX.Element> {
  preloadRandomPaliWord();
  const word = await getRandomPaliWord();
  return <Text>{word.explanation}</Text>;
}
