import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, SALES_CREDIT_NOTE_STATUS_OPTIONS } from "../../../Data";
import type { AppGridColDef, SalesCreditNoteBase } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";
import { useAppSelector } from "../../../Store/hooks";
import { useState } from "react";
import { DateConfig } from "../../../Utils";
import { CommonDateRangeSelector } from "../../../Attribute";

const SalesCreditNote = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });

  const { data: salesCreditNote, isLoading: salesCreditNoteLoading, isFetching: salesCreditNoteFetching } = Queries.useGetSalesCreditNote({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetSalesCreditNote({}, false);
  const { mutate: deleteSalesCreditNoteMutate } = Mutations.useDeleteSalesCreditNote();
  const { mutate: editSalesCreditNote, isPending: isEditLoading } = Mutations.useEditSalesCreditNote();

  // Filter Data Queries
  const { data: customerData, isLoading: customerDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" });

  const allSalesCreditNote = useMemo(() => salesCreditNote?.data?.salesCreditNote_data?.map((item) => ({ ...item, id: item._id })) || [], [salesCreditNote]);

  const totalRows = salesCreditNote?.data?.totalData || 0;

  const summary = useMemo(() => CalculateGridSummary(allSalesCreditNote, ["summary.netAmount", "summary.taxAmount", "creditUsed", "creditRemaining"]), [allSalesCreditNote]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteSalesCreditNoteMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.SALES_CREDIT_NOTE.ADD_EDIT);

  const columns: AppGridColDef<SalesCreditNoteBase>[] = [
    { field: "creditNoteNo", headerName: "Credit Note No.", flex: 1, minWidth: 150 },

    CommonObjectPropertyColumn<SalesCreditNoteBase>("creditNoteDate", "creditNoteDate", [], { headerName: "Credit Note Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<SalesCreditNoteBase>("dueDate", "dueDate", [], { headerName: "Due Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<SalesCreditNoteBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<SalesCreditNoteBase>("summary.netAmount", "summary.netAmount", ["netAmount"], { headerName: "Net Amount", flex: 1, minWidth: 120, isSummary: true }),
    CommonObjectPropertyColumn<SalesCreditNoteBase>("summary.taxAmount", "summary.taxAmount", ["taxAmount"], { headerName: "Tax Amount", flex: 1, minWidth: 120, isSummary: true }),
    CommonObjectPropertyColumn<SalesCreditNoteBase>("creditUsed", "creditUsed", ["creditUsed"], { headerName: "Credit Used", flex: 1, minWidth: 120, isSummary: true }),
    CommonObjectPropertyColumn<SalesCreditNoteBase>("creditRemaining", "creditRemaining", ["creditRemaining"], { headerName: "Credit Remaining", flex: 1, minWidth: 150, isSummary: true }),
    CommonObjectPropertyColumn<SalesCreditNoteBase>("status", "status", [], { headerName: "Status", width: 150, type: "status" }),
    CommonObjectPropertyColumn<SalesCreditNoteBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),

    CommonActionColumn({
      active: (row) => editSalesCreditNote({ salesCreditNoteId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.SALES_CREDIT_NOTE.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allSalesCreditNote,
    rowCount: totalRows,
    loading: salesCreditNoteLoading || salesCreditNoteFetching || isEditLoading,
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
    fileName: PAGE_TITLE.SALES.SALES_CREDIT_NOTE.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const filter = [CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, SALES_CREDIT_NOTE_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })];

  const children = (
    <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year" />
    </Grid>
  );

  const stats = [{ label: "All", value: salesCreditNote?.data?.totalData || 0, color: "primary" }];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALES.SALES_CREDIT_NOTE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SALES_CREDIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 12 }} />
        <AdvancedSearch filter={filter} children={children} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default SalesCreditNote;
