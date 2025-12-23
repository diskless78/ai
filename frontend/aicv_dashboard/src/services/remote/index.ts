/**
 * @deprecated Use services from 'src/services' instead
 * This file is kept for backward compatibility only
 */

// Re-export everything from new structure
export { httpClient as apiClient } from '../http';
export { default as api } from './base-api';
export { default } from './base-api';

export type {
  CustomAxiosRequestConfig,
  ApiResponse,
  ErrorResponse,
} from '../http';

export {
  HTTP_CONFIG as API_CONFIG,
  createHttpClient as createAxiosInstance,
} from '../http';
export { default as apiEndpoints } from './api-endpoints';
