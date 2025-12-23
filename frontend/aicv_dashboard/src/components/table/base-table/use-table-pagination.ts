import { useState, useCallback } from 'react';

interface UseTablePaginationProps {
  onChangePaging?: (
    field: 'page_size' | 'page',
    value: string | Date | number
  ) => void;
  initialRowsPerPage?: number;
}

interface UseTablePaginationReturn {
  rowsPerPage: number;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
}

export function useTablePagination({
  onChangePaging,
  initialRowsPerPage = 10,
}: UseTablePaginationProps): UseTablePaginationReturn {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const pageSize = parseInt(event.target.value, 10);
      setRowsPerPage(pageSize);
      onChangePaging && onChangePaging('page', 1);
      onChangePaging && onChangePaging('page_size', pageSize);
    },
    [onChangePaging]
  );

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      onChangePaging && onChangePaging('page', newPage + 1);
    },
    [onChangePaging]
  );

  return {
    rowsPerPage,
    handleChangeRowsPerPage,
    handleChangePage,
  };
}
