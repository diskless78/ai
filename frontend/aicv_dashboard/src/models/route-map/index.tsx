import type { ETimeFilterType } from '../common/models.enum';

export interface IRouteMapRequest {
  camera_id: string;
  time_filter_type: ETimeFilterType;
  start_date: string | null;
  end_date: string | null;
}

export interface IRouteMapResponse {
  data: IRouteMapItem;
}

export interface IRouteMapItem {
  image: string;
  name: string;
  percentage: PercentageItem[];
  routes: RouteItem[];
}

export interface PercentageItem {
  fill: string;
  text: string;
  totalPeople: number;
  x: number;
  y: number;
}

export interface RouteItem {
  active: boolean;
  color: string;
  end: number[];
  id: string;
  mid: number[];
  name: string;
  start: number[];
  value: number;
}
