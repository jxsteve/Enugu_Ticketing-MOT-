import { useState, useMemo } from 'react';

export function usePagination(initialPage: number = 1, initialPageSize: number = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    offset,
  };
}
