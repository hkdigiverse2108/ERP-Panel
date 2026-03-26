import { Box } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import BillReceipt from "../../../Components/POS/New/BillReceipt";
import OrderRefund from "../../../Components/POS/New/PosBody/PosSidebar/PosOptions/OrderRefund";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, CREDIT_NOTE_STATUS } from "../../../Data";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setOrderRefundModal } from "../../../Store/Slices/ModalSlice";
import { setPrintType, setReturnPosOrderId } from "../../../Store/Slices/PosSlice";
import type { AppGridColDef, PosCreditNoteBase } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import { CreateFilter } from "../../../Utils";

const CreditNoteList = () => {
  const dispatch = useAppDispatch();
  const { isReturnPosOrderId, isPrintType } = useAppSelector((state) => state.pos);
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, params, advancedFilter, updateAdvancedFilter } = useDataGrid({ active: false });
  const { mutate: deletePosCreditNoteMutate, isPending: isDeleteLoading } = Mutations.useDeletePosCreditNote();
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: returnPosOrder, isLoading: returnPosOrderLoading, isFetching: returnPosOrderFetching } = Queries.useGetReturnPosOrderById(isReturnPosOrderId, Boolean(isReturnPosOrderId));
  const { data: posCreditNoteData, isLoading: posCreditNoteDataLoading, isFetching: posCreditNoteDataFetching } = Queries.useGetPosCreditNote(params, true);
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetPosCreditNote({}, false);
  const allPosCreditNote = useMemo(() => posCreditNoteData?.data?.posCreditNote_data.map((item) => ({ ...item, id: item?._id })) || [], [posCreditNoteData]);
  const totalRows = posCreditNoteData?.data?.totalData || 0;

  const PrintBill = returnPosOrder?.data;
  const PrintBillReady = !returnPosOrderLoading && !returnPosOrderFetching;

  const handleLastBillPrint = useReactToPrint({
    contentRef,
    onAfterPrint: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setReturnPosOrderId(""));
    },
    onPrintError: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setReturnPosOrderId(""));
    },
  });

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePosCreditNoteMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleRefundBtn = (row: PosCreditNoteBase) => {
    dispatch(setOrderRefundModal({ open: true, data: row }));
  };

  const handlePrintBtn = (row: PosCreditNoteBase) => {
    dispatch(setPrintType("print"));
    dispatch(setReturnPosOrderId(row?.returnPosOrderId?._id));
  };

  useEffect(() => {
    if (!PrintBill || isPrintType !== "print") return;

    const isReturnOrder = PrintBill?._id === isReturnPosOrderId;

    if (isReturnOrder) {
      handleLastBillPrint();
    }
  }, [PrintBill, isPrintType, isReturnPosOrderId]);

  const columns: AppGridColDef<PosCreditNoteBase>[] = [
    { field: "creditNoteNo", headerName: "Credit Note No.", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PosCreditNoteBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", width: 150 }),
    CommonObjectPropertyColumn<PosCreditNoteBase>("created", "createdAt", [], { headerName: "Date", width: 120, type: "date" }),
    { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 120 },
    { field: "creditsUsed", headerName: "Credits Used", flex: 1, minWidth: 120 },
    { field: "refundedAmount", headerName: "Refunded Amount", flex: 1, minWidth: 150 },
    { field: "creditsRemaining", headerName: "Credits Remaining", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PosCreditNoteBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 150, type: "status" }),
    CommonObjectPropertyColumn<PosCreditNoteBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),
    CommonActionColumn<PosCreditNoteBase>({
      onRefund: (row) => (row.creditsRemaining > 0 ? handleRefundBtn(row) : undefined),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.creditNoteNo }),
      onPrint: { handlePrint: (row) => handlePrintBtn(row) },
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allPosCreditNote,
    rowCount: totalRows,
    loading: posCreditNoteDataLoading || posCreditNoteDataFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.POS.CREDIT_NOTE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };
  const filter = [CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, CREDIT_NOTE_STATUS, false, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.CREDIT_NOTE} breadcrumbs={BREADCRUMBS.POS_CREDIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
      <OrderRefund />
      <div className="print-only hidden">{PrintBill && PrintBillReady && <BillReceipt ref={contentRef} bill={PrintBill} />}</div>
    </>
  );
};

export default CreditNoteList;
