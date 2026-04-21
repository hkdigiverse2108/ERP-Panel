import { useMemo, useState } from "react";
import { Queries } from "../../Api/Queries";
import type { AppGridColDef, PayableBase } from "../../Types";
import { DateConfig } from "../../Utils";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonCard, CommonDataGrid } from "../Common";
import { useAppSelector } from "../../Store/hooks";

const TodayPayable = () => {
  const [range] = useState({ start: DateConfig.utc().startOf("day"), end: DateConfig.utc().endOf("day") });
  const { branchFilter } = useAppSelector((state) => state.dashboard);
  const queryParams = useMemo(() => ({ startDate: range.start.toISOString(), endDate: range.end.toISOString(), branchFilter: branchFilter[0] }), [range, branchFilter]);

  const { data, isLoading, isFetching } = Queries.useGetDashboardPayable(queryParams);

  const allRowData = useMemo(() => data?.data?.map((item) => ({ ...item, id: item?._id })) || [], [data]);
  const totalRows = data?.data?.length || 0;

  const { sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid();

  const columns: AppGridColDef<PayableBase>[] = [
    { field: "supplierName", headerName: "Supplier Name", width: 200 },
    { field: "billNo", headerName: "Bill No", width: 200 },
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
    fileName: "Today's Payable",
  };

  return (
    <CommonCard title="Today's Payable" grid={{ xs: 12, md: 6 }}>
      <CommonDataGrid {...CommonDataGridOption} />
    </CommonCard>
  );
};

export default TodayPayable;
