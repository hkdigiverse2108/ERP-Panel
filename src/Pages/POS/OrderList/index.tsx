import { Box, Grid } from "@mui/material";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Queries } from "../../../Api";
import { CommonDateRangeSelector } from "../../../Attribute";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import Print from "../../../Components/ReportFormats/Print";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, ORDER_STATUS, POS_ORDER_STATUS } from "../../../Data";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setEditPosOrder, setPrintType, setReturnPosOrder, setSalesInvoice, setSelectedOrderId } from "../../../Store/Slices/PosSlice";
import type { AppGridColDef, PosOrderBase } from "../../../Types";
import { CreateFilter, DateConfig } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const OrderList = () => {
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });

  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, advancedFilter, updateAdvancedFilter } = useDataGrid({});
  const permission = usePagePermission(PAGE_TITLE.POS.BASE); // Or order list permission specifically if available

  const { isSelectedOrderId, isPrintType } = useAppSelector((state) => state.pos);

  const { data: orderData, isLoading: orderDataLoading, isFetching: orderDataFetching } = Queries.useGetPosOrder({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAllOrders, isFetching: orderDataAllFetching, isLoading: orderDataAllLoading } = Queries.useGetPosOrder({ startDate: range.start.toISOString(), endDate: range.end.toISOString() }, false);
  const { data: posOrderById } = Queries.useGetPosOrderById(isSelectedOrderId, Boolean(isSelectedOrderId));

  const allOrders = useMemo(() => orderData?.data?.posOrder_data?.map((order) => ({ ...order, id: order?._id })) || [], [orderData]);
  const totalRows = orderData?.data?.totalData || 0;

  const PrintBill = posOrderById?.data;
  // const PrintBillReady = !posOrderByIdLoading && !posOrderByIdFetching;
  // console.log(PrintBillReady);

  const handleLastBillPrint = useReactToPrint({
    contentRef,
    documentTitle: () => `${PAGE_TITLE.POS.ORDER_LIST}_${new Date().toISOString().split("T")[0]}`,
    onBeforePrint: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
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
    CommonObjectPropertyColumn<PosOrderBase>("created", "createdAt", [], { headerName: "Date", width: 120, type: "date" }),
    CommonObjectPropertyColumn<PosOrderBase>("dueDate", "payLater", ["dueDate"], { headerName: "Due Date", width: 120, type: "date" }),
    CommonObjectPropertyColumn<PosOrderBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", width: 150 }),
    // CommonObjectPropertyColumn<PosOrderBase>("customer No.", "customerId.phoneNo", ["countryCode", "phoneNo"], { headerName: "Customer No.", width: 150, type: "phone" }),
    { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 120 },
    { field: "dueAmount", headerName: "Due Amount", flex: 1, minWidth: 100 },
    CommonObjectPropertyColumn<PosOrderBase>("paymentMethod", "paymentMethod", [], { headerName: "Payment Mode", width: 120, type: "format" }),
    CommonObjectPropertyColumn<PosOrderBase>("paymentStatus", "paymentStatus", [], { headerName: "Payment Status", width: 130, type: "status" }),
    { field: "redeemCreditAmount", headerName: "Credit Applied Amt", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PosOrderBase>("orderType", "orderType", [], { headerName: "Order Type", width: 120, type: "format" }),
    CommonObjectPropertyColumn<PosOrderBase>("salesManId", "salesManId", ["fullName"], { headerName: "Sales Man", width: 150 }),
    CommonObjectPropertyColumn<PosOrderBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 150, type: "status" }),
    CommonObjectPropertyColumn<PosOrderBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),

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

  const accountingColumns: AppGridColDef<PosOrderBase>[] = [
    { field: "orderNo", headerName: "Invoice No", flex: 1, minWidth: 150 },
    {
      field: "items",
      headerName: "Product Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<PosOrderBase>) => {
        return <div>{params.row.items?.map((item) => item?.productId?.name).join(", ")}</div>;
      },
      exportFormatter: (_, row: PosOrderBase) => {
        return row?.items?.map((item) => item?.productId?.name)?.join(", ") || "";
      },
    },
    CommonObjectPropertyColumn<PosOrderBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", width: 150 }),
    { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 120 },

    {
      field: "state",
      headerName: "State",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<PosOrderBase>) => {
        return <div>{params.row.customerId?.address?.[0].state?.name}</div>;
      },
      exportFormatter: (_, row: PosOrderBase) => {
        return row?.customerId?.address?.[0].state?.name || "";
      },
    },
    CommonObjectPropertyColumn<PosOrderBase>("paymentMethod", "paymentMethod", [], { headerName: "Payment Mode", width: 120, type: "format" }),
    CommonObjectPropertyColumn<PosOrderBase>("created", "createdAt", [], { headerName: "Date", width: 120, type: "date" }), //
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
    fileName: PAGE_TITLE.POS.ORDER_LIST,
    onExportAll: { onExportAll: fetchAllOrders, isFetching: orderDataAllLoading || orderDataAllFetching },
    onAccountingExportAll: { accountingColumns: accountingColumns, onAccountingExportAll: fetchAllOrders, isFetching: orderDataAllLoading || orderDataAllFetching },
  };

  const filter = [CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, ORDER_STATUS, false, { xs: 12, sm: 6, md: 3 })];
  const topContent = (
    <>
      <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
        <CommonDateRangeSelector value={range} onChange={setRange} />
      </Grid>
    </>
  );
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.ORDER_LIST} breadcrumbs={BREADCRUMBS.POS_ORDER_LIST.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} defaultExpanded children={topContent} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
      <div className="hidden">{<Print type="POS(B2C)" ref={contentRef} bill={PrintBill} />}</div>
    </>
  );
};

export default OrderList;
