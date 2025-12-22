import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";
import type { CommonDataGridProps } from "../../Types";

const CommonDataGrid = <T,>({ columns, rows, rowCount, loading = false, paginationModel, onPaginationModelChange, sortModel, onSortModelChange, filterModel, onFilterModelChange, pageSizeOptions = [10, 25, 50], defaultHidden = [], BoxClass }: CommonDataGridProps<T>) => {
  const visibilityModel = useMemo(() => {
    const model: Record<string, boolean> = {};

    defaultHidden.forEach((col) => {
      model[col] = false; // hide thi
    });

    return model;
  }, [defaultHidden]);

  console.log("all rows -> ", rows);
  const fixedColumns = columns.map((c) => ({
    ...c,
    // width: 150,
    // flex: undefined,
  }));

  return (
    <div className={`${BoxClass} min-w-full max-w-395 overflow-auto`}>
      <DataGrid
        rows={rows}
        rowCount={rowCount}
        loading={loading}
        columns={fixedColumns}
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
        paginationMode="server"
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

        keepNonExistentRowsSelected={false} //  IMPORTANT
      />
    </div>
  );
};

export default CommonDataGrid;
