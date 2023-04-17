import { cache } from "react";
import { IClientApi } from "@/clientApis/types";
import { request } from "@/utils";
import { TrackPlainObj } from "@/packages/ryoikarashi/domain/models";

export const currentlyPlaying: Pick<IClientApi<TrackPlainObj>, "get"> = {
  get: {
    request: cache(async () => {
      return request("/api/sounds/currently-playing");
    }),
    preload: () => {
      void currentlyPlaying.get.request();
    },
  },
};
