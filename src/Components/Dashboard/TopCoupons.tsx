import { Grid } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Queries } from "../../Api/Queries";
import { CommonDateRangeSelector } from "../../Attribute";
import type { AppGridColDef, TopCouponsBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonCard, CommonDataGrid } from "../Common";

const TopCoupons = () => {
  const [range, setRange] = useState({ start: dayjs(), end: dayjs() });
  const { data, isLoading, isFetching } = Queries.useGetDashboardTopCoupons({ startDate: range.start, endDate: range.end });

  const allRowData = useMemo(() => data?.data?.map((item) => ({ ...item, id: item?._id })) || [], [data]);
  const totalRows = data?.data?.length || 0;

  const { sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid();

  const columns: AppGridColDef<TopCouponsBase>[] = [
    { field: "name", headerName: "Coupon Name", width: 200 },
    { field: "usageCount", headerName: "No. of Bills", width: 100 },
    { field: "uniqueCustomersCount", headerName: "Unique Customers Count", width: 200 },
    { field: "totalDiscountGiven", headerName: "Total Amount", flex: 1, minWidth: 110, renderCell: (params) => `₹${params.row.totalDiscountGiven}` },
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

  const topContent = (
    <Grid size={{ xs: 12, sm: 5, md: 4 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Month" />
    </Grid>
  );
  return (
    <CommonCard title="Top Coupons" topContent={topContent} grid={{ xs: 12, md: 6 }}>
      <CommonDataGrid {...CommonDataGridOption} />
    </CommonCard>
  );
};

export default TopCoupons;
