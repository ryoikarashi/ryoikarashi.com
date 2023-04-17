export type HTTPVerb = "get" | "post" | "put" | "patch" | "delete";

export type IClientApi<T> = {
  [key in HTTPVerb]: {
    request: () => Promise<T>;
    preload: () => void;
  };
};
