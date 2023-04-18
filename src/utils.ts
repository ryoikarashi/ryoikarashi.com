import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const requestClient = axios.create({
  responseType: 'json',
  transitional: {
    silentJSONParsing: false,
  },
});

export async function request<TResponse>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<TResponse> {
  return await requestClient(url, config)
    .then((response: AxiosResponse<TResponse>) => response.data)
    .then((data) => data);
}

export const isProduction = process.env.NODE_ENV === 'production';

export const prependStrOnlyDev = (
  original: string,
  prependStr: string
): string => (isProduction ? original : `${prependStr}${original}`);

export const prependDev = (original: string): string =>
  prependStrOnlyDev(original, 'dev_');

export const getRootCollectionName = (collectionName: string): string =>
  prependDev(collectionName);

export const sleep = async (msec: number): Promise<unknown> =>
  await new Promise((resolve) => setTimeout(resolve, msec));
