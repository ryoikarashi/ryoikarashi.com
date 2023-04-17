import { Completion } from "@/packages/ryoikarashi/domain/models/LLM/ValueObjects";
import { GetCompletion } from "./ParameterObjects/GetCompletion";

export interface ILLMRepository {
  // queries
  getCompletion(getCompletion: GetCompletion): Promise<Completion>;
}
