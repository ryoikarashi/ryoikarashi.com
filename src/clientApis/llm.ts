import { cache } from 'react';
import { type IClientApi } from '@/clientApis/types';
import { request } from '@/utils';
import { LLM, type LLMPlainObject } from '@/packages/ryoikarashi/domain/models';

export const completion: Pick<IClientApi<LLMPlainObject>, 'get'> = {
  get: {
    request: cache(
      async () =>
        await request<LLMPlainObject>('/api/llm/completion').catch(
          () => LLM.DEFAULT_PLAIN_OBJ
        )
    ),
    preload: () => {
      void completion.get.request();
    },
  },
};
