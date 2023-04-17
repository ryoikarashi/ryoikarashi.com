import { cache } from "react";
import { IClientApi } from "@/clientApis/types";
import { request } from "@/utils";
import { LLMPlainObject } from "@/packages/ryoikarashi/domain/models";

export const completion: Pick<IClientApi<LLMPlainObject>, "get"> = {
  get: {
    request: cache(async () => {
      return request("/api/llm/completion");
    }),
    preload: () => {
      void completion.get.request();
    },
  },
};
