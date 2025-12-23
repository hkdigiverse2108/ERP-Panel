import type { GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import type { UseDataGridOptions } from "../../Types";
import { CleanParams } from "..";

export const useDataGrid = ({ page = 0, pageSize = 5, initialSort = [], initialFilter = { items: [] } }: UseDataGridOptions = {}) => {
  /* ---------------- Pagination ---------------- */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page,
    pageSize,
  });

  /* ---------------- Sorting ---------------- */
  const [sortModel, setSortModel] = useState<GridSortModel>(initialSort);

  /* ---------------- Filtering ---------------- */
  const [filterModel, setFilterModel] = useState<GridFilterModel>(initialFilter);

  /* ---------------- Delete ---------------- */
  const [rowToDelete, setRowToDelete] = useState<{ _id?: string; title?: string } | null>(null);

  /* ---------------- API Params ---------------- */
  const params = useMemo(() => {
    return CleanParams({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,

      // Quick search
      search: filterModel.quickFilterValues?.[0],
    });
  }, [paginationModel, filterModel]);

  /* ---------------- Reset ---------------- */
  const resetModels = useCallback(() => {
    setPaginationModel({ page, pageSize });
    setSortModel(initialSort);
    setFilterModel(initialFilter);
  }, [page, pageSize, initialSort, initialFilter]);

  return {
    paginationModel,
    setPaginationModel,

    sortModel,
    setSortModel,

    filterModel,
    setFilterModel,

    rowToDelete,
    setRowToDelete,

    params,
    resetModels,
  };
};
