import type { GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import type { UseDataGridOptions } from "../../Types";

export const useDataGrid = ({ page = 0, pageSize = 10, initialSort = [], initialFilter = { items: [] } }: UseDataGridOptions = {}) => {
  // Pagination
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page,
    pageSize,
  });

  // Sorting
  const [sortModel, setSortModel] = useState<GridSortModel>(initialSort);

  // Filtering
  const [filterModel, setFilterModel] = useState<GridFilterModel>(initialFilter);

  // Combined reset
  const resetModels = useCallback(() => {
    setPaginationModel({ page, pageSize });
    setSortModel([]);
    setFilterModel({ items: [] });
  }, [pageSize]);

  return {
    paginationModel,
    setPaginationModel,

    sortModel,
    setSortModel,

    filterModel,
    setFilterModel,

    resetModels,
  };
};