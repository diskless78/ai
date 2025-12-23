import type {
    IRouteMapRequest,
    IRouteMapResponse,
} from 'src/models/route-map';
import { httpClient, type ApiResponse } from 'src/services/http';
import { envConfig } from 'src/config/env.config';
import { apiEndpoints } from '../remote';

const BASE_URL = envConfig.API_CXVIEW_ENDPOINT;
const API_ROUTEMAP = apiEndpoints.ROUTE_MAP;

class RouteMapService {
    async getRoutemapByCam(
        request: IRouteMapRequest
    ): Promise<ApiResponse<IRouteMapResponse>> {
        return httpClient.get(BASE_URL, API_ROUTEMAP.ROUTE_MAP_DATA, {
            params: request,
        });
    }
}

export const routeMapService = new RouteMapService();
