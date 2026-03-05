import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonActionColumn, CommonDeleteModal, AdvancedSearch, CommonStatsCard } from "../../../Components/Common";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { Queries, Mutations } from "../../../Api";
import type { AppGridColDef, SupplierBillBase } from "../../../Types";
import { CreateFilter, FormatDate } from "../../../Utils";
import { BREADCRUMBS, PAYMENT_STATUS_OPTIONS } from "../../../Data";

const SupplierBill = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE);
  const { data, isLoading, isFetching } = Queries.useGetSupplierBillDetails(params);
  const { mutate: deleteSupplierBill, isPending: isDeleteLoading } = Mutations.useDeleteSupplierBill();
  const { mutate: editSupplierBill, isPending: isEditLoading } = Mutations.useEditSupplierBill();
  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteSupplierBill(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const rows: SupplierBillBase[] = data?.data?.supplierBill_data?.map((bill) => ({ ...bill, id: bill._id })) || [];
  const stats = useMemo(() => {
    const total = rows.length;
    const paid = rows.filter((r) => r.paymentStatus === "paid").length;
    const unpaid = rows.filter((r) => r.paymentStatus === "unpaid").length;
    return [
      { label: "Total Purchase", value: total },
      { label: "Paid", value: paid },
      { label: "Unpaid", value: unpaid },
    ];
  }, [rows]);

  const filter = [CreateFilter("Payment Status", "paymentStatus", advancedFilter, updateAdvancedFilter, PAYMENT_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })];

  const columns: AppGridColDef<SupplierBillBase>[] = [
    { field: "paymentStatus", headerName: "Status", headerAlign: "center", width: 110, renderCell: (params) => <span className={`status-${params.row.paymentStatus}`}>{params.row.paymentStatus}</span> },

    { field: "supplierBillNo", headerName: "Bill No", width: 160 },

    { field: "supplierId", headerName: "Supplier", width: 240, valueGetter: (_, row) => (row?.supplierId ? `${row.supplierId.firstName ?? ""} ${row.supplierId.lastName ?? ""}` : "") },

    { field: "supplierBillDate", headerName: "Bill Date", width: 140, valueGetter: (_, row) => FormatDate(row?.supplierBillDate) },

    { field: "billAmount", headerName: "Bill Amount", width: 150, valueGetter: (_, row) => row?.summary?.netAmount ?? Number(row?.invoiceAmount ?? 0) },

    { field: "paidAmount", headerName: "Paid Amount", width: 140, valueGetter: (_, row) => Number(row?.paidAmount ?? 0) },

    { field: "balanceAmount", headerName: "Due Amount", width: 140, valueGetter: (_, row) => Number(row?.balanceAmount ?? 0) },

    { field: "taxAmount", headerName: "Tax Amount", width: 140, valueGetter: (_, row) => Number(row?.summary?.taxAmount ?? 0) + Number(row?.summary?.additionalChargeTax ?? 0) },

    { field: "dueDate", headerName: "Due Date", width: 140, valueGetter: (_, row) => FormatDate(row?.dueDate) },

    { field: "notes", headerName: "Notes", width: 280 },

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<SupplierBillBase>({
            ...(permission?.edit && { active: (row) => editSupplierBill({ supplierBillId: row?._id, isActive: !row.isActive }), editRoute: ROUTES.SUPPLIER_BILL.ADD_EDIT }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.supplierBillNo }) }),
          }),
        ]
      : []),
  ];
  const gridOptions = {
    columns,
    rows,
    rowCount: data?.data?.totalData || 0,
    loading: isLoading || isFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd: () => navigate(ROUTES.SUPPLIER_BILL.ADD_EDIT) }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE} breadcrumbs={BREADCRUMBS.SUPPLIER_BILL.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} />
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};
export default SupplierBill;
