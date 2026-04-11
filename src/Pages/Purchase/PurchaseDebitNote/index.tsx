import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, PURCHASE_DEBIT_NOTE_STATUS_OPTIONS } from "../../../Data";
import type { AppGridColDef, PurchaseDebitNoteBase } from "../../../Types";
import { CreateFilter, DateConfig, GenerateOptions } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { useAppSelector } from "../../../Store/hooks";
import { CommonDateRangeSelector } from "../../../Attribute";

const PurchaseDebitNote = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.PURCHASE.PURCHASE_DEBIT_NOTE.BASE);
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });

  const { data: purchaseDebitNote, isLoading, isFetching } = Queries.useGetPurchaseDebitNote({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetPurchaseDebitNote({}, false);
  const { mutate: editPurchaseDebitNote, isPending: isEditLoading } = Mutations.useEditPurchaseDebitNote();
  const { mutate: deletePurchaseDebitNote, isPending: deletePurchaseDebitNoteLoading } = Mutations.useDeletePurchaseDebitNote();

  // Filter Data Queries
  const { data: supplierData, isLoading: supplierDataLoading } = Queries.useGetContactDropdown({ typeFilter: "supplier" });

  const allRows = useMemo(() => purchaseDebitNote?.data?.purchaseDebitNote_data?.map((item) => ({ ...item, id: item._id })) || [], [purchaseDebitNote]);

  const totalRows = purchaseDebitNote?.data?.totalData || 0;

  const summary = useMemo(() => CalculateGridSummary(allRows, ["summary.netAmount", "summary.taxAmount"]), [allRows]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePurchaseDebitNote(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const columns: AppGridColDef<PurchaseDebitNoteBase>[] = [
    { field: "debitNoteNo", headerName: "Debit Note No", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PurchaseDebitNoteBase>("status", "status", [], { headerName: "Status", width: 110, type: "status" }),
    CommonObjectPropertyColumn<PurchaseDebitNoteBase>("supplierId", "supplierId", ["firstName", "lastName"], { headerName: "Supplier", flex: 1, minWidth: 200 }),
    CommonObjectPropertyColumn<PurchaseDebitNoteBase>("debitNoteDate", "debitNoteDate", [], { headerName: "Debit Note Date", width: 150, type: "date" }),
    CommonObjectPropertyColumn<PurchaseDebitNoteBase>("summary.netAmount", "summary.netAmount", ["netAmount"], { headerName: "Debit Note Amount", flex: 1, minWidth: 150, isSummary: true }),
    CommonObjectPropertyColumn<PurchaseDebitNoteBase>("summary.taxAmount", "summary.taxAmount", ["taxAmount"], { headerName: "Tax Amount", flex: 1, minWidth: 120, isSummary: true }),
    { field: "notes", headerName: "Notes", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<PurchaseDebitNoteBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PurchaseDebitNoteBase>({
            ...(permission?.edit && { active: (row) => editPurchaseDebitNote({ purchaseDebitNoteId: row?._id, isActive: !row.isActive }), editRoute: ROUTES.PURCHASE_DEBIT_NOTE.ADD_EDIT }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.debitNoteNo }) }),
          }),
        ]
      : []),
    // CommonActionColumn({
    //   active: (row) => editPurchaseDebitNote({ purchaseDebitNoteId: row?._id, isActive: !row.isActive }),
    //   editRoute: ROUTES.PURCHASE_DEBIT_NOTE.ADD_EDIT,
    //   onDelete: (row) => setRowToDelete({ _id: row?._id }),
    // }),
  ];

  const filter = [CreateFilter("Select Supplier", "supplierFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(supplierData?.data), supplierDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, PURCHASE_DEBIT_NOTE_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })];

  // One state box for total amount specifically as requested
  const stats = [
    {
      label: "Total Amount",
      value: `${purchaseDebitNote?.data?.totalAmount || "0"}`,
      color: "secondary",
    },
  ];

  const children = (
    <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year" />
    </Grid>
  );

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE.PURCHASE_DEBIT_NOTE.BASE} breadcrumbs={BREADCRUMBS.PURCHASE_DEBIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 12 }} />

        <AdvancedSearch filter={filter} children={children} />

        <CommonCard hideDivider>
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <CommonDataGrid
              rows={allRows}
              columns={columns}
              rowCount={totalRows}
              loading={isLoading || isFetching || isEditLoading}
              handleAdd={() => navigate(ROUTES.PURCHASE_DEBIT_NOTE.ADD_EDIT)}
              isActive={isActive}
              setActive={setActive}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              filterModel={filterModel}
              onFilterModelChange={setFilterModel}
              slots={{
                bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
              }}
              fileName={PAGE_TITLE.PURCHASE.PURCHASE_DEBIT_NOTE.BASE}
              onExportAll={{ onExportAll: fetchAll, isFetching: AllLoading || AllFetching }}
            />
          </Box>
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName="Purchase Debit Note" onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} loading={deletePurchaseDebitNoteLoading} />
      </Box>
    </>
  );
};

export default PurchaseDebitNote;
