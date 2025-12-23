import { TableBody, TableRow, TableCell } from '@mui/material';
import BaseCheckbox from '../../check-box/check-box';
import type { ITableHeader } from './types';
import { formatCellValue } from './utils';

interface TableBodyContentProps<T> {
  data: T[];
  headers: ITableHeader<T>[];
  keyField: string;
  showIndex?: boolean;
  type?: 'single' | 'multiple';
  disabledIds?: string[];
  currentPage: number;
  pageSize: number;
  isItemSelected?: (id: string) => boolean;
  onSelectOne?: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => void;
}

export function BaseTableBody<T>({
  data,
  headers,
  keyField,
  showIndex,
  type,
  disabledIds = [],
  currentPage,
  pageSize,
  isItemSelected,
  onSelectOne,
}: TableBodyContentProps<T>) {
  return (
    <TableBody>
      {data.map((item: any, index) => {
        const itemId = item[keyField];
        const isSelected = isItemSelected ? isItemSelected(itemId) : false;
        const isDisabled = disabledIds.includes(itemId);
        const rowNumber = (currentPage - 1) * pageSize + (index + 1);

        return (
          <TableRow hover key={`${itemId}-${index}`}>
            {type === 'multiple' && (
              <TableCell padding='checkbox'>
                <BaseCheckbox
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={(event) =>
                    onSelectOne && onSelectOne(event, itemId)
                  }
                />
              </TableCell>
            )}

            {showIndex && <TableCell>{rowNumber}</TableCell>}

            {headers.map((field, key) => {
              const cellContent = formatCellValue(field, item);

              return (
                <TableCell
                  key={key}
                  className={field.className}
                  sx={{
                    textAlign: field.align,
                    minWidth: field.minWidth,
                    width: !field.minWidth ? field.width : undefined,
                  }}
                >
                  {cellContent}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
