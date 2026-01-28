import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonActionColumn, CommonDeleteModal } from "../../../Components/Common";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { Queries, Mutations } from "../../../Api";
import type { SupplierBillBase } from "../../../Types/SupplierBill";
import type { AppGridColDef } from "../../../Types";
import { FormatDate } from "../../../Utils";
import { BREADCRUMBS } from "../../../Data";
import SupplierBillStats from "../../../Components/Supplier/SupplierBillStats";
type FilterType = "all" | "unpaid";

const SupplierBill = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE);
  const { data, isLoading, isFetching } = Queries.useGetSupplierBillDetails(params);
  const { mutate: deleteSupplierBill } = Mutations.useDeleteSupplierBill();
  const { mutate: editSupplierBill } = Mutations.useEditSupplierBill();
  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteSupplierBill(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const rows: SupplierBillBase[] = data?.data?.supplierBill_data?.map((bill) => ({ ...bill, id: bill._id })) || [];

  const getAmount = (v?: string | number) => Number(v ?? 0);

  const [filter, setFilter] = useState<FilterType>("all");

  const filteredRows = useMemo(() => {
    if (filter === "all") return rows;

    return rows.filter((r) => getAmount(r.invoiceAmount) > getAmount(r.paidAmount));
  }, [rows, filter]);

  const stats = useMemo(() => {
    const total = rows.length;

    const unpaid = rows.filter((r) => getAmount(r.invoiceAmount) > getAmount(r.paidAmount)).length;

    return [
      { label: "Total Purchase", value: total },
      { label: "Paid", value: total - unpaid },
      { label: "Unpaid", value: unpaid },
    ];
  }, [rows]);

  const columns: AppGridColDef<SupplierBillBase>[] = [{ field: "supplierBillNo", headerName: "Bill No", width: 160 }, { field: "supplierId", headerName: "Supplier", width: 240, valueGetter: (_, row) => (row?.supplierId ? `${row.supplierId.firstName ?? ""} ${row.supplierId.lastName ?? ""}` : "") }, { field: "supplierBillDate", headerName: "Bill Date", width: 150, valueGetter: (v) => FormatDate(v) }, { field: "referenceBillNo", headerName: "Ref Bill", width: 150 }, { field: "invoiceAmount", headerName: "Invoice Amount", width: 160 }, { field: "paidAmount", headerName: "Paid Amount", width: 150 }, { field: "dueDate", headerName: "Due Date", width: 150, valueGetter: (v) => FormatDate(v) }, { field: "taxType", headerName: "Tax Type", width: 120 }, { field: "notes", headerName: "Notes", width: 280 }, ...(permission?.edit || permission?.delete ? [CommonActionColumn<SupplierBillBase>({ ...(permission?.edit && { active: (row) => editSupplierBill({ supplierBillId: row?._id, isActive: !row.isActive }), editRoute: ROUTES.SUPPLIER_BILL.ADD_EDIT }), ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.supplierBillNo }) }) })] : [])];

  const gridOptions = {
    columns,
    rows: filteredRows,
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
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE} breadcrumbs={BREADCRUMBS.SUPPLIER_BILL.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard>
          <SupplierBillStats stats={stats} />
        </CommonCard>
        <CommonCard
          topContent={
            <ToggleButtonGroup size="small" exclusive value={filter} onChange={(_, v) => v && setFilter(v)}>
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="unpaid">Unpaid</ToggleButton>
            </ToggleButtonGroup>
          }
        >
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default SupplierBill;
