import { cache } from "react";
import { IClientApi } from "@/clientApis/types";
import { request } from "@/utils";
import { WordPlainObject } from "@/packages/ryoikarashi/domain/models";

export const randomPaliWord: Pick<IClientApi<WordPlainObject>, "get"> = {
  get: {
    request: cache(async () => {
      return request("/api/dictionaries/random-pali-word");
    }),
    preload: () => {
      void randomPaliWord.get.request();
    },
  },
};
