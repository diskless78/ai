import { TableCell, TableHead, TableRow } from '@mui/material';
import BaseCheckbox from '../../check-box/check-box';
import type { ITableHeader } from './types';

interface TableHeaderProps<T> {
  headers: ITableHeader<T>[];
  showIndex?: boolean;
  type?: 'single' | 'multiple';
  selectedAll?: boolean;
  onSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BaseTableHeader<T>({
  headers,
  showIndex,
  type,
  selectedAll,
  onSelectAll,
}: TableHeaderProps<T>) {
  return (
    <TableHead>
      <TableRow>
        {type === 'multiple' && (
          <TableCell padding='checkbox'>
            <BaseCheckbox checked={selectedAll} onChange={onSelectAll} />
          </TableCell>
        )}

        {showIndex && (
          <TableCell key='index' align='left' width={70}>
            #
          </TableCell>
        )}

        {headers.map((item, key) => (
          <TableCell
            key={key}
            className={item.className}
            sx={{
              textAlign: item.align,
              minWidth: item.minWidth,
              width: !item.minWidth ? item.width : undefined,
            }}
          >
            {item.title || ''}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
