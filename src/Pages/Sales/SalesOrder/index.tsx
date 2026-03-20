import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, EstimateBase } from "../../../Types";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, SALES_ORDER_STATUS_OPTIONS } from "../../../Data";
import { Box } from "@mui/material";
import { useDataGrid } from "../../../Utils/Hooks";

const SalesOrder = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();

  const { data: salesOrder, isLoading: salesOrderLoading, isFetching: salesOrderFetching } = Queries.useGetSalesOrder(params);
  const { mutate: deleteSalesOrderMutate } = Mutations.useDeleteSalesOrder();
  const { mutate: editSalesOrder, isPending: isEditLoading } = Mutations.useEditSalesOrder();

  // Filter Data Queries
  const { data: customerData, isLoading: customerDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" });

  const allSalesOrder = useMemo(() => salesOrder?.data?.salesOrder_data?.map((salesOrder) => ({ ...salesOrder, id: salesOrder._id, netAmount: salesOrder.transactionSummary?.netAmount || 0, taxAmount: salesOrder.transactionSummary?.taxAmount || 0 })) || [], [salesOrder]);
  const totalRows = salesOrder?.data?.totalData || 0;
  const summaryData = salesOrder?.data?.summary;

  const summary = useMemo(() => {
    return CalculateGridSummary(allSalesOrder, ["netAmount", "taxAmount"]);
  }, [allSalesOrder]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteSalesOrderMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.SALES_ORDER.ADD_EDIT);

  const columns: AppGridColDef<EstimateBase>[] = [
    { field: "salesOrderNo", headerName: "Sales Order No", flex: 1, minWidth: 150 },
    { field: "date", headerName: "Sales Order Date", flex: 1, minWidth: 150, renderCell: (params) => FormatDate(params.row.date) },
    { field: "dueDate", headerName: "Due Date", flex: 1, minWidth: 150, renderCell: (params) => FormatDate(params.row.dueDate) },
    { field: "customerId", headerName: "Customer Name", flex: 1, minWidth: 150, valueGetter: (_, row: EstimateBase) => (row?.customerId ? `${row.customerId.firstName || ""} ${row.customerId.lastName || ""}`.trim() || "" : "") },
    { field: "netAmount", headerName: "Amount", flex: 1, minWidth: 110, type: "number" },
    { field: "status", headerName: "Status", headerAlign: "center", flex: 1, minWidth: 190, renderCell: (params) => <span className={`status-${params.row.status} overflow-hidden`}>{params.row.status}</span> },
    { field: "taxAmount", headerName: "Tax Amount", flex: 1, minWidth: 110 },
    CommonActionColumn({
      active: (row) => editSalesOrder({ salesOrderId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.SALES_ORDER.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allSalesOrder,
    rowCount: totalRows,
    loading: salesOrderLoading || salesOrderFetching || isEditLoading,
    isActive,
    setActive,
    handleAdd,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
  };

  const filter = [CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, SALES_ORDER_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })];

  const stats = [
    { label: "All", value: summaryData?.allSalesOrders || 0, color: "primary" },
    { label: "Pending", value: summaryData?.pending || 0, color: "success" },
    { label: "Invoice Created", value: summaryData?.invoiceCreated || 0, color: "error" },
    { label: "Delivery Challan Created", value: summaryData?.deliveryChallanCreated || 0, color: "info" },
    { label: "Cancelled", value: summaryData?.cancelled || 0, color: "error" },
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALES.SALES_ORDER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SALES_ORDER.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, sm: 2, xl: 2.3 }} />
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default SalesOrder;
