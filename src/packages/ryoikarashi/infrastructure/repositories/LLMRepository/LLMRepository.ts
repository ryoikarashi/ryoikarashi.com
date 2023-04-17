import { ILLMRepository } from './ILLMRepository';
import {
  LLM,
  Client,
  LLMConfig,
} from '@/packages/ryoikarashi/domain/models/LLM/LLM';
import { Completion } from '@/packages/ryoikarashi/domain/models/LLM/ValueObjects';
import { GetCompletion } from './ParameterObjects/GetCompletion';

export class LLMRepository implements ILLMRepository {
  private _client: Client;
  private _config: LLMConfig;

  constructor(client: Client, config?: LLMConfig) {
    this._client = client;
    this._config = config ?? LLM.DEFAULT_CONFIG;
  }

  public async getCompletion(
    getCompletion: GetCompletion
  ): Promise<Completion> {
    const res = await this._client.createChatCompletion(
      {
        messages: [{ role: 'user', content: getCompletion.message }],
        model: this._config.model,
        max_tokens: this._config.maxTokens,
      },
      {
        timeout: this._config.timeout,
      }
    );

    return new Completion(res.data.choices[0]?.message?.content ?? '');
  }
}
