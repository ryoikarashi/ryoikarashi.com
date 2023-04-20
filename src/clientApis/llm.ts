import 'server-only';
import { cache } from 'react';
import { request } from '@/libs/utils';
import { LLM, type LLMPlainObject } from '@/packages/ryoikarashi/domain/models';

export const getCompletion = cache(
  async () =>
    await request<LLMPlainObject>('/api/llm/completion').catch(
      () => LLM.DEFAULT_PLAIN_OBJ
    )
);

export const preloadCompletion = (): void => {
  void getCompletion();
};
