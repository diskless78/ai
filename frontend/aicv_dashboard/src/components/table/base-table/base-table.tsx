import * as React from 'react';
import { useMemo } from 'react';
import { Box, Paper, Table, TablePagination, useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import SizedBox from 'src/components/common/sized-box';
import TableEmpty from '../table-empty';
import type { ITableData } from './types';
import { createStyledBaseTable } from './styles';
import { useTableSelection } from './use-table-selection';
import { useTablePagination } from './use-table-pagination';
import { BaseTableHeader } from './table-header';
import { BaseTableBody } from './table-body';

export default function BaseTable<T>({
  data,
  headersTable,
  keyField = 'id',
  showIndex,
  type = 'single',
  disabledIds = [],
  onChangeSelectItems,
  onChangePaging,
  callbackSelectAll,
  footer,
  heightRow = 46,
  heightAuto,
  placeholder = 'No data to display yet',
  rowHighlightConfig,
}: ITableData<T>) {
  const theme = useTheme();

  // Filter visible headers
  const visibleHeaders = useMemo(
    () => headersTable.filter((h) => h.visible !== false),
    [headersTable]
  );

  // Create styled component
  const StyledBaseTable = useMemo(() => createStyledBaseTable<T>(), []);

  // Selection management
  const { selectedAll, handleSelectAll, handleSelectOne, isItemSelected } =
    useTableSelection({
      disabledIds,
      onChangeSelectItems,
      callbackSelectAll,
    });

  // Pagination management
  const { rowsPerPage, handleChangeRowsPerPage, handleChangePage } =
    useTablePagination({
      onChangePaging,
      initialRowsPerPage: 10,
    });

  // Calculate table dimensions
  const minHeightTable = heightRow * 5 + 46;
  const totalPage = Math.ceil((data?.total ?? 0) / (data?.page_size ?? 0));
  const hasData = data && data.items.length > 0;
  const showPagination = data && totalPage > 1;

  return (
    <StyledBaseTable
      component={Paper}
      ownerState={{
        heightRow,
        rowHighlightConfig,
        dataItems: data.items,
        keyField,
        disabledIds,
      }}
      sx={{ minHeight: heightAuto ? 'auto' : minHeightTable }}
    >
      <Box
        sx={{
          borderRadius: pxToRem(8),
          border: '1px solid',
          borderColor: theme.palette.neutral[20],
          minHeight: heightAuto ? 'auto' : minHeightTable,
        }}
      >
        <Table sx={{ minWidth: 650 }} size='small' aria-label='data table'>
          <BaseTableHeader
            headers={visibleHeaders}
            showIndex={showIndex}
            type={type}
            selectedAll={selectedAll}
            onSelectAll={handleSelectAll}
          />

          {hasData && (
            <BaseTableBody
              data={data.items}
              headers={visibleHeaders}
              keyField={keyField}
              showIndex={showIndex}
              type={type}
              disabledIds={disabledIds}
              currentPage={data.page}
              pageSize={data.page_size}
              isItemSelected={isItemSelected}
              onSelectOne={handleSelectOne}
            />
          )}
        </Table>

        {!hasData && <TableEmpty label={placeholder} />}
      </Box>

      {showPagination ? (
        <TablePagination
          component='div'
          count={data.total}
          page={(data?.page ?? 1) - 1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      ) : (
        <SizedBox height={16} />
      )}

      {footer}
    </StyledBaseTable>
  );
}
