import type { AxiosRequestConfig } from 'axios';

/**
 * Custom Axios request configuration
 */
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  /**
   * Show error alerts to user
   * @default true for POST, PUT, DELETE
   * @default false for GET
   */
  alert?: boolean;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number | string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  Error: any;
  IsResponse: boolean;
}

/**
 * Network error messages
 */
export enum NetworkErrorMessage {
  NetworkError = 'Network Error',
  NetworkTimeOut = 'timeout of 20000ms exceeded',
}
