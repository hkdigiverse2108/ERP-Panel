import { Box } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../../Components/Common";
import BillReceipt from "../../../Components/POS/New/BillReceipt";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, ORDER_STATUS, POS_ORDER_STATUS } from "../../../Data";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setEditPosOrder, setPrintType, setReturnPosOrder, setSalesInvoice, setSelectedOrderId } from "../../../Store/Slices/PosSlice";
import type { AppGridColDef, PosOrderBase } from "../../../Types";
import { CreateFilter, FormatDate, FormatPayment } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const OrderList = () => {
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, advancedFilter, updateAdvancedFilter } = useDataGrid({});
  const permission = usePagePermission(PAGE_TITLE.POS.BASE); // Or order list permission specifically if available

  const { isSelectedOrderId, isPrintType } = useAppSelector((state) => state.pos);

  const { data: orderData, isLoading: orderDataLoading, isFetching: orderDataFetching } = Queries.useGetPosOrder(params);
  const { data: posOrderById, isLoading: posOrderByIdLoading, isFetching: posOrderByIdFetching } = Queries.useGetPosOrderById(isSelectedOrderId, Boolean(isSelectedOrderId));

  const allOrders = useMemo(() => orderData?.data?.posOrder_data?.map((order) => ({ ...order, id: order?._id })) || [], [orderData]);
  const totalRows = orderData?.data?.totalData || 0;

  const PrintBill = posOrderById?.data;
  const PrintBillReady = !posOrderByIdLoading && !posOrderByIdFetching;

  const handleLastBillPrint = useReactToPrint({
    contentRef,
    onAfterPrint: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setSelectedOrderId(""));
    },
    onPrintError: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setSelectedOrderId(""));
    },
  });

  const handlePrintBtn = (row: PosOrderBase) => {
    dispatch(setPrintType("print"));
    dispatch(setSelectedOrderId(row?._id));
  };

  const handleEdit = (row: PosOrderBase) => {
    dispatch(setEditPosOrder());
    dispatch(setSalesInvoice(row._id));
    navigate(ROUTES.POS.NEW);
  };

  const handleSalesInvoiceBtn = (row: PosOrderBase) => {
    dispatch(setReturnPosOrder());
    dispatch(setSalesInvoice(row._id));
    navigate(ROUTES.POS.NEW);
  };

  useEffect(() => {
    if (!PrintBill || isPrintType !== "print") return;

    const isNormalOrder = PrintBill?._id === isSelectedOrderId;

    if (isNormalOrder) {
      handleLastBillPrint();
    }
  }, [PrintBill, isPrintType, isSelectedOrderId]);

  const columns: AppGridColDef<PosOrderBase>[] = [
    { field: "orderNo", headerName: "Invoice No", flex: 1, minWidth: 150 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params.row.createdAt ? FormatDate(params.row.createdAt) : "-"),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params.row.payLater?.dueDate ? FormatDate(params.row.payLater.dueDate) : "-"),
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const customer = params.row.customerId;
        return customer ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() : "Walk-in";
      },
    },
    { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 120 },
    { field: "dueAmount", headerName: "Due Amount", flex: 1, minWidth: 100 },
    { field: "paymentMethod", headerName: "Payment Mode", flex: 1, minWidth: 120, renderCell: (params) => FormatPayment(params.row.paymentMethod) },
    { field: "paymentStatus", headerName: "Payment Status", flex: 1, minWidth: 130, renderCell: (params) => FormatPayment(params.row.paymentStatus) },
    {
      field: "creditAppliedAmt",
      headerName: "Credit Applied Amt",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (params.row.totalAmount && params.row.dueAmount ? params.row.totalAmount - params.row.dueAmount : 0),
    },
    { field: "orderType", headerName: "Order Type", flex: 1, minWidth: 100, renderCell: (params) => FormatPayment(params.row.orderType) },
    { field: "remark", headerName: "Feedback", flex: 1, minWidth: 120 },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const salesMan = params.row.salesManId;
        return salesMan ? `${salesMan.fullName || ""}`.trim() : "-";
      },
    },
    { field: "channelName", headerName: "Channel Name", flex: 1, minWidth: 130, renderCell: () => "POS" },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120, renderCell: (params) => FormatPayment(params.row.status) },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PosOrderBase>({
            onEdit: {
              handleEdit: (row) => handleEdit(row),
              isPermission: (row) => row.posCashRegisterId?.status !== "open",
            },
            onPrint: { handlePrint: (row) => handlePrintBtn(row) },
            onSalesInvoice: {
              handleSalesInvoice: (row) => handleSalesInvoiceBtn(row),
              isPermission: (row) => ![POS_ORDER_STATUS.COMPLETED].includes(row.status),
            },
          }),
        ]
      : []),
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

  const filter = [CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, ORDER_STATUS, false, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.ORDER_LIST} breadcrumbs={BREADCRUMBS.POS_ORDER_LIST.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} defaultExpanded={false} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
      <div className="print-only hidden">{PrintBill && PrintBillReady && <BillReceipt ref={contentRef} bill={PrintBill} />}</div>
    </>
  );
};

export default OrderList;
