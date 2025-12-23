// Imports
import type {
  ETimeFilterType,
  ETrafficType,
  ETrendChartType,
} from '../common/models.enum';
import type {
  IDataOverviewRequest,
  IStatisticItem,
  ITrafficChartResponse,
} from '../data-overview';

// Main Response Interfaces
export interface ISummaryTableResponse {
  data: ISummaryTableItem[];
  max_index: number;
}

export interface ITopStoreResponse {
  chart_data: ITopStoreChartItem[];
  page_size: number;
  total_all_store: ITotalAllStore;
  current_start_date: string;
  current_end_date: string;
  compare_end_date: string;
  compare_start_date: string;
}

export interface IStoreComparisonResponse {
  data: IStoreComparisonItem[];
}

export interface IZoneTrafficOverviewResponse {
  data: IZoneTrafficOverviewData;
}

export type IZoneAndTrafficChartResponse = ITrafficChartResponse;

export interface ITotalZoneChartResponse {
  data: ITotalZoneChartItem[];
  labels: string[];
}

export interface IZoneComparisonResponse {
  data: IZoneComparisonItem[];
}

export interface IStoreTransactionResponse {
  data: IStoreTransactionItem[];
}

export interface ITrafficTrendChartResponse {
  data: IStatisticItem[];
}

// Request Interfaces
export type ISummaryTableRequest = IDataOverviewRequest;

export interface ITopStoreRequest {
  type: ETrafficType;
  time_filter_type: ETimeFilterType;
  page_size: number;
  start_date: string | null;
  end_date: string | null;
}

export interface IStoreComparisonRequest {
  group_ids: string[];
  time_filter_type: ETimeFilterType;
  start_date: string | null;
  end_date: string | null;
}

export type IZoneTrafficOverviewRequest = IDataOverviewRequest;

export interface IZoneAndTrafficChartRequest extends IDataOverviewRequest {
  zone_id: string;
}

export interface ITotalZoneChartRequest {
  time_filter_type: ETimeFilterType;
  start_date: string | null;
  end_date: string | null;
}

export interface IZoneComparisonRequest {
  type: string; //gate, shop
  time_filter_type: ETimeFilterType;
  group_ids: string[];
  start_date: string | null;
  end_date: string | null;
}

export type IStoreTransactionRequest = IDataOverviewRequest;

export interface IStoreTrafficTrendChartRequest {
  group_id: string;
  time_filter_type: ETrendChartType;
  type: ETrafficType;
}

export interface IZoneTrafficTrendChartRequest {
  zone_id: string;
  time_filter_type: ETrendChartType;
  type: ETrafficType;
}

// Shared Types
export interface ISummaryTableItem {
  conversion_rate: number;
  dwell_time: number;
  dwell_time_label: string;
  entrance_rate: number;
  footfall: number;
  passby: number;
  time_label: string;
  transaction: number;
  peak?: boolean;
  is_row_total?: boolean;
}

export interface ITopStoreChartItem extends IStatisticItem {
  group_id: string;
  group_name: string;
}

export interface ITotalAllStore {
  conversion_rate: IStatisticItem;
  dwell_time: IStatisticItem;
  entrance_rate: IStatisticItem;
  footfall: IStatisticItem;
  passby: IStatisticItem;
  peak_hours: IStatisticItem | null;
  total_traffic: IStatisticItem;
  transaction: IStatisticItem;
}

export interface IStoreComparisonItem {
  group_id: string;
  group_name: string;
  conversion_rate: IStatisticItem;
  dwell_time: IStatisticItem;
  entrance_rate: IStatisticItem;
  footfall: IStatisticItem;
  passby: IStatisticItem;
  peak_hours: IStatisticItem | null;
  total_traffic: IStatisticItem;
  transaction: IStatisticItem;
  is_row_total?: boolean;
}

export interface IZoneTrafficOverviewData {
  dwell_time: IStatisticItem;
  least_crowded_zone: IZoneTrafficOverviewItem;
  longest_zone_stay: IZoneTrafficOverviewItem;
  most_crowded_zone: IZoneTrafficOverviewItem;
  peak_dwell_hour: IZoneTrafficOverviewItem;
  shortest_zone_stay: IZoneTrafficOverviewItem;
}

export interface IZoneTrafficOverviewItem {
  data: IStatisticItem;
  zone_id: string;
  zone_name: string;
}

export interface ITotalZoneChartItem {
  zone_id: string;
  zone_name: string;
  values: IStatisticItem[];
}

export interface IZoneComparisonItem {
  compare_percent: number;
  compare_value: number;
  current_value: number;
  group_id: string;
  group_name: string;
  percent_in_group: number;
  zone_id: string;
  zone_name: string;
}

export interface IStoreTransactionItem {
  group_id: string;
  group_name: string;
  interaction: IStatisticItem;
  transaction: IStatisticItem;
  transaction_rate: IStatisticItem;
  transaction_time: IStatisticItem;
  waiting_time: IStatisticItem;
}
