import { type LLM } from '@/packages/ryoikarashi/domain/models/LLM/LLM';

export interface ILLMService {
  getTrackExplanation: () => Promise<LLM>;
}
