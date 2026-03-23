import { Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { Queries } from "../../Api/Queries";
import { CommonDateRangeSelector } from "../../Attribute";
import type { AppGridColDef, TopExpensesBase } from "../../Types";
import { DateConfig } from "../../Utils";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonCard, CommonDataGrid } from "../Common";
import { useAppSelector } from "../../Store/hooks";

const TopExpenses = () => {
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });
  const queryParams = useMemo(() => ({ startDate: range.start.toISOString(), endDate: range.end.toISOString() }), [range]);
  const { data, isLoading, isFetching } = Queries.useGetDashboardTopExpenses(queryParams);

  const allRowData = useMemo(() => data?.data?.map((item, i) => ({ ...item, id: item?._id || i })) || [], [data]);
  const totalRows = data?.data?.length || 0;

  const { sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid();

  const columns: AppGridColDef<TopExpensesBase>[] = [
    { field: "accountName", headerName: "Expense Name", width: 250 },
    { field: "expenseCount", headerName: "Expense Count", width: 300 },
    { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 110, renderCell: (params) => `₹${params.row.totalAmount}` },
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
    fileName: "Top Expenses",
  };

  const topContent = (
    <Grid size={{ xs: 12, sm: 5, md: 4 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} />
    </Grid>
  );
  return (
    <CommonCard title="Top Expenses" topContent={topContent} grid={{ xs: 12, md: 6 }}>
      <CommonDataGrid {...CommonDataGridOption} />
    </CommonCard>
  );
};

export default TopExpenses;
