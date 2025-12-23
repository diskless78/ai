import type { AxiosInstance } from 'axios';
import { createHttpClient } from './config';
import { setupInterceptors } from './interceptors';
import type { CustomAxiosRequestConfig } from './types';

/**
 * HTTP Client class
 */
class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = createHttpClient();
    setupInterceptors(this.axiosInstance);
  }

  /**
   * Get axios instance
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Generic request
   */
  request<T = any, R = T>(
    baseURL: string,
    config: CustomAxiosRequestConfig
  ): Promise<R> {
    return this.axiosInstance.request({ baseURL, ...config });
  }

  /**
   * GET request
   */
  get<T = any, R = T>(
    baseURL: string,
    url: string,
    config?: CustomAxiosRequestConfig
  ): Promise<R> {
    return this.axiosInstance.get<T, R>(url, {
      baseURL,
      ...config,
    });
  }

  /**
   * POST request
   */
  post<T = any, R = T>(
    baseURL: string,
    url: string,
    data?: T,
    config: CustomAxiosRequestConfig = { alert: true }
  ): Promise<R> {
    return this.axiosInstance.post<T, R>(url, data, {
      baseURL,
      ...config,
    });
  }

  /**
   * PUT request
   */
  put<T = any, R = T>(
    baseURL: string,
    url: string,
    data?: T,
    config: CustomAxiosRequestConfig = { alert: true }
  ): Promise<R> {
    return this.axiosInstance.put<T, R>(url, data, {
      baseURL,
      ...config,
    });
  }

  /**
   * DELETE request
   */
  delete<T = any, R = T>(
    baseURL: string,
    url: string,
    config: CustomAxiosRequestConfig = { alert: true }
  ): Promise<R> {
    return this.axiosInstance.delete<T, R>(url, {
      baseURL,
      ...config,
    });
  }

  /**
   * PATCH request
   */
  patch<T = any, R = T>(
    baseURL: string,
    url: string,
    data?: T,
    config: CustomAxiosRequestConfig = { alert: true }
  ): Promise<R> {
    return this.axiosInstance.patch<T, R>(url, data, {
      baseURL,
      ...config,
    });
  }
}

// Singleton instance
export const httpClient = new HttpClient();
