import { useQuery } from '@tanstack/react-query';
import { dataOverviewService } from 'src/services';
import type {
  IDataOverviewRequest,
  ITrafficChartRequest,
  ITransactionAndInteractionChartRequest,
  IZoneTrafficChartRequest,
} from 'src/models/data-overview';

export const CACHE_KEYS = {
  DataOverview: 'DATA_OVERVIEW',
  TrafficChart: 'TRAFFIC_CHART',
  ZoneTrafficChart: 'ZONE_TRAFFIC_CHART',
  TransactionAndInteractionChart: 'TRANSACTION_AND_INTERACTION_CHART',
  ExportTrafficChart: 'EXPORT_TRAFFIC_CHART',
};

const STALE_TIME = 5_000;
const REFRESH_INTERVAL = 30_000;

export const useDataOverview = (params: IDataOverviewRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.DataOverview, params],
    queryFn: () => dataOverviewService.getDataOverview(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled:
      !!params.time_filter_type && !!params.start_date && !!params.end_date,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useTrafficChart = (params: ITrafficChartRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.TrafficChart, params],
    queryFn: () => dataOverviewService.getTrafficChart(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled:
      !!params.time_filter_type &&
      !!params.type &&
      !!params.start_date &&
      !!params.end_date,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useZoneTrafficChart = (params: IZoneTrafficChartRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ZoneTrafficChart, params],
    queryFn: () => dataOverviewService.getZoneTrafficChart(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled:
      !!params.time_filter_type &&
      !!params.type &&
      !!params.start_date &&
      !!params.end_date,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useTransactionAndInteraction = (
  params: ITransactionAndInteractionChartRequest
) => {
  return useQuery({
    queryKey: [CACHE_KEYS.TransactionAndInteractionChart, params],
    queryFn: () =>
      dataOverviewService.getTransactionAndInteractionChart(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled:
      !!params.time_filter_type && !!params.start_date && !!params.end_date,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useExportTrafficChart = (params: ITrafficChartRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ExportTrafficChart, params],
    queryFn: () => dataOverviewService.exportTrafficChart(params),
    staleTime: STALE_TIME,
    enabled: false,
    select: (res) => res.data,
  });
};
