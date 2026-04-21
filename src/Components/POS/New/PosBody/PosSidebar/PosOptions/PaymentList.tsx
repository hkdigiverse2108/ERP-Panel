import { Grid } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Queries } from "../../../../../../Api";
import { CommonRadio } from "../../../../../../Attribute";
import { VOUCHER_TYPE } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setPaymentListModal } from "../../../../../../Store/Slices/ModalSlice";
import type { AppGridColDef, PosPaymentBase } from "../../../../../../Types";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonModal } from "../../../../../Common";
import { CommonObjectPropertyColumn } from "../../../../../Common/CommonDataGrid/CommonColumns";
import PaymentListBill from "./PaymentListBill";

const PaymentList = () => {
  const { isPaymentListModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, advancedFilter, updateAdvancedFilter, params } = useDataGrid({ pageSize: 5, active: true, defaultFilterKey: { voucherTypeFilter: [VOUCHER_TYPE[0].value] } });
  const contentRef = useRef<HTMLDivElement>(null);
  const [printData, setPrintData] = useState<PosPaymentBase | null>(null);

  const { data: paymentData, isLoading: paymentDataLoading, isFetching: paymentDataFetching } = Queries.useGetPosPayment(params, isPaymentListModal);

  const allPayments = useMemo(() => paymentData?.data?.posPayment_data.map((payment) => ({ ...payment, id: payment?._id })) || [], [paymentData]);
  const totalRows = paymentData?.data?.totalData || 0;

  const handlePrint = useReactToPrint({
    contentRef,
    onAfterPrint: () => {
      setPrintData(null);
    },
  });

  useEffect(() => {
    if (printData && contentRef.current) {
      handlePrint();
    }
  }, [printData, handlePrint]);

  const columns: AppGridColDef<PosPaymentBase>[] = [
    { field: "paymentNo", headerName: "Payment No", width: 100 },
    CommonObjectPropertyColumn<PosPaymentBase>("partyId", "partyId", ["firstName", "lastName"], { headerName: "Customer Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<PosPaymentBase>("paymentMode", "paymentMode", [], { headerName: "Mode", width: 80, type: "format" }),
    CommonObjectPropertyColumn<PosPaymentBase>("paymentType", "paymentType", [], { headerName: "Type", width: 100, type: "format" }),
    { field: "amount", headerName: "Amount", width: 100 },
    CommonObjectPropertyColumn<PosPaymentBase>("createdAt", "createdAt", [], { headerName: "Date", flex: 1, minWidth: 150, type: "datetime" }),
    CommonActionColumn<PosPaymentBase>({
      onPrint: { handlePrint: (row) => setPrintData(row) },
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allPayments,
    rowCount: totalRows,
    loading: paymentDataLoading || paymentDataFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
    fileName: "Payment List",
  };

  const topContent = (
    <Grid container spacing={2} alignItems="center">
      <Grid size="auto">
        <CommonRadio value={advancedFilter?.voucherTypeFilter?.[0] || ""} options={VOUCHER_TYPE} onChange={(e) => updateAdvancedFilter("voucherTypeFilter", [e])} />
      </Grid>
    </Grid>
  );
  return (
    <CommonModal title="Payments" isOpen={isPaymentListModal} onClose={() => dispatch(setPaymentListModal())} className="max-w-[1000px]">
      <CommonCard topContent={topContent} hideDivider>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <div className="print-only hidden">{printData && <PaymentListBill ref={contentRef} data={printData} />}</div>
    </CommonModal>
  );
};

export default PaymentList;
