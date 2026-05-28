import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, PAYMENT_STATUS_OPTIONS } from "../../../Data";
import type { AppGridColDef, SupplierBillBase } from "../../../Types";
import { CreateFilter, DateConfig, GenerateOptions } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { useAppSelector } from "../../../Store/hooks";
import { CommonDateRangeSelector } from "../../../Attribute";
import { useReactToPrint } from "react-to-print";
import Print from "../../../Components/ReportFormats/Print";

const SupplierBill = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter, params } = useDataGrid();

  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const permission = usePagePermission(PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE);
  // Filter Data Queries
  const { data: supplierData, isLoading: supplierDataLoading } = Queries.useGetContactDropdown({ typeFilter: "supplier" });
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });
  const [printData, setPrintData] = useState<SupplierBillBase | null>(null);

  const { data, isLoading, isFetching } = Queries.useGetSupplierBillDetails({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetSupplierBillDetails({}, false);
  const { mutate: deleteSupplierBill, isPending: deleteSupplierBillLoading } = Mutations.useDeleteSupplierBill();
  const { mutate: editSupplierBill } = Mutations.useEditSupplierBill();
  const summaryData = data?.data?.summary;

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: () => `${PAGE_TITLE.RECEIPT.BASE}_${new Date().toISOString().split("T")[0]}`,
    onBeforePrint: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPrintData(null);
    },
    onAfterPrint: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPrintData(null);
    },
    onPrintError: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPrintData(null);
    },
  });

  useEffect(() => {
    if (printData && contentRef.current) {
      handlePrint();
    }
  }, [printData, handlePrint]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteSupplierBill(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const rows = useMemo(() => {
    return data?.data?.supplierBill_data.map((r: SupplierBillBase) => ({ ...r, id: r?._id })) || [];
  }, [data]);
  const summary = useMemo(() => CalculateGridSummary(rows, ["summary.netAmount", "summary.taxAmount", "paidAmount", "balanceAmount"]), [rows]);

  const stats = [
    { label: "Total Expense", value: summaryData?.totalPurchase || 0 },
    { label: "Paid", value: summaryData?.paidAmount || 0 },
    { label: "Unpaid", value: summaryData?.unpaidAmount || 0 },
  ];

  const filter = [CreateFilter("Select Supplier", "supplierFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(supplierData?.data), supplierDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Payment Status", "paymentStatus", advancedFilter, updateAdvancedFilter, PAYMENT_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })];

  const columns: AppGridColDef<SupplierBillBase>[] = [
    CommonObjectPropertyColumn<SupplierBillBase>("paymentStatus", "paymentStatus", [], { headerName: "Status", flex: 1, minWidth: 110, type: "status" }),
    { field: "supplierBillNo", headerName: "Bill No", flex: 1, minWidth: 110 },
    CommonObjectPropertyColumn<SupplierBillBase>("supplierId", "supplierId", ["firstName", "lastName"], { headerName: "Supplier", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<SupplierBillBase>("supplierBillDate", "supplierBillDate", [], { headerName: "Bill Date", flex: 1, minWidth: 100, type: "date" }),

    CommonObjectPropertyColumn<SupplierBillBase>("summary.netAmount", "summary.netAmount", ["netAmount"], { headerName: "Bill Amount", flex: 1, minWidth: 100, isSummary: true }),

    { field: "paidAmount", headerName: "Paid Amount", flex: 1, minWidth: 130, isSummary: true },

    { field: "balanceAmount", headerName: "Due Amount", flex: 1, minWidth: 130, isSummary: true },

    CommonObjectPropertyColumn<SupplierBillBase>("summary.taxAmount", "summary.taxAmount", ["taxAmount"], { headerName: "Tax Amount", flex: 1, minWidth: 100, isSummary: true }),

    CommonObjectPropertyColumn<SupplierBillBase>("dueDate", "dueDate", [], { headerName: "Due Date", flex: 1, minWidth: 100, type: "date" }),

    { field: "notes", headerName: "Notes", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<SupplierBillBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<SupplierBillBase>({
            ...(permission?.edit && { active: (row) => editSupplierBill({ supplierBillId: row?._id, isActive: !row.isActive }), editRoute: ROUTES.SUPPLIER_BILL.ADD_EDIT }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.supplierBillNo }) }),
            onPrint: { handlePrint: (row) => setPrintData(row) },
          }),
        ]
      : []),
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: data?.data?.totalData || 0,
    loading: isLoading || isFetching,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd: () => navigate(ROUTES.SUPPLIER_BILL.ADD_EDIT) }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
    fileName: PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };
  const children = (
    <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year" />
    </Grid>
  );
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE} breadcrumbs={BREADCRUMBS.SUPPLIER_BILL.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, sm: 4 }} />
        <AdvancedSearch filter={filter} children={children} />
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} loading={deleteSupplierBillLoading} />
      </Box>
      <div className="hidden">{<Print type="Bill" ref={contentRef} bill={printData} />}</div>
    </>
  );
};
export default SupplierBill;
