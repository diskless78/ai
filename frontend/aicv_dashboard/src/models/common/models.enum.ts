export enum Roles {
  // partner account
  Owner = 'Owner',
  Admin = 'Admin',
  Staff = 'Staff',
}

export enum ObjectStatus {
  Active = 'active',
  InActive = 'inactive',
}

export enum OrderDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum ELanguage {
  Vie = 'vi-VN',
  Eng = 'en-US',
}

export enum ETimeFilterType {
  Today = 'today',
  CurrentWeek = 'current_week',
  CurrentMonth = 'current_month',
  CurrentQuarter = 'current_quarter',
  CurrentYear = 'current_year',
  Custom = 'custom',
}

export enum ETrafficType {
  Footfall = 'footfall',
  Passby = 'passby',
  TotalTraffic = 'total_traffic',
}

export enum ETrendChartType {
  Weekly = 'weekly',
  Monthly = 'monthly',
  Quarter = 'quarter',
  Yearly = 'yearly',
}

export enum EGateShopType {
  Gate = 'gate',
  Shop = 'shop',
}
