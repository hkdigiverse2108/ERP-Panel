import { Box } from "@mui/material";
import { useMemo } from "react";
import { Queries } from "../../../Api";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef } from "../../../Types";
import type { StockBase } from "../../../Types/Stock";
import { useDataGrid } from "../../../Utils/Hooks";
import { useNavigate } from "react-router-dom";

const StockVerification = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params } = useDataGrid();

  const navigate = useNavigate();

  const { data: stockData, isLoading: stockDataLoading, isFetching: stockDataFetching } = Queries.useGetStock(params);

  const allStock = useMemo(() => stockData?.data?.stock_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [stockData]);
  const totalRows = stockData?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.STOCK_VERIFICATION.ADD_EDIT);

  const columns: AppGridColDef<StockBase>[] = [
    { field: "name", headerName: "Stock Verification No.", width: 300 },
    { field: "categoryId", headerName: "Stock verification Date", width: 150 },
    { field: "subCategoryId", headerName: "Total Products", width: 150 },
    { field: "subCategoryId", headerName: "Total Physical Qty", width: 150 },
    { field: "brandId", headerName: "Difference Amount", width: 150 },
    { field: "subBrandId", headerName: "Approved Qty", width: 150 },
    { field: "qty", headerName: "Created By", flex: 1, minWidth: 150 },
  ];

  const CommonDataGridOption = {
    columns,
    rows: allStock,
    rowCount: totalRows,
    loading: stockDataLoading || stockDataFetching,
    isActive,
    setActive,
    handleAdd,
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
