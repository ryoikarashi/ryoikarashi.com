import { type OpenAIApi } from 'openai';
import { type Completion } from './ValueObjects';
import { type IDomain } from '../IDomain';
export type Client = OpenAIApi;

export interface LLMPlainObject {
  completion: string;
}

export interface LLMConfig {
  maxTokens: number;
  timeout: number;
  model: string;
}

export class LLM implements IDomain<LLMPlainObject> {
  private readonly _completion: Completion;

  public static DEFAULT_PLAIN_OBJ: LLMPlainObject = {
    completion: 'Something went wrong :(',
  };

  constructor(completion: Completion) {
    this._completion = completion;
  }

  public static DEFAULT_CONFIG: LLMConfig = {
    maxTokens: 4000,
    model: 'davinci-3.5-turbo',
    timeout: 100000,
  };

  public get completion(): Completion {
    return this._completion;
  }

  isValid(): boolean {
    return true;
  }

  toPlainObj(): LLMPlainObject {
    return {
      completion: this._completion.value(),
    };
  }

  toJson(): string {
    return JSON.stringify(this.toPlainObj());
  }
}
