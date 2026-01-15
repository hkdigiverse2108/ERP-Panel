import { Box } from "@mui/material";
import { useMemo } from "react";
import { Queries } from "../../../Api";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef } from "../../../Types";
import type { StockBase } from "../../../Types/Stock";
import { useDataGrid } from "../../../Utils/Hooks";

const StockVerification = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params } = useDataGrid();

  const { data: stockData, isLoading: stockDataLoading, isFetching: stockDataFetching } = Queries.useGetStock(params);

  const allStock = useMemo(() => stockData?.data?.stock_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [stockData]);
  const totalRows = stockData?.data?.totalData || 0;

  const columns: AppGridColDef<StockBase>[] = [
    { field: "name", headerName: "Product Name", width: 300 },
    { field: "categoryId", headerName: "Category Name", width: 150 },
    { field: "subCategoryId", headerName: "Sub Category Name", width: 150 },
    { field: "brandId", headerName: "Brand Name", width: 150 },
    { field: "subBrandId", headerName: "Sub Brand Name", width: 150 },
    { field: "qty", headerName: "Available Qty", flex: 1, minWidth: 150 },
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
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.STOCK_VERIFICATION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
    </>
  );
};

export default StockVerification;
