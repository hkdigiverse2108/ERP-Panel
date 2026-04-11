import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { Queries } from "../../../Api";
import { AdvancedSearch, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, StockBase } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import { CreateFilter, DateConfig, GenerateOptions } from "../../../Utils";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { CommonDateRangeSelector } from "../../../Attribute";
import { useAppSelector } from "../../../Store/hooks";

const Stock = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });

  const { data: stockData, isLoading: stockDataLoading, isFetching: stockDataFetching } = Queries.useGetStock({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetStock({}, false);
  const { data: brandData, isLoading: brandDataLoading } = Queries.useGetBrandDropdown();
  const { data: categoryData, isLoading: categoryDataLoading } = Queries.useGetCategoryDropdown();

  const allStock = useMemo(() => stockData?.data?.stock_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [stockData]);
  const totalRows = stockData?.data?.totalData || 0;

  const columns: AppGridColDef<StockBase>[] = [
    { field: "name", headerName: "Product Name", width: 320 }, //
    CommonObjectNameColumn("categoryId", { headerName: "Category Name", width: 230 }),
    CommonObjectNameColumn("subCategoryId", { headerName: "Sub Category Name", width: 230 }),
    CommonObjectNameColumn("brandId", { headerName: "Brand Name", width: 230 }),
    CommonObjectNameColumn("subBrandId", { headerName: "Sub Brand Name", width: 230 }),
    { field: "availableQty", headerName: "Available Qty", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<StockBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allStock,
    rowCount: totalRows,
    loading: stockDataLoading || stockDataFetching,
    isActive,
    setActive,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.INVENTORY.STOCK.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };
  const filter = [
    CreateFilter("Select Brand", "brandFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(brandData?.data), brandDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Sub Brand", "subBrandFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(brandData?.data), brandDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Category", "categoryFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(categoryData?.data), categoryDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Sub Category", "subCategoryFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(categoryData?.data), categoryDataLoading, { xs: 12, sm: 6, md: 3 }), //
  ];
  const children = (
    <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year" />
    </Grid>
  );
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.STOCK.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} children={children} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
    </>
  );
};

export default Stock;
