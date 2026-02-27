import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { Queries } from "../../../../../../Api";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setOrderModal } from "../../../../../../Store/Slices/ModalSlice";
import { setPosProduct } from "../../../../../../Store/Slices/PosSlice";
import type { PosOrderBase } from "../../../../../../Types";
import { FormatDate, FormatPayment } from "../../../../../../Utils";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonActionColumn, CommonDataGrid, CommonModal } from "../../../../../Common";

const OrderList = () => {
  const { isOrderModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ active: true });

  const { data } = Queries.useGetPosOrderById(selectedOrderId, Boolean(selectedOrderId));
  const { data: orderData, isLoading: orderDataLoading, isFetching: orderDataFetching } = Queries.useGetPosOrder(params, isOrderModal);

  const orderDataById = data?.data;
  const allOrders = useMemo(() => orderData?.data?.posOrder_data?.map((order) => ({ ...order, id: order?._id })) || [], [orderData]);
  const totalRows = orderData?.data?.totalData || 0;

  const handleEdit = (row: PosOrderBase) => {
    setSelectedOrderId(row._id);
    const payload = {
      items: orderDataById?.items?.map((item) => ({
        _id: item.productId?._id,
        name: item.productId?.name,
        discount: item.discountAmount,
        additionalDiscount: item.additionalDiscountAmount,
        posQty: item.qty,
        netAmount: item.netAmount,
        unitCost: item.unitCost,
        ...item.productId,
      })),
      customerId: orderDataById?.customerId?._id,
      orderType: orderDataById?.orderType,
      salesManId: orderDataById?.salesManId?._id,
      totalQty: orderDataById?.totalQty,
      totalMrp: orderDataById?.totalMrp,
      totalTaxAmount: orderDataById?.totalTaxAmount,
      totalDiscount: orderDataById?.totalDiscount,
      totalAdditionalCharge: orderDataById?.totalAdditionalCharge,
      flatDiscountAmount: orderDataById?.flatDiscountAmount,
      additionalCharges: orderDataById?.additionalCharges,
      roundOff: orderDataById?.roundOff,
      remark: orderDataById?.remark,
      totalAmount: orderDataById?.totalAmount,
      posOrderId: orderDataById?._id,
    };
    console.log("payload", payload);
    console.log("orderDataById", orderDataById);
    dispatch(setPosProduct(payload));
    dispatch(setOrderModal());
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
      onEdit: (row) => handleEdit(row),
      onPrint: () => {},
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
    <CommonModal title="POS Details" isOpen={isOrderModal} onClose={() => dispatch(setOrderModal())} className="max-w-[1100px]">
      <Box className="mr-2!">
        <CommonDataGrid {...CommonDataGridOption} />
      </Box>
    </CommonModal>
  );
};

export default OrderList;
