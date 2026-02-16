import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonActionColumn, CommonDeleteModal, AdvancedSearch, CommonStatsCard, CommonObjectNameColumn } from "../../../Components/Common";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { Queries, Mutations } from "../../../Api";
import type { AppGridColDef } from "../../../Types";
import type { PurchaseOrderBase } from "../../../Types/PurchaseOrder";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, ORDER_STATUS } from "../../../Data";

const PurchaseOrder = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.PURCHASE.PURCHASE_ORDER.BASE);

  // ================= API =================

  const { data: purchaseOrderData, isLoading, isFetching } = Queries.useGetPurchaseOrder(params);

  const { mutate: deletePurchaseOrder } = Mutations.useDeletePurchaseOrder();

  const { mutate: editPurchaseOrder, isPending: isEditLoading } = Mutations.useEditPurchaseOrder();

  const { data: supplierData, isLoading: supplierLoading } = Queries.useGetContactDropdown({ typeFilter: "supplier" });

  // ================= DATA =================

  const rows: PurchaseOrderBase[] = purchaseOrderData?.data?.purchaseOrder_data?.map((po) => ({ ...po, id: po._id })) || [];

  const totalRows = purchaseOrderData?.data?.totalData || 0;

  // ================= DELETE =================

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;

    deletePurchaseOrder(rowToDelete._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  // ================= FILTER =================

  const filter = [CreateFilter("Select Supplier", "supplierFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(supplierData?.data), supplierLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, ORDER_STATUS, false, { xs: 12, sm: 6, md: 3 })];

  // ================= STATS =================

  const stats = useMemo(() => {
    const total = rows.length;
    return [
      { label: "All Orders", value: total, color: "primary" },
      { label: "Delivered", value: rows.filter((r) => r.status === "delivered").length, color: "success" },
      { label: "Exceed", value: rows.filter((r) => r.status === "exceed").length, color: "error" },
      { label: "Completed", value: rows.filter((r) => r.status === "completed").length, color: "info" },
      { label: "Cancelled", value: rows.filter((r) => r.status === "cancelled").length, color: "warning" },
    ];
  }, [rows]);

  // ================= COLUMNS =================

  const columns: AppGridColDef<PurchaseOrderBase>[] = [
    { field: "orderNo", headerName: "Order No", width: 150 },

    CommonObjectNameColumn<PurchaseOrderBase>("supplierId", { headerName: "Supplier", width: 250 }),

    { field: "date", headerName: "Order Date", width: 150, renderCell: (params) => FormatDate(params.row.date || params.row.orderDate) },

    { field: "netAmount", headerName: "Amount", width: 170, type: "number" },

    { field: "status", headerName: "Status", width: 150 },

    { field: "notes", headerName: "Notes", flex: 1, minWidth: 150, renderCell: (params) => params.row.notes || params.row.note || "-" },

    ...(permission?.edit || permission?.delete
      ? [
        CommonActionColumn<PurchaseOrderBase>({
          ...(permission?.edit && {
            active: (row) => editPurchaseOrder({ purchaseOrderId: row?._id, isActive: !row.isActive }),
            editRoute: ROUTES.PURCHASE_ORDER.ADD_EDIT,
          }),
          ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id }) }),
        }),
      ]
      : []),
  ];

  // ================= GRID OPTIONS =================

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading,
    isActive,
    setActive,

    ...(permission?.add && {
      handleAdd: () => navigate(ROUTES.PURCHASE_ORDER.ADD_EDIT),
    }),

    paginationModel,
    onPaginationModelChange: setPaginationModel,

    sortModel,
    onSortModelChange: setSortModel,

    filterModel,
    onFilterModelChange: setFilterModel,
  };

  // ================= UI =================

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE.PURCHASE_ORDER.BASE} breadcrumbs={BREADCRUMBS.PURCHASE_ORDER.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <Box sx={{ overflowX: "auto", pb: 1, "& .MuiGrid-container": { flexWrap: "nowrap", minWidth: "max-content" } }}>
          <CommonStatsCard stats={stats} />
        </Box>

        <AdvancedSearch filter={filter} />

        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default PurchaseOrder;
