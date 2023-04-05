import { LLM } from '../../Entities/LLM/LLM';

export interface ILLMService {
    getTrackExplanation(): Promise<LLM>;
}
