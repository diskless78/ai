import { httpClient, type ApiResponse } from 'src/services/http';
import { envConfig } from 'src/config/env.config';
import { apiEndpoints } from '../remote';
import type { ICameraListRequest, ICameraResponse } from 'src/models/camera';

const BASE_URL = envConfig.API_CXVIEW_ENDPOINT;
const API_CAMERA = apiEndpoints.CAMERA;

class CameraService {
  async getList(
    request: ICameraListRequest
  ): Promise<ApiResponse<ICameraResponse>> {
    return httpClient.get(BASE_URL, API_CAMERA.LIST, {
      params: request,
    });
  }
}

export const cameraService = new CameraService();
