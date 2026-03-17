import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Queries } from "../../../Api";
import { CashInHandDetails, MultiplePay, PosBody, PosHeader } from "../../../Components/POS/New";
import BillReceipt from "../../../Components/POS/New/BillReceipt";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setPosLoading, setPosProduct, setPrintType, setReturnPosOrderId, setSalesInvoice, setSelectedOrderId } from "../../../Store/Slices/PosSlice";

const NewPos = () => {
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const printLock = useRef(false);

  const { isSelectedOrderId, isPrintType, isSalesInvoice, isEditPosOrder, isReturnPosOrderId } = useAppSelector((state) => state.pos);
  const { isMultiplePay } = useAppSelector((state) => state.pos);

  const { data: cashRegisterDetails } = Queries.useGetPosCashRegisterDetails();
  const { data: returnPosOrder, isLoading: returnPosOrderLoading, isFetching: returnPosOrderFetching } = Queries.useGetReturnPosOrderById(isReturnPosOrderId, Boolean(isReturnPosOrderId));
  const { data: posOrderById, isLoading: posOrderByIdLoading, isFetching: posOrderByIdFetching } = Queries.useGetPosOrderById(isSelectedOrderId, Boolean(isSelectedOrderId));
  const { data: orderData, isLoading: orderDataLoading, isFetching: orderDataFetching } = Queries.useGetPosOrderById(isSalesInvoice, Boolean(isSalesInvoice));
  const orderDataById = orderData?.data;

  const PrintBill = isReturnPosOrderId ? returnPosOrder?.data : posOrderById?.data;
  const PrintBillReady = isReturnPosOrderId ? !returnPosOrderLoading && !returnPosOrderFetching : !posOrderByIdLoading && !posOrderByIdFetching;

  const handleLastBillPrint = useReactToPrint({
    contentRef,
    onAfterPrint: async () => {
      printLock.current = false;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setSelectedOrderId(""));
      dispatch(setReturnPosOrderId(""));
    },
    onPrintError: async () => {
      printLock.current = false;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setSelectedOrderId(""));
      dispatch(setReturnPosOrderId(""));
    },
  });

  useEffect(() => {
    dispatch(setPosLoading(orderDataLoading || orderDataFetching));
    if (!orderDataLoading && !orderDataFetching && orderDataById) {
      const payload = {
        items: orderDataById?.items?.map((item) => ({
          _id: item.productId?._id,
          name: item.productId?.name,
          discount: item.discountAmount,
          additionalDiscount: item.additionalDiscountAmount,
          posQty: item.qty,
          netAmount: item.netAmount,
          unitCost: item.unitCost,
          originalQty: item.qty,
          ...item.productId,
        })),
        couponId: orderDataById?.couponId,
        couponDiscount: orderDataById?.couponDiscount,
        loyaltyId: orderDataById?.loyaltyId,
        loyaltyDiscount: orderDataById?.loyaltyDiscount,
        redeemCreditAmount: orderDataById?.redeemCreditAmount,
        redeemCreditId: orderDataById?.redeemCreditId,
        redeemCreditType: orderDataById?.redeemCreditType,
        discountId: orderDataById?.discountId,
        discountAmount: orderDataById?.discountAmount,
        discountMode: orderDataById?.discountMode,
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
      if (isSalesInvoice) {
        dispatch(setPosProduct(payload));
        if (isPrintType === "print") dispatch(setSalesInvoice(""));
      }
    }
  }, [orderDataById, orderDataLoading, orderDataFetching, isSalesInvoice, dispatch]);

  useEffect(() => {
    if (!PrintBill || isPrintType !== "print") return;

    const isNormalOrder = PrintBill?._id === isSelectedOrderId;
    const isReturnOrder = PrintBill?._id === isReturnPosOrderId;

    if ((isNormalOrder || isReturnOrder) && !printLock.current) {
      printLock.current = true;

      handleLastBillPrint();
    } else printLock.current = false;
  }, [PrintBill, isPrintType, isSelectedOrderId, isReturnPosOrderId]);

  return (
    <div className={isEditPosOrder ? "border-2 border-red-600!" : ""}>
      {isMultiplePay ? (
        <MultiplePay />
      ) : (
        <>
          <PosHeader />
          <PosBody />
        </>
      )}
      {cashRegisterDetails?.data?.status === "closed" && <CashInHandDetails />}
      <div className="print-only hidden">{PrintBill && PrintBillReady && <BillReceipt ref={contentRef} bill={PrintBill} />}</div>
    </div>
  );
};

export default NewPos;
