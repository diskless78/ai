export interface IBaseModels {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface IBasePagingReq {
  page: number;
  page_size: number;
  keyword?: string;
  object_status?: string | null;
  limit?: number;
}

export interface IBasePagingRes<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  is_full: boolean;
}

export interface IValue {
  id: string;
  name: string;
  icon?: React.ReactNode;
  children?: IValue[];
}

export interface IKeyValue {
  key: string;
  value: number | null;
}

export interface IObjectValue {
  [field: string]: any;
}
