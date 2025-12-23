import type { IBasePagingRes } from 'src/models/common/models.type';

export type RowHighlightRule<T> = {
  match: (item: T, index: number) => boolean;
};

export interface ITableHeader<T> {
  field?: keyof T;
  title?: string;
  align?: 'left' | 'right' | 'center';
  format?: 'date' | 'number' | 'float' | 'percent' | 'seconds' | 'time';
  width?: number | 'auto';
  minWidth?: number | 'unset';
  className?: string;
  visible?: boolean;
  renderItem?: (item: T) => React.ReactNode;
}

export interface ITableData<T> {
  data: IBasePagingRes<T>;
  headersTable: ITableHeader<T>[];
  keyField?: string;
  showIndex?: boolean;
  type?: 'single' | 'multiple';
  disabledIds?: string[];
  onChangeSelectItems?: (value: string[]) => void;
  onChangePaging?: (
    field: 'page_size' | 'page',
    value: string | Date | number
  ) => void;
  callbackSelectAll?: (value: boolean) => Promise<string[]>;
  backgroundColor?: string;
  footer?: React.ReactNode;
  heightRow?: number;
  heightAuto?: boolean;
  placeholder?: string;
  rowHighlightConfig?: Record<string, RowHighlightRule<T>>;
}
