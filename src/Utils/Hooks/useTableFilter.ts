import { useCallback, useEffect, useMemo, useState } from "react";
import type { Params, UseBasicTableFilterHelperOptions } from "../../Types";
import useDebounce from "./useDebounce";

const useBasicTableFilterHelper = ({ initialParams = {}, debounceDelay = 300, sortKey = "sortBy" }: UseBasicTableFilterHelperOptions = {}) => {
  // Pagination
  const [pageNumber, setPageNumber] = useState(initialParams.page ?? 1);
  const [pageSize, setPageSize] = useState(initialParams.limit ?? 10);

  // Search
  const [searchTerm, setSearchTerm] = useState(initialParams.search ?? "");
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Sorting (dynamic key)
  const [sortBy, setSortBy] = useState<string | null>(initialParams[sortKey] ?? null);

  // Final params to send to API
  const [params, setParams] = useState<Params>({
    page: pageNumber,
    limit: pageSize,
    search: searchTerm,
    ...initialParams,
  });

  /** -----------------------------
   * Sync debounced search → params
   * ----------------------------- */
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      page: 1,
    }));
    setPageNumber(1);
  }, [debouncedSearchTerm]);

  /** -----------------------------
   * Sync sorting → params
   * ----------------------------- */
  useEffect(() => {
    setParams((prev) => {
      const updated = { ...prev };

      if (sortBy) updated[sortKey] = sortBy;
      else delete updated[sortKey];

      return updated;
    });
  }, [sortBy, sortKey]);

  /** -----------------------------
   * Pagination handler
   * ----------------------------- */
  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPageNumber(newPage);
    setPageSize(newPageSize);

    setParams((prev) => ({
      ...prev,
      page: newPage,
      limit: newPageSize,
    }));
  }, []);

  /** -----------------------------
   * Search handler
   * ----------------------------- */
  const handleSetSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  /** -----------------------------
   * Sort handler
   * ----------------------------- */
  const handleSetSortBy = useCallback((value: string | null) => {
    setSortBy(value || null);
  }, []);

  /** -----------------------------
   * Return memoized values
   * ----------------------------- */
  return useMemo(
    () => ({
      pageNumber,
      pageSize,
      searchTerm,
      sortBy,
      params,

      // methods
      setParams,
      handleSetSearch,
      handleSetSortBy,
      handlePaginationChange,
    }),
    [pageNumber, pageSize, searchTerm, sortBy, params, handlePaginationChange]
  );
};

export default useBasicTableFilterHelper;
