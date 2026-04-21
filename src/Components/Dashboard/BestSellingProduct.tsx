import { Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { Queries } from "../../Api/Queries";
import { CommonDateRangeSelector } from "../../Attribute";
import type { AppGridColDef, SellingProductsBase } from "../../Types";
import { DateConfig } from "../../Utils";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonCard, CommonDataGrid } from "../Common";
import { useAppSelector } from "../../Store/hooks";

const BestSellingProduct = () => {
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });
  const { branchFilter } = useAppSelector((state) => state.dashboard);
  const queryParams = useMemo(() => ({ startDate: range.start.toISOString(), endDate: range.end.toISOString(), branchFilter: branchFilter[0] }), [range, branchFilter]);
  const { data, isLoading, isFetching } = Queries.useGetDashboardBestSellingProducts(queryParams);

  const allRowData = useMemo(() => data?.data?.map((item) => ({ ...item, id: item?._id })) || [], [data]);
  const totalRows = data?.data?.length || 0;

  const { sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid();

  const columns: AppGridColDef<SellingProductsBase>[] = [
    { field: "productName", headerName: "Product Name", width: 170 },
    { field: "noOfBills", headerName: "No Of Bills", width: 100 },
    { field: "totalSalesQty", headerName: "Sales Qty", width: 100 },
    { field: "totalSalesValue", headerName: "Sales Amount", width: 110, renderCell: (params) => `₹${params.row.totalSalesValue}` },
    { field: "totalProfit", headerName: "Profit", width: 100, renderCell: (params) => `₹${params.row.totalProfit}` },
    { field: "salesPercentage", headerName: "Sales(%)", flex: 1, minWidth: 100 },
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
    fileName: "Best Selling Product",
  };

  const topContent = (
    <Grid size={{ xs: 12, sm: 5, md: 4 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} />
    </Grid>
  );
  return (
    <CommonCard title="Best Selling Product" topContent={topContent} grid={{ xs: 12, md: 6 }}>
      <CommonDataGrid {...CommonDataGridOption} />
    </CommonCard>
  );
};

export default BestSellingProduct;
