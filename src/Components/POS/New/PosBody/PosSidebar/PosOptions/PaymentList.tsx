import { Grid } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Queries } from "../../../../../../Api";
import { CommonRadio } from "../../../../../../Attribute";
import { VOUCHER_TYPE } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setPaymentListModal } from "../../../../../../Store/Slices/ModalSlice";
import type { AppGridColDef, ExpenseBase, PosPaymentBase } from "../../../../../../Types";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonModal } from "../../../../../Common";
import { CommonObjectPropertyColumn } from "../../../../../Common/CommonDataGrid/CommonColumns";
import PaymentListBill from "./PaymentListBill";

const PaymentList = () => {
  const [activeTab, setActiveTab] = useState(VOUCHER_TYPE[0].value);
  const { isPaymentListModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ pageSize: 5, active: true });
  const contentRef = useRef<HTMLDivElement>(null);
  const [printData, setPrintData] = useState<PosPaymentBase | null>(null);

  const { data: paymentData, isLoading: paymentDataLoading, isFetching: paymentDataFetching } = Queries.useGetPosPayment({ ...params, voucherTypeFilter: [VOUCHER_TYPE[0].value] }, isPaymentListModal);
  const { data: expenseData, isLoading: expenseDataLoading, isFetching: expenseDataFetching } = Queries.useGetExpense({ ...params, avoidSalary: false }, isPaymentListModal);

  const allPayments = useMemo(() => paymentData?.data?.posPayment_data.map((payment) => ({ ...payment, id: payment?._id })) || [], [paymentData]);
  const allExpenses = useMemo(() => expenseData?.data?.expense_data.map((expense) => ({ ...expense, id: expense?._id })) || [], [expenseData]);
  const totalRows = useMemo(() => {
    if (activeTab === VOUCHER_TYPE[0].value) {
      return paymentData?.data?.totalData || 0;
    } else {
      return expenseData?.data?.totalData || 0;
    }
  }, [paymentData, expenseData, activeTab]);

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

  const ExpensesColumns: AppGridColDef<ExpenseBase>[] = [
    CommonObjectPropertyColumn<ExpenseBase>("partyId", "partyId", ["fullName"], { headerName: "Customer Name", flex: 1, minWidth: 150 }), //
    CommonObjectPropertyColumn<ExpenseBase>("fromDate", "fromDate", [], { headerName: "Expense Date", flex: 1, minWidth: 150, type: "date" }),
    { field: "amount", headerName: "Amount", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<ExpenseBase>("type", "type", [], { headerName: "Expense Type", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<ExpenseBase>("createdAt", "createdAt", [], { headerName: "Date", flex: 1, minWidth: 150, type: "datetime" }),
  ];

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
    columns: activeTab === VOUCHER_TYPE[0].value ? columns : ExpensesColumns,
    rows: activeTab === VOUCHER_TYPE[0].value ? allPayments : allExpenses,
    rowCount: totalRows,
    loading: activeTab === VOUCHER_TYPE[0].value ? paymentDataLoading || paymentDataFetching : expenseDataLoading || expenseDataFetching,
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
        <CommonRadio value={activeTab} options={VOUCHER_TYPE} onChange={(e) => setActiveTab(e)} />
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
