import {
  EGateShopType,
  ETimeFilterType,
  ETrafficType,
  ETrendChartType,
} from 'src/models/common/models.enum';

export const SELECT_TIME_DATA = [
  {
    id: ETimeFilterType.Today,
    name: 'Today',
  },
  {
    id: ETimeFilterType.CurrentWeek,
    name: 'Current week',
  },
  {
    id: ETimeFilterType.CurrentMonth,
    name: 'Current month',
  },
  {
    id: ETimeFilterType.CurrentQuarter,
    name: 'Current quarter',
  },
  {
    id: ETimeFilterType.CurrentYear,
    name: 'Current year',
  },
];

export const SELECT_TREND_CHART = [
  {
    id: ETrendChartType.Weekly,
    name: 'Weekly',
  },
  {
    id: ETrendChartType.Monthly,
    name: 'Monthly',
  },
  {
    id: ETrendChartType.Quarter,
    name: 'Quarter',
  },
  {
    id: ETrendChartType.Yearly,
    name: 'Yearly',
  },
];

export const SELECT_STORE_DATA = [
  {
    id: '1',
    name: 'All stores',
  },
  {
    id: '2',
    name: 'Store A',
  },
  {
    id: '3',
    name: 'Store B',
  },
  {
    id: '4',
    name: 'Store C',
  },
];

export const SELECT_TOP_DATA = [
  {
    id: '10',
    name: 'Sort by: Top 10',
  },
  {
    id: '5',
    name: 'Sort by: Top 5',
  },
  {
    id: '3',
    name: 'Sort by: Top 3',
  },
];

export const SELECT_GATE_SHOP_DATA = [
  {
    id: EGateShopType.Gate,
    name: 'Traffic',
  },
  {
    id: EGateShopType.Shop,
    name: 'Dwell time',
  },
];

export const SELECT_TRAFFIC_DATA = [
  {
    id: ETrafficType.Footfall,
    name: 'Footfall',
  },
  {
    id: ETrafficType.Passby,
    name: 'Passby',
  },
  {
    id: ETrafficType.TotalTraffic,
    name: 'Total',
  },
];
