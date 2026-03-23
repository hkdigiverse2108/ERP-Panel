import { useMemo, useState } from "react";
import { Queries } from "../../Api/Queries";
import type { AppGridColDef, ReceivableBase } from "../../Types";
import { DateConfig } from "../../Utils";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonCard, CommonDataGrid } from "../Common";

const TodayReceivable = () => {
  const [range] = useState({ start: DateConfig.utc().startOf("day"), end: DateConfig.utc().endOf("day") });
  const queryParams = useMemo(() => ({ startDate: range.start.toISOString(), endDate: range.end.toISOString() }), [range]);
  const { data, isLoading, isFetching } = Queries.useGetDashboardReceivable(queryParams);

  const allRowData = useMemo(() => data?.data?.map((item) => ({ ...item, id: item?._id })) || [], [data]);
  const totalRows = data?.data?.length || 0;

  const { sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid();

  const columns: AppGridColDef<ReceivableBase>[] = [
    { field: "customerName", headerName: "Customer Name", width: 200 },
    { field: "invoiceNo", headerName: "Invoice No", width: 200 },
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
    fileName: "Today's Receivable",
  };

  return (
    <CommonCard title="Today's Receivable" grid={{ xs: 12, md: 6 }}>
      <CommonDataGrid {...CommonDataGridOption} />
    </CommonCard>
  );
};

export default TodayReceivable;
