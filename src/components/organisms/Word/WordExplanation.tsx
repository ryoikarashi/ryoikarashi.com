import { api } from "@/clientApis";
import { Text } from "@/components/atoms";

export async function WordExplanation() {
  api.dictionary.randomPaliWord.get.preload();
  const word = await api.dictionary.randomPaliWord.get.request();
  return <Text>{word.explanation}</Text>;
}
