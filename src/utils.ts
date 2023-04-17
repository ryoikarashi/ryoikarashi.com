import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export function request<TResponse>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<TResponse> {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://ryoikarashi.com"
      : "http://localhost:4000";

  return axios(`${baseUrl}${url}`, config)
    .then((response: AxiosResponse<TResponse>) => response.data)
    .then((data) => data as TResponse);
}

export const isProduction = process.env.NODE_ENV === "production";

export const prependStrOnlyDev = (
  original: string,
  prependStr: string
): string => (isProduction ? original : `${prependStr}${original}`);

export const prependDev = (original: string): string =>
  prependStrOnlyDev(original, "dev_");

export const getRootCollectionName = (collectionName: string): string =>
  prependDev(collectionName);

export const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));
