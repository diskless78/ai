import type { GetUserInfoResponse } from 'src/models/user';
import { httpClient, type ApiResponse } from 'src/services/http';
import { envConfig } from 'src/config/env.config';
import { apiEndpoints } from '../remote';

const BASE_URL = envConfig.API_CXVIEW_ENDPOINT;
const API_USER = apiEndpoints.USER;

class UserService {
  async getUserInfo(): Promise<ApiResponse<GetUserInfoResponse>> {
    return httpClient.get(BASE_URL, API_USER.GET_PROFILE);
  }
}

export const userService = new UserService();
