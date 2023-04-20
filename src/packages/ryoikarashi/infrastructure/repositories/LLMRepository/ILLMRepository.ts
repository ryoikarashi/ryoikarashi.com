import { type Completion } from '@/packages/ryoikarashi/domain/models/LLM/ValueObjects';
import { type GetCompletion } from './ParameterObjects/GetCompletion';

export interface ILLMRepository {
  // queries
  getCompletion: (getCompletion: GetCompletion) => Promise<Completion>;
}
