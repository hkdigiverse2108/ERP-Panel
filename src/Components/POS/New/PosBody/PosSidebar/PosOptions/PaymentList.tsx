import { Grid } from "@mui/material";
import { useMemo } from "react";
import { Queries } from "../../../../../../Api";
import { CommonRadio } from "../../../../../../Attribute";
import { VOUCHER_TYPE } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setPaymentListModal } from "../../../../../../Store/Slices/ModalSlice";
import type { AppGridColDef, PosPaymentBase } from "../../../../../../Types";
import { FormatDateTime } from "../../../../../../Utils";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonCard, CommonDataGrid, CommonModal } from "../../../../../Common";

const PaymentList = () => {
  const { isPaymentListModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, advancedFilter, updateAdvancedFilter, params } = useDataGrid({ pageSize: 5, active: true, defaultFilterKey: { voucherTypeFilter: [VOUCHER_TYPE[0].value] } });

  const { data: paymentData, isLoading: paymentDataLoading, isFetching: paymentDataFetching } = Queries.useGetPosPayment(params, isPaymentListModal);

  const allPayments = useMemo(() => paymentData?.data?.posPayment_data.map((payment) => ({ ...payment, id: payment?._id })) || [], [paymentData]);
  const totalRows = paymentData?.data?.totalData || 0;

  const columns: AppGridColDef<PosPaymentBase>[] = [
    { field: "paymentNo", headerName: "Payment No", width: 150 },
    { field: "paymentMode", headerName: "Mode", width: 150 },
    {
      field: "paymentType",
      headerName: "Type",
      width: 150,
      renderCell: (params) => (params.row.paymentType === "against_bill" ? "Against Bill" : "Advance"),
      exportFormatter: (value) => (value === "against_bill" ? "Against Bill" : "Advance"),
    },
    { field: "amount", headerName: "Amount", type: "number", width: 150 },
    { field: "createdAt", headerName: "Date", flex: 1, minWidth: 150, renderCell: (params) => FormatDateTime(params.row.createdAt) },
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
    </CommonModal>
  );
};

export default PaymentList;
