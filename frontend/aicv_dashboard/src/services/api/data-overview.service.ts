import type {
  IDataOverviewRequest,
  IDataOverviewResponse,
  ITrafficChartResponse,
  ITrafficChartRequest,
  IZoneTrafficChartRequest,
  IZoneTrafficChartResponse,
  ITransactionAndInteractionChartRequest,
  ITransactionAndInteractionChartResponse,
} from 'src/models/data-overview';
import { httpClient, type ApiResponse } from 'src/services/http';
import { envConfig } from 'src/config/env.config';
import { apiEndpoints } from '../remote';

const BASE_URL = envConfig.API_CXVIEW_ENDPOINT;
const API_DATA_OVERVIEW = apiEndpoints.DATA_OVERVIEW;

class DataOverviewService {
  async getDataOverview(
    request: IDataOverviewRequest
  ): Promise<ApiResponse<IDataOverviewResponse>> {
    return httpClient.get(BASE_URL, API_DATA_OVERVIEW.DATA_OVERVIEW, {
      params: request,
    });
  }

  async getTrafficChart(
    request: ITrafficChartRequest
  ): Promise<ApiResponse<ITrafficChartResponse>> {
    return httpClient.get(BASE_URL, API_DATA_OVERVIEW.TRAFFIC_CHART, {
      params: request,
    });
  }

  async getZoneTrafficChart(
    request: IZoneTrafficChartRequest
  ): Promise<ApiResponse<IZoneTrafficChartResponse>> {
    return httpClient.get(BASE_URL, API_DATA_OVERVIEW.ZONE_TRAFFIC_CHART, {
      params: request,
    });
  }

  async getTransactionAndInteractionChart(
    request: ITransactionAndInteractionChartRequest
  ): Promise<ApiResponse<ITransactionAndInteractionChartResponse>> {
    return httpClient.get(
      BASE_URL,
      API_DATA_OVERVIEW.TRANSACTION_AND_INTERACTION_CHART,
      {
        params: request,
      }
    );
  }

  async exportTrafficChart(
    request: ITrafficChartRequest
  ): Promise<ApiResponse<Blob>> {
    return httpClient.get(BASE_URL, API_DATA_OVERVIEW.EXPORT_TRAFFIC_CHART, {
      params: request,
      responseType: 'blob',
    });
  }
}

export const dataOverviewService = new DataOverviewService();
