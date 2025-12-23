import { useQuery } from '@tanstack/react-query';
import type {
  ISummaryTableRequest,
  ITopStoreRequest,
  IStoreComparisonRequest,
  IZoneTrafficOverviewRequest,
  IZoneAndTrafficChartRequest,
  ITotalZoneChartRequest,
  IZoneComparisonRequest,
  IStoreTransactionRequest,
  IStoreTrafficTrendChartRequest,
  IZoneTrafficTrendChartRequest,
} from 'src/models/analystics';
import type { ITransactionAndInteractionChartRequest } from 'src/models/data-overview';
import { analyticsService } from 'src/services';

export const CACHE_KEYS = {
  SummaryTable: 'SUMMARY_TABLE',
  TopStore: 'TOP_STORE',
  StoreComparison: 'STORE_COMPARISON',
  ZoneTrafficOverview: 'ZONE_TRAFFIC_OVERVIEW',
  ZoneAndTrafficChart: 'ZONE_AND_TRAFFIC_CHART',
  TotalZoneChart: 'TOTAL_ZONE_CHART',
  ZoneComparison: 'ZONE_COMPARISON',
  StoreTransaction: 'STORE_TRANSACTION',
  StoreTrafficTrendChart: 'STORE_TRAFFIC_TREND_CHART',
  ZoneTrafficTrendChart: 'ZONE_TRAFFIC_TREND_CHART',
  ExportStoreTrafficTrendChart: 'EXPORT_STORE_TRAFFIC_TREND_CHART',
  ExportZoneTrafficChart: 'EXPORT_ZONE_TRAFFIC_CHART',
  ExportStoreComparison: 'EXPORT_STORE_COMPARISON',
  ExportTransactionAndInteractionChart:
    'EXPORT_TRANSACTION_AND_INTERACTION_CHART',
  ExportZoneComparison: 'EXPORT_ZONE_COMPARISON',
};

const STALE_TIME = 5_000;
const REFRESH_INTERVAL = 30_000;

export const useSummaryTable = (params: ISummaryTableRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.SummaryTable, params],
    queryFn: () => analyticsService.getSummaryTable(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useTopStore = (params: ITopStoreRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.TopStore, params],
    queryFn: () => analyticsService.getTopStore(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useStoreComparison = (params: IStoreComparisonRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.StoreComparison, params],
    queryFn: () => analyticsService.getStoreComparison(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useZoneTrafficOverview = (params: IZoneTrafficOverviewRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ZoneTrafficOverview, params],
    queryFn: () => analyticsService.getZoneTrafficOverview(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useZoneAndTrafficChart = (params: IZoneAndTrafficChartRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ZoneAndTrafficChart, params],
    queryFn: () => analyticsService.getZoneAndTrafficChart(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useTotalZoneChart = (params: ITotalZoneChartRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.TotalZoneChart, params],
    queryFn: () => analyticsService.getTotalZoneChart(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useZoneComparison = (params: IZoneComparisonRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ZoneComparison, params],
    queryFn: () => analyticsService.getZoneComparison(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useStoreTransaction = (params: IStoreTransactionRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.StoreTransaction, params],
    queryFn: () => analyticsService.getStoreTransaction(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useStoreTrafficTrendChart = (
  params: IStoreTrafficTrendChartRequest
) => {
  return useQuery({
    queryKey: [CACHE_KEYS.StoreTrafficTrendChart, params],
    queryFn: () => analyticsService.getStoreTrafficTrendChart(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useZoneTrafficTrendChart = (
  params: IZoneTrafficTrendChartRequest
) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ZoneTrafficTrendChart, params],
    queryFn: () => analyticsService.getZoneTrafficTrendChart(params),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useExportStoreTrafficTrendChart = (
  params: IStoreTrafficTrendChartRequest
) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ExportStoreTrafficTrendChart, params],
    queryFn: () => analyticsService.exportStoreTrafficTrendChart(params),
    staleTime: STALE_TIME,
    enabled: false,
    select: (res) => res.data,
  });
};

export const useExportZoneTrafficTrendChart = (
  params: IZoneTrafficTrendChartRequest
) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ExportZoneTrafficChart, params],
    queryFn: () => analyticsService.exportZoneTrafficTrendChart(params),
    staleTime: STALE_TIME,
    enabled: false,
    select: (res) => res.data,
  });
};

export const useExportStoreComparison = (params: IStoreComparisonRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ExportStoreComparison],
    queryFn: () => analyticsService.exportStoreComparison(params),
    staleTime: STALE_TIME,
    enabled: false,
    select: (res) => res.data,
  });
};

export const useExportTransactionAndInteraction = (
  params: ITransactionAndInteractionChartRequest
) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ExportStoreComparison],
    queryFn: () => analyticsService.exportTransactionAndInteraction(params),
    staleTime: STALE_TIME,
    enabled: false,
    select: (res) => res.data,
  });
};

export const useExportZoneComparison = (params: IZoneComparisonRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ExportZoneComparison],
    queryFn: () => analyticsService.exportZoneComparison(params),
    staleTime: STALE_TIME,
    enabled: false,
    select: (res) => res.data,
  });
};

export const useExportZoneTrafficChart = (
  params: IZoneAndTrafficChartRequest
) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ExportZoneTrafficChart],
    queryFn: () => analyticsService.exportZoneTrafficChart(params),
    staleTime: STALE_TIME,
    enabled: false,
    select: (res) => res.data,
  });
};
