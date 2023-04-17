import { cache } from "react";
import { IClientApi } from "@/clientApis/types";
import { request } from "@/utils";
import { GiphyPlainObj } from "@/packages/ryoikarashi/domain/models";

export const randomGif: Pick<IClientApi<GiphyPlainObj>, "get"> = {
  get: {
    request: cache(async () => {
      return request("/api/gifs/random");
    }),
    preload: () => {
      void randomGif.get.request();
    },
  },
};
