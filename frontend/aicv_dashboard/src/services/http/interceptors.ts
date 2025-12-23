import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { HttpStatusCode } from 'axios';
import { toggleMessage } from 'src/components/toast/toast/toast';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';
import { ELanguage } from 'src/models/common/models.enum';
import Lang, { CountryLanguage } from 'src/i18n/i18n';
import { authTokens } from '../services';
import type { ApiResponse, CustomAxiosRequestConfig } from './types';

/**
 * Request interceptor - adds auth and language headers
 */
export const requestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const lang = Lang.language;
  const token = await authTokens.getAccessToken();

  if (token) {
    config.headers.authorization = token;
  }

  config.headers['Accept-Language'] =
    lang === CountryLanguage.VI ? ELanguage.Vie : ELanguage.Eng;

  return config;
};

/**
 * Response success interceptor - normalize response format
 */
export const responseSuccessInterceptor = (
  response: AxiosResponse
): AxiosResponse => {
  // Check if server already returns normalized format
  const serverData = response.data;

  // Normalize response to consistent format
  const normalizedData: ApiResponse = {
    statusCode: response.status,
    success: true,
    data: serverData,
    message: serverData.message,
  };

  // Return normalized data as AxiosResponse
  return normalizedData as any;
};

/**
 * Get error message by status code
 */
const getErrorMessage = (code: number): string => {
  const messages: Record<number, string> = {
    [HttpStatusCode.InternalServerError]:
      'Server đang có lỗi. Vui lòng thử lại sau!',
    [HttpStatusCode.Forbidden]: 'Bạn không có quyền thực hiện chức năng này!',
    [HttpStatusCode.TooManyRequests]:
      'Quá nhiều yêu cầu. Vui lòng thử lại sau!',
  };
  return messages[code] || 'Đã có lỗi xảy ra';
};

/**
 * Response error interceptor - simplified
 */
export const responseErrorInterceptor = async (error: any): Promise<any> => {
  const config = error.config as CustomAxiosRequestConfig;
  const shouldAlert = config?.alert ?? false;
  const statusCode = error.response?.status || error.code;

  // Handle 401 - redirect to login
  if (statusCode === HttpStatusCode.Unauthorized) {
    if (!window.location.href.includes(ROUTES_CONSTANT.LOGIN)) {
      window.location.href = ROUTES_CONSTANT.LOGIN;
    }
    return Promise.reject(error);
  }

  // Get error message
  const message =
    error.response?.data?.message ||
    getErrorMessage(statusCode) ||
    error.message ||
    'Đã có lỗi xảy ra';

  // Show alert if needed
  if (shouldAlert && message) {
    toggleMessage({
      type: 'error',
      message,
    });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      statusCode,
      message,
      url: error.config?.url,
      method: error.config?.method,
      error,
    });
  }

  const normalizedData: ApiResponse = {
    statusCode,
    success: false,
    data: null,
    message,
  };

  // Return normalized error
  return normalizedData;
};

/**
 * Setup interceptors for axios instance
 */
export const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(requestInterceptor, (error) =>
    Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    responseSuccessInterceptor,
    responseErrorInterceptor
  );
};
