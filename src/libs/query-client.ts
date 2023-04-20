import { QueryClient } from '@tanstack/react-query';

export const getQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: { queries: { suspense: true } },
  });
