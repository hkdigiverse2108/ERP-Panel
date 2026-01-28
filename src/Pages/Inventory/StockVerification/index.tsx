import { Box } from "@mui/material";
import { GridFooterContainer, useGridApiContext, type GridRenderCellParams } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, StockVerificationBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { FormatDate } from "../../../Utils";

const StockVerification = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE);

  const { data: stockVerificationData, isLoading: stockVerificationDataLoading, isFetching: stockVerificationDataFetching } = Queries.useGetStockVerification(params);
  const { mutate: deleteStockVerificationMutate } = Mutations.useDeleteStockVerification();

  const allStock = useMemo(() => stockVerificationData?.data?.stockVerification_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [stockVerificationData]);
  const totalRows = stockVerificationData?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.STOCK_VERIFICATION.ADD_EDIT);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteStockVerificationMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const columns: AppGridColDef<StockVerificationBase>[] = [
    { field: "stockVerificationNo", headerName: "Stock Verification No.",flex:1, minWidth: 200 },
    { field: "createdAt", headerName: "Stock Verification Date", flex:1, minWidth: 200, renderCell: (params) => FormatDate(params.row.createdAt) },
    { field: "totalProducts", headerName: "Total Products", width: 200 },
    { field: "totalPhysicalQty", headerName: "Total Physical Qty", width: 200 },
    { field: "totalDifferenceAmount", headerName: "Difference Amount", width: 200 },
    { field: "totalApprovedQty", headerName: "Approved Qty", width: 200 },
    { field: "status", headerName: "Status",headerAlign: "center", width: 110, renderCell: (params) => <span className={`status-${params.row.status}`}>{params.row.status}</span> },
    ...(permission?.edit || permission?.delete
      ? [
          {
            ...CommonActionColumn<StockVerificationBase>({
              ...(permission?.edit && { editRoute: ROUTES.STOCK_VERIFICATION.ADD_EDIT }),
              ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row._id, title: row.stockVerificationNo }) }),
            }),
            renderCell: (params: GridRenderCellParams<any, StockVerificationBase>) =>
              params.row.status === "pending"
                ? CommonActionColumn<StockVerificationBase>({
                    ...(permission?.edit && { editRoute: ROUTES.STOCK_VERIFICATION.ADD_EDIT }),
                    ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row._id, title: row.stockVerificationNo }) }),
                  }).renderCell?.(params)
                : "-",
          },
        ]
      : []),
  ];

  const StockVerificationFooter = ({ summary }: any) => {
    const apiRef = useGridApiContext();

    const visibleColumns = apiRef.current.getVisibleColumns();

    return (
      <GridFooterContainer sx={{ overflowX: "auto", px: 0, width: "fit-content" }}>
        <Box sx={{ display: "flex", minWidth: "max-content" }}>
          {visibleColumns.map((col) => {
            let value = "";

            if (col.field === "totalProducts") value = summary.totalProducts;
            if (col.field === "totalPhysicalQty") value = summary.totalPhysicalQty;
            if (col.field === "totalDifferenceAmount") value = summary.totalDifferenceAmount.toFixed(2);
            if (col.field === "totalApprovedQty") value = summary.totalApprovedQty;

            return (
              <Box key={col.field} sx={{ flex: `0 0 ${col.computedWidth}px`, px: 1, py: 1, fontWeight: 600, whiteSpace: "nowrap", textAlign: "left" }}>
                {value}
              </Box>
            );
          })}
        </Box>
      </GridFooterContainer>
    );
  };

  const summary = useMemo(() => {
    return allStock.reduce(
      (acc, row) => {
        acc.totalProducts += Number(row.totalProducts || 0);
        acc.totalPhysicalQty += Number(row.totalPhysicalQty || 0);
        acc.totalDifferenceAmount += Number(row.totalDifferenceAmount || 0);
        acc.totalApprovedQty += Number(row.totalApprovedQty || 0);
        return acc;
      },
      { totalProducts: 0, totalPhysicalQty: 0, totalDifferenceAmount: 0, totalApprovedQty: 0 },
    );
  }, [allStock]);

  const CommonDataGridOption = {
    columns,
    rows: allStock,
    rowCount: totalRows,
    loading: stockVerificationDataLoading || stockVerificationDataFetching,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    slots: {
      bottomContainer: () => <StockVerificationFooter summary={summary} />,
    },
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.STOCK_VERIFICATION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default StockVerification;
