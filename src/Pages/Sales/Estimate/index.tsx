import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, ESTIMATE_STATUS } from "../../../Data";
import type { AppGridColDef, EstimateBase } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";

const Estimate = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();

  const { data: estimate, isLoading: estimateLoading, isFetching: estimateFetching } = Queries.useGetEstimate(params);
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetEstimate({}, false);
  const { mutate: deleteEstimateMutate } = Mutations.useDeleteEstimate();
  const { mutate: editEstimate, isPending: isEditLoading } = Mutations.useEditEstimate();

  // Filter Data Queries
  const { data: customerData, isLoading: customerDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" });

  const allEstimate = useMemo(() => estimate?.data?.estimate_data?.map((estimate) => ({ ...estimate, id: estimate._id })) || [], [estimate]);
  const totalRows = estimate?.data?.totalData || 0;
  const summaryData = estimate?.data?.summary;

  const summary = useMemo(() => {
    return CalculateGridSummary(allEstimate, ["transactionSummary.netAmount", "transactionSummary.taxAmount"]);
  }, [allEstimate]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteEstimateMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.ESTIMATE.ADD_EDIT);

  const columns: AppGridColDef<EstimateBase>[] = [
    { field: "estimateNo", headerName: "Estimate No", flex: 1, minWidth: 120 },
    CommonObjectPropertyColumn<EstimateBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<EstimateBase>("date", "date", [], { headerName: "Estimate Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<EstimateBase>("dueDate", "dueDate", [], { headerName: "Due Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<EstimateBase>("transactionSummary.netAmount", "transactionSummary.netAmount", ["netAmount"], { headerName: "Amount", flex: 1, minWidth: 110, isSummary: true }),
    CommonObjectPropertyColumn<EstimateBase>("status", "status", [], { headerName: "Status", width: 150, type: "status" }),
    CommonObjectPropertyColumn<EstimateBase>("transactionSummary.taxAmount", "transactionSummary.taxAmount", ["taxAmount"], { headerName: "Tax Amount", flex: 1, minWidth: 110, isSummary: true }),
    CommonObjectPropertyColumn<EstimateBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    CommonActionColumn({
      active: (row) => editEstimate({ estimateId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.ESTIMATE.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];
  const CommonDataGridOption = {
    columns,
    rows: allEstimate,
    rowCount: totalRows,
    loading: estimateLoading || estimateFetching || isEditLoading,
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
    fileName: PAGE_TITLE.SALES.ESTIMATE.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const filter = [CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, ESTIMATE_STATUS, false, { xs: 12, sm: 6, md: 3 })];

  const stats = [
    { label: "All Orders", value: summaryData?.allEstimates || 0, color: "primary" },
    { label: "Pending", value: summaryData?.pending || 0, color: "success" },
    { label: "Order Created", value: summaryData?.orderCreated || 0, color: "error" },
    { label: "Invoice Created", value: summaryData?.invoiceCreated || 0, color: "info" },
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALES.ESTIMATE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ESTIMATE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, md: 3 }} />
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Estimate;
