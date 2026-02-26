import { useMemo } from "react";
import { Queries } from "../../Api/Queries";
import type { AppGridColDef, LoginLogBase } from "../../Types";
import { FormatDateTime } from "../../Utils";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonCard, CommonDataGrid } from "../Common";

const LoginLog = () => {
  const { data, isLoading, isFetching } = Queries.useGetDashboardLoginLog();

  const allRowData = useMemo(() => data?.data?.loginLog_data?.map((item) => ({ ...item, id: item?._id })) || [], [data]);
  const totalRows = data?.data?.loginLog_data?.length || 0;

  const { sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid();

  const columns: AppGridColDef<LoginLogBase>[] = [
    { field: "message", headerName: "Login Time", width: 300, renderCell: (params) => `${params.row.message} ${FormatDateTime(params.row.createdAt)}` },
    { field: "ipAddress", headerName: "IP Address", width: 100 },
    { field: "systemDetails", headerName: "System Details", flex: 1, minWidth: 150 },
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
    <CommonCard title="Login Log" grid={{ xs: 12, md: 6 }}>
      <CommonDataGrid {...CommonDataGridOption} />
    </CommonCard>
  );
};

export default LoginLog;
