import { Box, Grid } from "@mui/material";
import { type GridRenderCellParams } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, DATA_STATUS } from "../../../Data";
import type { AppGridColDef, StockVerificationBase } from "../../../Types";
import { CreateFilter, DateConfig } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { useAppSelector } from "../../../Store/hooks";
import { CommonDateRangeSelector } from "../../../Attribute";

const StockVerification = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, params, advancedFilter, updateAdvancedFilter } = useDataGrid({ active: false });

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE);
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });

  const { data: stockVerificationData, isLoading: stockVerificationDataLoading, isFetching: stockVerificationDataFetching } = Queries.useGetStockVerification({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetStockVerification({}, false);
  const { mutate: deleteStockVerificationMutate, isPending: isDeleteLoading } = Mutations.useDeleteStockVerification();

  const allStock = useMemo(() => stockVerificationData?.data?.stockVerification_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [stockVerificationData]);
  const totalRows = stockVerificationData?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.STOCK_VERIFICATION.ADD_EDIT);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteStockVerificationMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const columns: AppGridColDef<StockVerificationBase>[] = [
    { field: "stockVerificationNo", headerName: "Stock Verification No.", flex: 1, minWidth: 230 },
    CommonObjectPropertyColumn<StockVerificationBase>("createdAt", "createdAt", [], { headerName: "Stock Verification Date", width: 230, type: "date" }),
    { field: "totalProducts", headerName: "Total Products", width: 230, isSummary: true },
    { field: "totalPhysicalQty", headerName: "Total Physical Qty", width: 230, isSummary: true },
    { field: "totalDifferenceAmount", headerName: "Difference Amount", width: 230, isSummary: true },
    CommonObjectPropertyColumn<StockVerificationBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),
    CommonObjectPropertyColumn<StockVerificationBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 150, type: "status" }),
    ...(permission?.edit || permission?.delete
      ? [
          {
            ...CommonActionColumn<StockVerificationBase>({
              ...(permission?.edit && { editRoute: ROUTES.STOCK_VERIFICATION.ADD_EDIT }),
              ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row._id, title: row.stockVerificationNo }) }),
            }),
            renderCell: (params: GridRenderCellParams<StockVerificationBase>) =>
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

  const summary = useMemo(() => {
    return CalculateGridSummary(allStock, ["totalProducts", "totalPhysicalQty", "totalDifferenceAmount"]);
  }, [allStock]);

  const CommonDataGridOption = {
    columns,
    rows: allStock,
    rowCount: totalRows,
    loading: stockVerificationDataLoading || stockVerificationDataFetching,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
  };
  const filter = [CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, DATA_STATUS, false, { xs: 12, sm: 6, md: 3 })];
  const children = (
    <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year" />
    </Grid>
  );
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.STOCK_VERIFICATION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} children={children} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default StockVerification;
