import React from 'react';
import { api } from '@/clientApis';
import { Text } from '@/components/atoms';

export async function WordExplanation(): Promise<JSX.Element> {
  api.dictionary.randomPaliWord.get.preload();
  const word = await api.dictionary.randomPaliWord.get.request();
  return <Text>{word.explanation}</Text>;
}
