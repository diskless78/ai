import type { IGroupResponse } from 'src/models/group';
import { httpClient, type ApiResponse } from 'src/services/http';
import { envConfig } from 'src/config/env.config';
import { apiEndpoints } from '../remote';

const BASE_URL = envConfig.API_CXVIEW_ENDPOINT;
const API_GROUP = apiEndpoints.GROUP;

class GroupService {
  async getList(): Promise<ApiResponse<IGroupResponse>> {
    return httpClient.get(BASE_URL, API_GROUP.LIST);
  }
}

export const groupService = new GroupService();
