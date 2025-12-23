import { httpClient, type ApiResponse } from 'src/services/http';
import { envConfig } from 'src/config/env.config';
import { apiEndpoints } from '../remote';
import type { IZoneListRequest, IZoneListResponse } from 'src/models/zone';

const BASE_URL = envConfig.API_CXVIEW_ENDPOINT;
const API_ZONE = apiEndpoints.ZONE;

class ZoneService {
  async getList(
    request: IZoneListRequest
  ): Promise<ApiResponse<IZoneListResponse>> {
    return httpClient.get(BASE_URL, API_ZONE.LIST, {
      params: request,
    });
  }
}

export const zoneService = new ZoneService();
