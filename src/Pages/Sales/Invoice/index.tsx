import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, INVOICE_STATUS } from "../../../Data";
import type { AppGridColDef, InvoiceBase } from "../../../Types";
import { CreateFilter, DateConfig, GenerateOptions } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";
import { useAppSelector } from "../../../Store/hooks";
import { CommonDateRangeSelector } from "../../../Attribute";

const Invoice = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });

  const { data: invoice, isLoading: invoiceLoading, isFetching: invoiceFetching } = Queries.useGetInvoice({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetInvoice({}, false);
  const { mutate: deleteInvoiceMutate } = Mutations.useDeleteInvoice();
  const { mutate: editInvoice, isPending: isEditLoading } = Mutations.useEditInvoice();

  // Filter Data Queries
  const { data: customerData, isLoading: customerDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" });

  const allInvoice = useMemo(
    () =>
      invoice?.data?.invoice_data?.map((invoice) => ({
        ...invoice,
        id: invoice._id,
        dueAmount: Number(((invoice.transactionSummary?.netAmount || 0) - (invoice.paidAmount || 0)).toFixed(2)),
      })) || [],
    [invoice],
  );

  const totalRows = invoice?.data?.totalData || 0;
  const summaryData = invoice?.data?.summary;

  const summary = useMemo(() => CalculateGridSummary(allInvoice, ["transactionSummary.netAmount", "transactionSummary.taxAmount", "paidAmount", "dueAmount"]), [allInvoice]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteInvoiceMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.INVOICE.ADD_EDIT);

  const columns: AppGridColDef<InvoiceBase>[] = [
    { field: "invoiceNo", headerName: "Invoice No", flex: 1, minWidth: 120 },
    CommonObjectPropertyColumn<InvoiceBase>("date", "date", [], { headerName: "Invoice Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<InvoiceBase>("dueDate", "dueDate", [], { headerName: "Due Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<InvoiceBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<InvoiceBase>("transactionSummary.netAmount", "transactionSummary.netAmount", ["netAmount"], { headerName: "Net Amount", flex: 1, minWidth: 110, isSummary: true }),
    { field: "paidAmount", headerName: "Paid Amount", flex: 1, minWidth: 110, isSummary: true },
    { field: "dueAmount", headerName: "Due Amount", width: 110, isSummary: true },
    CommonObjectPropertyColumn<InvoiceBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 200, type: "status" }),
    CommonObjectPropertyColumn<InvoiceBase>("paymentStatus", "paymentStatus", [], { headerName: "Payment Status", flex: 1, minWidth: 100, type: "status" }),
    CommonObjectPropertyColumn<InvoiceBase>("transactionSummary.taxAmount", "transactionSummary.taxAmount", ["taxAmount"], { headerName: "Tax Amount", flex: 1, minWidth: 110, isSummary: true }),
    CommonObjectPropertyColumn<InvoiceBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),

    CommonActionColumn({
      active: (row) => editInvoice({ invoiceId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.INVOICE.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allInvoice,
    rowCount: totalRows,
    loading: invoiceLoading || invoiceFetching || isEditLoading,
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
    fileName: PAGE_TITLE.SALES.INVOICE.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const filter = [CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, INVOICE_STATUS, false, { xs: 12, sm: 6, md: 3 })];

  const children = (
    <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year" />
    </Grid>
  );

  const stats = [
    { label: "All", value: summaryData?.allInvoices || 0, color: "primary" },
    { label: "Invoiced", value: summaryData?.invoiced || 0, color: "primary" },
    { label: "Delivery Challan Created", value: summaryData?.deliveryChallanCreated || 0, color: "success" },
    { label: "Cancelled", value: summaryData?.cancelled || 0, color: "warning" },
    { label: "Total Sales", value: summaryData?.totalSales || 0, color: "warning" },
    { label: "Paid", value: summaryData?.paidAmount || 0, color: "warning" },
    { label: "UnPaid", value: summaryData?.unpaidAmount || 0, color: "warning" },
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALES.INVOICE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.INVOICE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, sm: 2, md: 2, xl: 1.7 }} />
        <AdvancedSearch filter={filter} children={children} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Invoice;
