import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setBankTransactionModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, BankTransactionBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import BankTransactionForm from "./BankTransactionForm";

const BankTransaction = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.BANK_TRANSACTION.BASE);

  const { data: bankTransaction_data, isLoading: bankTransactionDataLoading, isFetching: bankTransactionDataFetching } = Queries.useGetBankTransaction(params);
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetBankTransaction({}, false);
  const { mutate: deleteBankTransactionMutate } = Mutations.useDeleteBankTransaction();
  const { mutate: editBankTransaction, isPending: isEditLoading } = Mutations.useEditBankTransaction();

  const allBankTransactions = useMemo(() => bankTransaction_data?.data?.bankTransaction_data?.map((transaction: BankTransactionBase) => ({ ...transaction, id: transaction?._id })) || [], [bankTransaction_data]);
  const totalRows = bankTransaction_data?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteBankTransactionMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setBankTransactionModal({ open: true, data: null }));

  const handleEdit = (row: BankTransactionBase) => dispatch(setBankTransactionModal({ open: true, data: row }));

  const columns: AppGridColDef<BankTransactionBase>[] = [
    { field: "voucherNo", headerName: "Voucher No", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<BankTransactionBase>("transactionDate", "transactionDate", [], { headerName: "Transaction Date", flex: 1, minWidth: 150, type: "date" }),
    CommonObjectPropertyColumn<BankTransactionBase>("transactionType", "transactionType", [], { headerName: "Transaction Type", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<BankTransactionBase>("fromAccount", "fromAccount", ["name"], { headerName: "From Account", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<BankTransactionBase>("toAccount", "toAccount", ["name"], { headerName: "To Account", flex: 1, minWidth: 150 }),
    { field: "amount", headerName: "Amount", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<BankTransactionBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<BankTransactionBase>({
            ...(permission?.edit && {
              active: (row) => editBankTransaction({ bankTransactionId: row?._id, isActive: !row.isActive }),
              onEdit: { handleEdit: (row) => handleEdit(row) },
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.voucherNo || row?.transactionType }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allBankTransactions,
    rowCount: totalRows,
    loading: bankTransactionDataLoading || bankTransactionDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.BANK_TRANSACTION.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BANK_TRANSACTION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BANK_TRANSACTION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <BankTransactionForm />
      </Box>
    </>
  );
};

export default BankTransaction;
