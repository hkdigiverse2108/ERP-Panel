import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, DiscountBase } from "../../../Types";
import { FormatValidity } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const Discount = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.CRM.DISCOUNT.BASE);
  const { data, isLoading, isFetching } = Queries.useGetDiscount(params);
  const { mutate: deleteDiscount } = Mutations.useDeleteDiscount();
  const { mutate: editDiscount } = Mutations.useEditDiscount();

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteDiscount(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const rows = useMemo(() => data?.data?.discount_data.map((r: DiscountBase) => ({ ...r, id: r?._id })) || [], [data]);

  const stats = useMemo(() => {
    return [
      { label: "Total Discounts", value: data?.data?.totalData || 0 },
      { label: "Active Discounts", value: data?.data?.activeDiscounts || 0 },
      { label: "Order with Discounts", value: data?.data?.orderWithDiscounts || 0 },
      { label: "Revenue from Discounts", value: data?.data?.revenue || 0 },
      { label: "Discount Given", value: data?.data?.discountGiven || 0 },
    ];
  }, [data]);

  const columns: AppGridColDef<DiscountBase>[] = [
    { field: "title", headerName: "Title", flex: 1, minWidth: 170 },
    CommonObjectPropertyColumn<DiscountBase>("createdAt", "createdAt", [], { headerName: "Created On", flex: 1, minWidth: 100, type: "date" }),
    CommonObjectPropertyColumn<DiscountBase>("createdAt", "createdAt", [], { headerName: "Created On", flex: 1, minWidth: 100, type: "date" }),
    { field: "validity", headerName: "Validity", width: 200, valueGetter: (v, row) => FormatValidity(v, row) },
    { field: "orders", headerName: "Orders", flex: 1, minWidth: 100 },
    { field: "revenue", headerName: "Revenue", flex: 1, minWidth: 100 },
    { field: "discountValue", headerName: "Discount", flex: 1, minWidth: 100 },
    CommonObjectPropertyColumn<DiscountBase>("discountType", "discountType", [], { headerName: "Discount Type", flex: 1, minWidth: 100, type: "format" }),
    CommonObjectPropertyColumn<DiscountBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 100, type: "status" }),
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<DiscountBase>({
            ...(permission?.edit && { active: (row) => editDiscount({ discountId: row?._id, isActive: !row.isActive }), editRoute: ROUTES.DISCOUNT.ADD_EDIT }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.title || row?.discountCode }) }),
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
    ...(permission?.add && { handleAdd: () => navigate(ROUTES.DISCOUNT.ADD_EDIT) }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.CRM.DISCOUNT.BASE,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CRM.DISCOUNT.BASE} breadcrumbs={BREADCRUMBS.DISCOUNT.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 1.5 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, sm: 4, md: 2.3 }} />
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default Discount;
