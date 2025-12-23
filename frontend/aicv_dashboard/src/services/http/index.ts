/**
 * HTTP Service Layer
 * Provides HTTP client with interceptors and error handling
 */

export { httpClient } from './client';
export { HTTP_CONFIG, createHttpClient } from './config';
export { setupInterceptors } from './interceptors';

export type {
  CustomAxiosRequestConfig,
  ApiResponse,
  ErrorResponse,
  NetworkErrorMessage,
} from './types';
