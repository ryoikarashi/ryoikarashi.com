import { cache } from "react";
import { IClientApi } from "@/clientApis/types";
import { request } from "@/utils";
import { LLM, LLMPlainObject } from "@/packages/ryoikarashi/domain/models";

export const completion: Pick<IClientApi<LLMPlainObject>, "get"> = {
  get: {
    request: cache(async () => {
      return request<LLMPlainObject>("/api/llm/completion").catch(
        () => LLM.DEFAULT_PLAIN_OBJ
      );
    }),
    preload: () => {
      void completion.get.request();
    },
  },
};
