/**
 * @deprecated Use httpClient from 'src/services/http' instead
 * This file is kept for backward compatibility only
 */

import { httpClient } from '../http';

// Legacy API object
const api = {
  request: httpClient.request.bind(httpClient),
  get: httpClient.get.bind(httpClient),
  post: httpClient.post.bind(httpClient),
  put: httpClient.put.bind(httpClient),
  delete: httpClient.delete.bind(httpClient),
  patch: httpClient.patch.bind(httpClient),
};

/**
 * @deprecated
 */
export function getAuthorizationToken(): string | undefined {
  return httpClient.getInstance().defaults.headers.common
    .Authorization as string;
}

/**
 * @deprecated
 */
export function removeAuthorizationToken(): void {
  delete httpClient.getInstance().defaults.headers.common.Authorization;
}

// Re-export types
export type {
  CustomAxiosRequestConfig,
  ApiResponse,
  ErrorResponse,
  NetworkErrorMessage,
} from '../http/types';

export { NetworkErrorMessage as Message } from '../http/types';

export default api;
