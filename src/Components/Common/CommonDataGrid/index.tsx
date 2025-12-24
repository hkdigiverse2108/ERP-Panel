import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useMemo, type FC } from "react";
import CustomToolbar from "./CustomToolbar";
import type { CommonDataGridProps } from "../../../Types";

const CommonDataGrid: FC<CommonDataGridProps> = ({ columns, rows, rowCount, loading = false, paginationModel, onPaginationModelChange, sortModel, onSortModelChange, filterModel, onFilterModelChange, defaultHidden = [], BoxClass, handleAdd, isActive, setActive }) => {
  const apiRef = useGridApiRef();

  const visibilityModel = useMemo(() => {
    const model: Record<string, boolean> = {};
    defaultHidden.forEach((col) => (model[col] = false));
    return model;
  }, [defaultHidden]);

  const fixedColumns = useMemo(() => {
    return [
      {
        field: "srNo",
        headerName: "Sr No",
        width: 90,
        sortable: false,
        filterable: false,
        valueGetter: (_, row) => paginationModel.page * paginationModel.pageSize + rows.findIndex((r) => r.id === row.id) + 1,
      },
      ...columns,
    ];
  }, [columns, paginationModel, rows]);

  return (
    <div className={`${BoxClass} min-w-full overflow-auto`}>
      <DataGrid
        apiRef={apiRef}
        label="hyy"
        rows={rows}
        columns={fixedColumns}
        rowCount={rowCount}
        loading={loading}
        showToolbar
        slots={{
          toolbar: () => <CustomToolbar apiRef={apiRef} columns={fixedColumns} rows={rows} rowCount={rowCount} handleAdd={handleAdd} isActive={isActive} setActive={setActive} />,
        }}
        initialState={{
          columns: { columnVisibilityModel: visibilityModel },
        }}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        sortingMode="client"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        filterMode="client"
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default CommonDataGrid;
