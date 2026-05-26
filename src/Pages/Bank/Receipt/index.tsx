import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, PAYMENT_TYPE_OPTIONS } from "../../../Data";
import type { AppGridColDef, PosPaymentBase } from "../../../Types";
import { CreateFilter, DateConfig, GenerateOptions } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { useAppSelector } from "../../../Store/hooks";
import { CommonDateRangeSelector } from "../../../Attribute";
import { useReactToPrint } from "react-to-print";
import Print from "../../../Components/ReportFormats/Print";

const Receipt = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const permission = usePagePermission(PAGE_TITLE.RECEIPT.BASE);
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });
  const [printData, setPrintData] = useState<PosPaymentBase | null>(null);

  const { data: contactData, isLoading: contactDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" });
  const { data, isLoading, isFetching } = Queries.useGetPosPayment({ ...params, voucherTypeFilter: "sales", startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetPosPayment({ voucherTypeFilter: "sales" }, false);
  const { mutate: deletePayment, isPending: isDeleteLoading } = Mutations.useDeletePosPayment();
  const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPosPayment();

  const rows = useMemo(() => data?.data?.posPayment_data.map((r) => ({ ...r, id: r?._id })) || [], [data]);

  const totalRows = data?.data?.totalData || 0;

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

  const handleAdd = () => navigate(ROUTES.RECEIPT.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deletePayment(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<PosPaymentBase>[] = [
    { field: "voucherType", headerName: "Receipt No", width: 200 },
    CommonObjectPropertyColumn<PosPaymentBase>("partyId", "partyId", ["firstName", "lastName"], { headerName: "Party Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<PosPaymentBase>("paymentMode", "paymentMode", [], { headerName: "Payment Mode", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<PosPaymentBase>("paymentType", "paymentType", [], { headerName: "Payment Type", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<PosPaymentBase>("date", "date", [], { headerName: "Payment Date", flex: 1, minWidth: 150, type: "date" }),
    { field: "amount", headerName: "Amount", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PosPaymentBase>("status", "status", [], { headerName: "Status", width: 150, type: "status" }),
    CommonObjectPropertyColumn<PosPaymentBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PosPaymentBase>({
            ...(permission?.edit && {
              active: (row) => editPayment({ posPaymentId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.RECEIPT.ADD_EDIT,
              onPrint: { handlePrint: (row) => setPrintData(row) },
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.voucherType }) }),
          }),
        ]
      : []),
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.RECEIPT.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };
  const filter = [
    CreateFilter("Select Payment Type", "paymentTypeFilter", advancedFilter, updateAdvancedFilter, PAYMENT_TYPE_OPTIONS, false, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select party", "partyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(contactData?.data), contactDataLoading, { xs: 12, sm: 6, md: 3 }),
  ];

  const children = (
    <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year" />
    </Grid>
  );
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.RECEIPT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.RECEIPT.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} children={children} />
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
      </Box>
      <div className="hidden">{<Print type="Receipt" ref={contentRef} bill={printData} />}</div>
    </>
  );
};

export default Receipt;
