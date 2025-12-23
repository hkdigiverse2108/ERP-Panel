import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";
import type { CommonDataGridProps } from "../../Types";

const CommonDataGrid = <T,>({ columns, rows, rowCount, loading = false, paginationModel, onPaginationModelChange, sortModel, onSortModelChange, filterModel, onFilterModelChange, defaultHidden = [], BoxClass }: CommonDataGridProps<T>) => {
  const visibilityModel = useMemo(() => {
    const model: Record<string, boolean> = {};

    defaultHidden.forEach((col) => {
      model[col] = false; // hide thi
    });

    return model;
  }, [defaultHidden]);

  const fixedColumns = columns.map((c) => ({
    ...c,
    // width: 150,
    // flex: undefined,
  }));

  fixedColumns.unshift({
    field: "srNo",
    headerName: "Sr No",
    width: 90,
    sortable: false,
    filterable: false,
    renderCell: (params) => paginationModel.page * paginationModel.pageSize + params.api.getRowIndexRelativeToVisibleRows(params?.id) + 1,
  });

  return (
    <div className={`${BoxClass} min-w-full max-w-395 overflow-auto`}>
      <DataGrid
        rows={rows}
        columns={fixedColumns}
        rowCount={rowCount}
        loading={loading}
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
        disableRowSelectionOnClick
        //Pagination
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 50, 100, { value: rowCount, label: "All" }]}
        ///Sorting
        sortingMode="client"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        //Filter
        filterMode="client"
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        keepNonExistentRowsSelected={false} //  IMPORTANT
      />
    </div>
  );
};

export default CommonDataGrid;
