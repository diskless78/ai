// Imports
import type { ETimeFilterType, ETrafficType } from '../common/models.enum';

// Main Response Interfaces
export interface IDataOverviewResponse {
  conversion_rate: IStatisticItem;
  dwell_time: IStatisticItem;
  entrance_rate: IStatisticItem;
  footfall: IStatisticItem;
  passby: IStatisticItem;
  peak_hours: IStatisticItem;
  total_traffic: IStatisticItem;
  transaction: IStatisticItem;
  current_start_date: string;
  current_end_date: string;
  compare_end_date: string;
  compare_start_date: string;
}

export interface ITrafficChartResponse {
  data: IStatisticItem[];
  max_index: number;
  current_start_date: string;
  current_end_date: string;
  compare_end_date: string;
  compare_start_date: string;
}

export interface IZoneTrafficChartResponse {
  data: IZoneTrafficChartItem[];
}

export interface ITransactionAndInteractionChartResponse {
  data: ITransactionAndInteractionChartItem[];
}

// Request Interfaces
export interface IDataOverviewRequest {
  group_id: string;
  time_filter_type: ETimeFilterType;
  start_date: string | null;
  end_date: string | null;
}

export interface ITrafficChartRequest extends IDataOverviewRequest {
  type: ETrafficType;
}

export interface IZoneTrafficChartRequest extends IDataOverviewRequest {
  type: string;
}

export type ITransactionAndInteractionChartRequest = IDataOverviewRequest;

// Shared Types
export interface IStatisticItem {
  compare_percent: number;
  compare_value: number;
  current_value: number;
  label: string;
  short_label?: string;
}

export interface IZoneTrafficChartItem {
  zone_id: string;
  zone_name: string;
  data: IStatisticItem;
}

export interface ITransactionAndInteractionChartItem {
  interaction: IStatisticItem;
  label: string;
  transaction: IStatisticItem;
}
