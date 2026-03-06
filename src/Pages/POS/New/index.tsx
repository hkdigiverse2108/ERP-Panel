import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Queries } from "../../../Api";
import { CashInHandDetails, MultiplePay, PosBody, PosHeader } from "../../../Components/POS/New";
import BillReceipt from "../../../Components/POS/New/BillReceipt";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setPosLoading, setPosProduct, setPrintType, setSelectedOrderId } from "../../../Store/Slices/PosSlice";

const NewPos = () => {
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const printLock = useRef(false);

  const { isSelectedOrderId, isPrintType, isSalesInvoice, isEditPosOrder } = useAppSelector((state) => state.pos);
  const { isMultiplePay } = useAppSelector((state) => state.pos);

  const { data: cashRegisterDetails } = Queries.useGetPosCashRegisterDetails();
  const { data: posOrderById, isLoading: posOrderByIdLoading, isFetching: posOrderByIdFetching } = Queries.useGetPosOrderById(isSelectedOrderId, Boolean(isSelectedOrderId));
  const { data: orderData, isLoading: orderDataLoading, isFetching: orderDataFetching } = Queries.useGetPosOrderById(isSalesInvoice, Boolean(isSalesInvoice));
  const orderDataById = orderData?.data;

  const handleLastBillPrint = useReactToPrint({
    contentRef,
    onAfterPrint: async () => {
      printLock.current = false;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setSelectedOrderId(""));
    },
    onPrintError: async () => {
      printLock.current = false;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setPrintType(""));
      dispatch(setSelectedOrderId(""));
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
      dispatch(setPosProduct(payload));
    }
  }, [orderDataById, orderDataLoading, orderDataFetching, dispatch]);

  useEffect(() => {
    if (posOrderById?.data && isPrintType === "print" && isSelectedOrderId && !printLock.current) {
      printLock.current = true;
      handleLastBillPrint();
    }
  }, [posOrderById, isPrintType, isSelectedOrderId]);
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
      <div className="print-only hidden">{posOrderById?.data && !posOrderByIdLoading && !posOrderByIdFetching && <BillReceipt ref={contentRef} bill={posOrderById?.data} />}</div>
    </div>
  );
};

export default NewPos;
