import { type ILLMRepository } from './ILLMRepository';
import {
  LLM,
  type Client,
  type LLMConfig,
} from '@/packages/ryoikarashi/domain/models/LLM/LLM';
import { Completion } from '@/packages/ryoikarashi/domain/models/LLM/ValueObjects';
import { type GetCompletion } from './ParameterObjects/GetCompletion';

export class LLMRepository implements ILLMRepository {
  private readonly _client: Client;
  private readonly _config: LLMConfig;

  constructor(client: Client, config?: LLMConfig) {
    this._client = client;
    this._config = config ?? LLM.DEFAULT_CONFIG;
  }

  public async getCompletion(
    getCompletion: GetCompletion
  ): Promise<Completion> {
    const res = await this._client.chat.completions.create(
      {
        messages: [{ role: 'user', content: getCompletion.message }],
        model: this._config.model,
        max_tokens: this._config.maxTokens,
      },
      {
        timeout: this._config.timeout,
      }
    );

    return new Completion(res.choices[0]?.message?.content ?? '');
  }
}
