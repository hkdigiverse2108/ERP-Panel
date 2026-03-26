import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../../Api";
import { PAGE_TITLE } from "../../../../Constants";
import { setPaymentTermsModal } from "../../../../Store/Slices/ModalSlice";
import type { AppGridColDef, PaymentTermsBase } from "../../../../Types";
import { useDataGrid, usePagePermission } from "../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Common";
import PaymentTermsForm from "./PaymentTermsForm";
import { CommonObjectPropertyColumn } from "../../../Common/CommonDataGrid/CommonColumns";

const PaymentTerms = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.SETTINGS.PAYMENT_TERMS.BASE);

  const { data: paymentTermsData, isLoading: paymentTermsDataLoading, isFetching: paymentTermsDataFetching } = Queries.useGetPaymentTerms(params);
  const { mutate: deletePaymentTermsMutate, isPending: isDeleteLoading } = Mutations.useDeletePaymentTerms();
  const { mutate: editPaymentTerms, isPending: isEditLoading } = Mutations.useEditPaymentTerms();

  const allRows = useMemo(() => paymentTermsData?.data?.paymentTerm_data.map((item) => ({ ...item, id: item?._id })) || [], [paymentTermsData]);
  const totalRows = paymentTermsData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePaymentTermsMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setPaymentTermsModal({ open: true, data: null }));

  const handleEdit = (row: PaymentTermsBase) => dispatch(setPaymentTermsModal({ open: true, data: row }));

  const columns: AppGridColDef<PaymentTermsBase>[] = [
    { field: "name", headerName: "Payment Term", flex: 1, minWidth: 200 },
    { field: "day", headerName: "Payment Term Day", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<PaymentTermsBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PaymentTermsBase>({
            ...(permission?.edit && { active: (row) => editPaymentTerms({ paymentTermId: row?._id, isActive: !row.isActive }), onEdit: { handleEdit: (row) => handleEdit(row) } }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: paymentTermsDataLoading || paymentTermsDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    isExport: false,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.SETTINGS.PAYMENT_TERMS.BASE,
  };

  return (
    <Box sx={{ display: "grid" }}>
      <CommonCard title={PAGE_TITLE.SETTINGS.PAYMENT_TERMS.BASE}>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      <PaymentTermsForm />
    </Box>
  );
};

export default PaymentTerms;
