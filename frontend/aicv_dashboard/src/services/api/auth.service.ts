import type { ILoginRequest, ILoginResponse } from 'src/models/auth';
import { httpClient, type ApiResponse } from 'src/services/http';
import { envConfig } from 'src/config/env.config';
import { apiEndpoints } from '../remote';

const BASE_URL = envConfig.API_CXVIEW_ENDPOINT;
const API_AUTH = apiEndpoints.AUTH;

class AuthService {
  async login(request: ILoginRequest): Promise<ApiResponse<ILoginResponse>> {
    return httpClient.post(BASE_URL, API_AUTH.LOGIN, request, {
      alert: false,
    });
  }
}

export const authService = new AuthService();
