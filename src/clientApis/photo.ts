import { cache } from "react";
import { IClientApi } from "@/clientApis/types";
import { request } from "@/utils";
import { PhotoPlainObj } from "@/packages/ryoikarashi/domain/models";

export const random: Pick<IClientApi<PhotoPlainObj>, "get"> = {
  get: {
    request: cache(async () => {
      return request("/api/photos/random");
    }),
    preload: () => {
      void random.get.request();
    },
  },
};
