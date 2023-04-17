export type HTTPVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type IClientApi<T> = {
  [k in HTTPVerb]: {
    request: () => Promise<T>;
    preload: () => void;
  };
};
