import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { CreditNoteBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { FormatDate } from "../../../Utils";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const CreditNote = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.ACCOUNTING.CREDIT_NOTE.BASE);

  const { data: creditNote_data, isLoading: creditNoteDataLoading, isFetching: creditNoteDataFetching } = Queries.useGetCreditNote(params);

  const { mutate: deleteCreditNoteMutate } = Mutations.useDeleteCreditNote();
  const { mutate: editCreditNote, isPending: isEditLoading } = Mutations.useEditCreditNote();

  const allCreditNotes = useMemo(() => creditNote_data?.data?.creditNote_data.map((creditNote) => ({ ...creditNote, id: creditNote?._id })) || [], [creditNote_data]);
  const totalRows = creditNote_data?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteCreditNoteMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.ACCOUNTING.CREDIT_NOTE.ADD_EDIT);

  const columns: GridColDef<CreditNoteBase>[] = [
    { field: "personName", headerName: "Person Name", width: 200 },
    { field: "amount", headerName: "Amount", width: 200 },
    { field: "date", headerName: "Date", width: 200, valueGetter: (v) => FormatDate(v) },
    CommonObjectPropertyColumn<CreditNoteBase>("bankName", "bankAccountId", ["name"], { headerName: "Bank name", width: 300 }),
    CommonPhoneColumns("phoneNo", { headerName: "Phone No", width: 200 }),
    { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<CreditNoteBase>({
            ...(permission?.edit && {
              active: (row) => editCreditNote({ creditNoteId: row?._id as string, isActive: !row.isActive }),
              editRoute: ROUTES.ACCOUNTING.CREDIT_NOTE.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.amount }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allCreditNotes,
    rowCount: totalRows,
    loading: creditNoteDataLoading || creditNoteDataFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNTING.CREDIT_NOTE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CREDIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default CreditNote;
