import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Mutations, Queries } from "../../../../../../Api";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setCreditNoteModal, setOrderRefundModal } from "../../../../../../Store/Slices/ModalSlice";
import type { PosCreditNoteBase } from "../../../../../../Types";
import { FormatDate } from "../../../../../../Utils";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonDeleteModal, CommonModal } from "../../../../../Common";
import { Box } from "@mui/material";

const CreditNotes = () => {
  const { isCreditNoteModal } = useAppSelector((state) => state.modal);

  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, params } = useDataGrid({ active: false });
  const { mutate: deletePosCreditNoteMutate, isPending: isDeleteLoading } = Mutations.useDeletePosCreditNote();

  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetPosCreditNote(params, isCreditNoteModal);
  const allBranches = useMemo(() => branchData?.data?.posCreditNote_data.map((branch) => ({ ...branch, id: branch?._id })) || [], [branchData]);
  const totalRows = branchData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePosCreditNoteMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleRefundBtn = (row: PosCreditNoteBase) => {
    dispatch(setOrderRefundModal({ open: true, data: row }));
    dispatch(setCreditNoteModal());
  };

  const columns: GridColDef<PosCreditNoteBase>[] = [
    { field: "creditNoteNo", headerName: "Credit Note No.", width: 120 }, //
    { field: "customerId", headerName: "Customer Name", width: 130, renderCell: ({ value }) => value?.firstName + " " + value?.lastName },
    { field: "createdAt", headerName: "Date", width: 100, renderCell: ({ value }) => FormatDate(value) },
    { field: "totalAmount", headerName: "Total Amount", width: 100 },
    { field: "creditsUsed", headerName: "Credits Used", width: 100 },
    { field: "creditsRemaining", headerName: "Credits Remaining", flex: 1, minWidth: 100 },
    CommonActionColumn<PosCreditNoteBase>({
      onRefund: (row) => (row.creditsRemaining > 0 ? handleRefundBtn(row) : undefined),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.creditNoteNo }),
    }),
  ];
  const CommonDataGridOption = {
    columns,
    rows: allBranches,
    rowCount: totalRows,
    loading: branchDataLoading || branchDataFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
  };

  return (
    <CommonModal title="Credit Notes" isOpen={isCreditNoteModal} onClose={() => dispatch(setCreditNoteModal())} className="max-w-[1000px]">
      <Box sx={{ display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </CommonModal>
  );
};

export default CreditNotes;
