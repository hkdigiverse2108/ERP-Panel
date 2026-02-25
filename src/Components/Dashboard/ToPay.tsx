import { useMemo } from "react";
import { Queries } from "../../Api/Queries";
import type { AppGridColDef, PayableBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonCard, CommonDataGrid } from "../Common";
import { FormatDateTime } from "../../Utils";

const ToPay = () => {
  const { data, isLoading, isFetching } = Queries.useGetDashboardPayable();

  const allRowData = useMemo(() => data?.data?.map((item) => ({ ...item, id: item?._id })) || [], [data]);
  const totalRows = data?.data?.length || 0;

  const { sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid();

  const columns: AppGridColDef<PayableBase>[] = [
    { field: "supplierName", headerName: "Supplier Name", width: 200 },
    { field: "date", headerName: "Date", width: 200, renderCell: (params) => FormatDateTime(params.row.date) },
    { field: "billNo", headerName: "Bill No", width: 150 },
    { field: "pendingAmount", headerName: "Pending Amount", flex: 1, minWidth: 110, renderCell: (params) => `₹${params.row.pendingAmount}` },
  ];

  const CommonDataGridOption = {
    columns,
    BoxClass: "h-100 p-3 rounded-md overflow-hidden",
    rows: allRowData,
    rowCount: totalRows,
    loading: isLoading || isFetching,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    pagination: false,
    isToolbar: false,
    isExport: false,
  };

  return (
    <CommonCard title="To Pay" grid={{ xs: 12, md: 6 }}>
      <CommonDataGrid {...CommonDataGridOption} />
    </CommonCard>
  );
};

export default ToPay;
