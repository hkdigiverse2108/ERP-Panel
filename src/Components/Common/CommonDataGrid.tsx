import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";
import type { CommonDataGridProps } from "../../Types";

const CommonDataGrid = <T,>({ columns, rows, rowCount, loading = false, paginationModel, onPaginationModelChange, sortModel, onSortModelChange, filterModel, onFilterModelChange, pageSizeOptions = [10, 25, 50], defaultHidden = [], BoxClass }: CommonDataGridProps<T>) => {
  const visibilityModel = useMemo(() => {
    const model: Record<string, boolean> = {};

    defaultHidden.forEach((col) => {
      model[col] = false; // hide this column
    });

    return model;
  }, [defaultHidden]);
  return (
    <div className={BoxClass}>
      <DataGrid
        rows={rows}
        rowCount={rowCount}
        loading={loading}
        columns={columns}
        showToolbar
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        initialState={{
          columns: {
            columnVisibilityModel: visibilityModel,
          },
        }}
        density="standard"
        //Pagination
        paginationMode="client"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        ///Sorting
        sortingMode="client"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        //Filter
        filterMode="client"
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        //
        disableRowSelectionOnClick
        pageSizeOptions={pageSizeOptions}
        // pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
      />
    </div>
  );
};

export default CommonDataGrid;
