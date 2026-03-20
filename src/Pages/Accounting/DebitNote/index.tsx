import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { DebitNoteBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { FormatDate } from "../../../Utils";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const DebitNote = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.ACCOUNTING.DEBIT_NOTE.BASE);

  const { data: debitNote_data, isLoading: debitNoteDataLoading, isFetching: debitNoteDataFetching } = Queries.useGetDebitNote(params);

  const { mutate: deleteDebitNoteMutate } = Mutations.useDeleteDebitNote();
  const { mutate: editDebitNote, isPending: isEditLoading } = Mutations.useEditDebitNote();

  const allDebitNotes = useMemo(() => debitNote_data?.data?.debitNote_data.map((debitNote) => ({ ...debitNote, id: debitNote?._id })) || [], [debitNote_data]);
  const totalRows = debitNote_data?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteDebitNoteMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.ACCOUNTING.DEBIT_NOTE.ADD_EDIT);

  const columns: GridColDef<DebitNoteBase>[] = [
    { field: "personName", headerName: "Person Name", width: 200 },
    { field: "amount", headerName: "Amount", width: 200 },
    { field: "date", headerName: "Date", width: 200, valueGetter: (v) => FormatDate(v) },
    CommonObjectPropertyColumn<DebitNoteBase>("bankName", "bankAccountId", ["name"], { headerName: "Bank name", width: 300 }),
    CommonPhoneColumns("phoneNo", { headerName: "Phone No", width: 200 }),
    { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<DebitNoteBase>({
            ...(permission?.edit && {
              active: (row) => editDebitNote({ debitNoteId: row?._id as string, isActive: !row.isActive }),
              editRoute: ROUTES.ACCOUNTING.DEBIT_NOTE.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.amount }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allDebitNotes,
    rowCount: totalRows,
    loading: debitNoteDataLoading || debitNoteDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNTING.DEBIT_NOTE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.DEBIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default DebitNote;
