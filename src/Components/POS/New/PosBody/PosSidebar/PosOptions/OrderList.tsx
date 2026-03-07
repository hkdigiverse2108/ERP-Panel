import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Queries } from "../../../../../../Api";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setDiscardModal, setOrderModal } from "../../../../../../Store/Slices/ModalSlice";
import { setEditPosOrder, setPrintType, setReturnPosOrder, setSalesInvoice, setSelectedOrderId } from "../../../../../../Store/Slices/PosSlice";
import type { PosOrderBase } from "../../../../../../Types";
import { FormatDate, FormatPayment } from "../../../../../../Utils";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonActionColumn, CommonDataGrid, CommonModal } from "../../../../../Common";
import { POS_ORDER_STATUS } from "../../../../../../Data";

const OrderList = () => {
  const { isOrderModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ active: true });

  const { data: orderData, isLoading: orderDataLoading, isFetching: orderDataFetching } = Queries.useGetPosOrder({ ...params, orderListFilter: true }, isOrderModal);

  const allOrders = useMemo(() => orderData?.data?.posOrder_data?.map((order) => ({ ...order, id: order?._id })) || [], [orderData]);
  const totalRows = orderData?.data?.totalData || 0;

  const handleEdit = (row: PosOrderBase) => {
    if (PosProduct?.items.length > 0) {
      dispatch(setDiscardModal());
      dispatch(setOrderModal());
    } else {
      dispatch(setEditPosOrder());
      dispatch(setSalesInvoice(row._id));
      dispatch(setOrderModal());
    }
  };

  const handlePrintBtn = (row: PosOrderBase) => {
    dispatch(setPrintType("print"));
    dispatch(setSelectedOrderId(row?._id));
    dispatch(setOrderModal());
  };

  const handleSalesInvoiceBtn = (row: PosOrderBase) => {
    if (PosProduct?.items.length > 0) {
      dispatch(setDiscardModal());
      dispatch(setOrderModal());
    } else {
      dispatch(setReturnPosOrder());
      dispatch(setSalesInvoice(row._id));
      dispatch(setOrderModal());
    }
  };

  const columns: GridColDef<PosOrderBase>[] = [
    { field: "orderNo", headerName: "Order No", width: 100 }, //
    { field: "createdAt", headerName: "Date", width: 100, renderCell: ({ value }) => FormatDate(value) },
    { field: "customerId", headerName: "Customer Name", width: 150, renderCell: ({ value }) => value?.firstName + " " + value?.lastName },
    {
      field: "customerNumber",
      headerName: "Customer Mo.Number",
      width: 160,
      valueGetter: (_value, row) => {
        const obj = row?.customerId?.phoneNo;
        const val = typeof obj === "object" && obj !== null ? obj?.countryCode + " " + obj?.phoneNo : "-";
        return typeof val === "string" || typeof val === "number" ? val : "-";
      },
    },
    { field: "totalAmount", headerName: "Total Amount", width: 120 },
    { field: "paymentMethod", headerName: "Payment Mode", width: 120, renderCell: ({ value }) => FormatPayment(value) },
    { field: "orderType", headerName: "Order Type", flex: 1, minWidth: 100, renderCell: ({ value }) => FormatPayment(value) },
    CommonActionColumn<PosOrderBase>({
      onEdit: {
        handleEdit: (row) => handleEdit(row),
        isPermission: (row) => row.posCashRegisterId?.status !== "open",
      },
      onPrint: (row) => handlePrintBtn(row),
      onSalesInvoice: {
        handleSalesInvoice: (row) => handleSalesInvoiceBtn(row),
        isPermission: (row) => ![POS_ORDER_STATUS.COMPLETED].includes(row.status),
      },
    }),
  ];
  const CommonDataGridOption = {
    columns,
    rows: allOrders,
    rowCount: totalRows,
    loading: orderDataLoading || orderDataFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
  };

  return (
    <CommonModal title="POS Details" isOpen={isOrderModal} onClose={() => dispatch(setOrderModal())} className="max-w-[1150px]">
      <Box className="mr-2!">
        <CommonDataGrid {...CommonDataGridOption} />
      </Box>
    </CommonModal>
  );
};

export default OrderList;
