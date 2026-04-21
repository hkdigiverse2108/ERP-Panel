import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Mutations, Queries } from "../../../../../../Api";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setCreditNoteModal, setOrderRefundModal } from "../../../../../../Store/Slices/ModalSlice";
import { setPrintType, setReturnPosOrderId, setSelectedOrderId } from "../../../../../../Store/Slices/PosSlice";
import type { PosCreditNoteBase } from "../../../../../../Types";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonDeleteModal, CommonModal } from "../../../../../Common";
import { CommonObjectPropertyColumn } from "../../../../../Common/CommonDataGrid/CommonColumns";

const CreditNotes = () => {
  const { isCreditNoteModal } = useAppSelector((state) => state.modal);

  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, params } = useDataGrid({ active: false });
  const { mutate: deletePosCreditNoteMutate, isPending: isDeleteLoading } = Mutations.useDeletePosCreditNote();

  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetPosCreditNote(params, isCreditNoteModal);
  const allBranches = useMemo(() => branchData?.data?.posCreditNote_data.map((branch) => ({ ...branch, id: branch?._id })) || [], [branchData]);
  const totalRows = branchData?.data?.totalData || 0;

  const handleCloseModal = () => {
    dispatch(setCreditNoteModal());
    dispatch(setPrintType(""));
    dispatch(setSelectedOrderId(""));
  };

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

  const handlePrintBtn = (row: PosCreditNoteBase) => {
    dispatch(setPrintType("print"));
    dispatch(setReturnPosOrderId(row?.returnPosOrderId?._id));
    dispatch(setCreditNoteModal());
  };

  const columns: GridColDef<PosCreditNoteBase>[] = [
    { field: "creditNoteNo", headerName: "Credit Note No.", width: 120 }, //
    CommonObjectPropertyColumn<PosCreditNoteBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", flex: 1, minWidth: 130 }),
    CommonObjectPropertyColumn<PosCreditNoteBase>("createdAt", "createdAt", [], { headerName: "Date", flex: 1, minWidth: 100, type: "date" }),
    { field: "totalAmount", headerName: "Total Amount", width: 110 },
    { field: "creditsUsed", headerName: "Credits Used", width: 100 },
    { field: "creditsRemaining", headerName: "Credits Remaining", flex: 1, minWidth: 90 },
    CommonActionColumn<PosCreditNoteBase>({
      onRefund: (row) => (row.creditsRemaining > 0 ? handleRefundBtn(row) : undefined),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.creditNoteNo }),
      onPrint: {
        handlePrint: (row) => handlePrintBtn(row),
      },
    }),
  ];
  const CommonDataGridOption = {
    columns,
    BoxClass: "h-120 overflow-hidden",
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
    fileName: "Credit Notes",
  };

  return (
    <CommonModal title="Credit Notes" isOpen={isCreditNoteModal} onClose={handleCloseModal} className="max-w-[1000px]">
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
