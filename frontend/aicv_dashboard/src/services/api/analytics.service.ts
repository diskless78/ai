import type {
  IStoreComparisonRequest,
  IStoreComparisonResponse,
  IStoreTrafficTrendChartRequest,
  IStoreTransactionItem,
  IStoreTransactionRequest,
  ISummaryTableRequest,
  ISummaryTableResponse,
  ITopStoreRequest,
  ITopStoreResponse,
  ITotalZoneChartRequest,
  ITotalZoneChartResponse,
  ITrafficTrendChartResponse,
  IZoneAndTrafficChartRequest,
  IZoneAndTrafficChartResponse,
  IZoneComparisonRequest,
  IZoneComparisonResponse,
  IZoneTrafficOverviewRequest,
  IZoneTrafficOverviewResponse,
  IZoneTrafficTrendChartRequest,
} from 'src/models/analystics';
import { httpClient, type ApiResponse } from 'src/services/http';
import { envConfig } from 'src/config/env.config';
import { apiEndpoints } from '../remote';
import type { IBasePagingRes } from 'src/models/common/models.type';
import type { ITransactionAndInteractionChartRequest } from 'src/models/data-overview';

const BASE_URL = envConfig.API_CXVIEW_ENDPOINT;
const API_ANALYTICS = apiEndpoints.ANALYTICS;

class AnalyticsService {
  async getSummaryTable(
    request: ISummaryTableRequest
  ): Promise<ApiResponse<ISummaryTableResponse>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.SUMMARY_TABLE, {
      params: request,
    });
  }

  async getTopStore(
    request: ITopStoreRequest
  ): Promise<ApiResponse<ITopStoreResponse>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.TOP_STORE, {
      params: request,
    });
  }

  async getStoreComparison(
    request: IStoreComparisonRequest
  ): Promise<ApiResponse<IStoreComparisonResponse>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.STORE_COMPARISON, {
      params: request,
    });
  }

  async getZoneTrafficOverview(
    request: IZoneTrafficOverviewRequest
  ): Promise<ApiResponse<IZoneTrafficOverviewResponse>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.ZONE_TRAFFIC_OVERVIEW, {
      params: request,
    });
  }

  async getZoneAndTrafficChart(
    request: IZoneAndTrafficChartRequest
  ): Promise<ApiResponse<IZoneAndTrafficChartResponse>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.ZONE_AND_TRAFFIC_CHART, {
      params: request,
    });
  }

  async getTotalZoneChart(
    request: ITotalZoneChartRequest
  ): Promise<ApiResponse<ITotalZoneChartResponse>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.TOTAL_ZONE_CHART, {
      params: request,
    });
  }

  async getZoneComparison(
    request: IZoneComparisonRequest
  ): Promise<ApiResponse<IZoneComparisonResponse>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.ZONE_COMPARISON, {
      params: request,
    });
  }

  async getStoreTransaction(
    request: IStoreTransactionRequest
  ): Promise<ApiResponse<IBasePagingRes<IStoreTransactionItem>>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.STORE_TRANSACTION, {
      params: request,
    });
  }

  async getStoreTrafficTrendChart(
    request: IStoreTrafficTrendChartRequest
  ): Promise<ApiResponse<ITrafficTrendChartResponse>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.TRAFFIC_TREND_CHART, {
      params: request,
    });
  }

  async getZoneTrafficTrendChart(
    request: IZoneTrafficTrendChartRequest
  ): Promise<ApiResponse<ITrafficTrendChartResponse>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.TRAFFIC_TREND_CHART, {
      params: request,
    });
  }

  async exportStoreTrafficTrendChart(
    request: IStoreTrafficTrendChartRequest
  ): Promise<ApiResponse<Blob>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.EXPORT_VISITOR_TRAFFIC, {
      params: request,
      responseType: 'blob',
    });
  }

  async exportZoneTrafficTrendChart(
    request: IZoneTrafficTrendChartRequest
  ): Promise<ApiResponse<Blob>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.EXPORT_VISITOR_TRAFFIC, {
      params: request,
      responseType: 'blob',
    });
  }

  async exportStoreComparison(
    request: IStoreComparisonRequest
  ): Promise<ApiResponse<Blob>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.EXPORT_STORE_COMPARISON, {
      params: request,
      responseType: 'blob',
    });
  }

  async exportTransactionAndInteraction(
    request: ITransactionAndInteractionChartRequest
  ): Promise<ApiResponse<Blob>> {
    return httpClient.get(
      BASE_URL,
      API_ANALYTICS.EXPORT_TRANSACTION_AND_INTERACTION_CHART,
      {
        params: request,
        responseType: 'blob',
      }
    );
  }

  async exportZoneComparison(
    request: IZoneComparisonRequest
  ): Promise<ApiResponse<Blob>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.EXPORT_ZONE_COMPARISON, {
      params: request,
      responseType: 'blob',
    });
  }

  async exportZoneTrafficChart(
    request: IZoneAndTrafficChartRequest
  ): Promise<ApiResponse<Blob>> {
    return httpClient.get(BASE_URL, API_ANALYTICS.EXPORT_ZONE_TRAFFIC_CHART, {
      params: request,
      responseType: 'blob',
    });
  }
}

export const analyticsService = new AnalyticsService();
