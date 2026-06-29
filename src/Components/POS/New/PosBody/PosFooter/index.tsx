import { RealEstateAgent } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PauseIcon from "@mui/icons-material/Pause";
import RedeemIcon from "@mui/icons-material/Redeem";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import { Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { Mutations } from "../../../../../Api";
import { CommonButton, CommonTextField, ShowNotification } from "../../../../../Attribute";
import { POS_PAYMENT_METHOD, RETURN_POS_ORDER_TYPE } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setAdditionalChargeModal, setApplyCouponModal, setCardModal, setCashModal, setCustomerModal, setOrderRefundModal, setPayLaterModal, setRedeemCreditModal } from "../../../../../Store/Slices/ModalSlice";
import { clearPosProduct, setBtnStatus, setFlatDiscountAmount, setIsProductScan, setMultiplePay, setPrintType, setRemarks, setReturnPosOrderId, setRoundOff, setSelectedOrderId } from "../../../../../Store/Slices/PosSlice";
import type { PosProductOrderDataResponse } from "../../../../../Types";
import { RemoveEmptyFields, SanitizePayload } from "../../../../../Utils";
import OrderRefund from "../PosSidebar/PosOptions/OrderRefund";
import AdditionalCharge from "./AdditionalCharge";
import ApplyCoupon from "./ApplyCoupon";
import CardDetails from "./CardDetails";
import Cash from "./Cash";
import PayLater from "./PayLater";
import RedeemCredit from "./RedeemCredit";

const PosFooter = () => {
  const { PosProduct, isBtnStatus, isReturnPosOrder } = useAppSelector((state) => state.pos);
  const dispatch = useAppDispatch();

  const { mutate: addPosOrder } = Mutations.useAddPosOrder();
  const { mutate: editPosOrder } = Mutations.useEditPosOrder();

  const { mutate: addReturnPosOrder, isPending: isAddReturnPosOrderLoading } = Mutations.useAddReturnPosOrder();

  const summaryRowData = [
    { label: "Quantity", value: PosProduct.totalQty }, //totalQty
    { label: "MRP", value: PosProduct.totalMrp }, //totalMrp
    { label: "Tax Amount", value: PosProduct.totalTaxAmount }, //totalTaxAmount
    { label: "Add Charges+", value: PosProduct.totalAdditionalCharge }, //totalAdditionalCharge
    { label: "Discount", value: PosProduct.totalDiscount }, //totalDiscount
    { label: "Flat Discount" }, //flatDiscountAmount
    { label: "Round OFF" },
    { label: "Amount", value: Number(PosProduct?.totalAmount || 0)?.toFixed(0), highlight: true },
  ];

  const mappedItems = useMemo(
    () =>
      PosProduct.items?.map((item) => ({
        productId: item?._id,
        qty: item?.posQty,
        mrp: item?.mrp,
        discountAmount: item?.discount,
        additionalDiscountAmount: item?.additionalDiscount,
        unitCost: item?.unitCost,
        netAmount: item?.netAmount,
        ...(item.variantId && { variantId: item.variantId }),
      })),
    [PosProduct.items],
  );

  const validate = (requireCustomer = false) => {
    if (!PosProduct.items?.length) {
      ShowNotification("Please select at least one product", "error");
      return false;
    }
    if (requireCustomer && !PosProduct.customerId) {
      ShowNotification("Please select customer", "error");
      return false;
    }
    return true;
  };

  const handleHoldBill = (type: string) => {
    if (!validate()) return;
    const { posOrderId, ...rest } = PosProduct;
    const payload = {
      ...rest,
      items: mappedItems,
      status: "hold",
    };
    dispatch(setBtnStatus(type === "print" ? "hold-print" : "hold"));
    dispatch(setPrintType(type));
    const onSuccess = (res: PosProductOrderDataResponse) => {
      dispatch(clearPosProduct());
      dispatch(setBtnStatus(""));
      if (type === "print") dispatch(setSelectedOrderId(res?.data?._id));
    };
    const onError = () => {
      dispatch(setBtnStatus(""));
    };
    const changedFields = SanitizePayload(payload);
    if (posOrderId) editPosOrder({ ...changedFields, posOrderId }, { onSuccess, onError });
    else addPosOrder(RemoveEmptyFields(payload), { onSuccess, onError });
  };

  const handleUpi = (type: string) => {
    if (!validate(false)) return;
    const { posOrderId, ...rest } = PosProduct;

    const payload = {
      ...rest,
      items: mappedItems,
      paymentMethod: POS_PAYMENT_METHOD.UPI,
      multiplePayments: [
        {
          method: "upi",
          amount: PosProduct.totalAmount,
        },
      ],
    };
    dispatch(setBtnStatus(type === "print" ? "upi-print" : "upi"));
    dispatch(setPrintType(type));
    const onSuccess = (res: PosProductOrderDataResponse) => {
      dispatch(clearPosProduct());
      dispatch(setBtnStatus(""));
      if (type === "print") dispatch(setSelectedOrderId(res?.data?._id));
    };
    const onError = () => {
      dispatch(setBtnStatus(""));
    };
    const changedFields = SanitizePayload(payload);
    if (posOrderId) editPosOrder({ ...changedFields, posOrderId }, { onSuccess, onError });
    else addPosOrder(RemoveEmptyFields(payload), { onSuccess, onError });
  };

  const handlePayLater = (type: string) => {
    if (!validate(true)) return;
    dispatch(setPayLaterModal({ open: true, data: [] }));
    dispatch(setPrintType(type));
  };

  const handleCard = (type: string) => {
    if (!validate(false)) return;
    dispatch(setCardModal());
    dispatch(setPrintType(type));
  };

  const handleCash = (type: string) => {
    if (!validate(false)) return;
    dispatch(setCashModal());
    dispatch(setPrintType(type));
  };

  const handleMultiplePay = (type: string) => {
    if (!validate(false)) return;
    dispatch(setMultiplePay());
    dispatch(setPrintType(type));
  };

  const handleApplyCoupon = () => {
    if (!validate(true)) return;
    dispatch(setApplyCouponModal());
  };

  const handleRedeemCredit = () => {
    if (!validate(true)) return;
    dispatch(setRedeemCreditModal());
  };

  const handleSalesReturn = async () => {
    const payload = {
      posOrderId: PosProduct.posOrderId,
      customerId: PosProduct.customerId,
      salesManId: PosProduct.salesManId,
      items: mappedItems,
      total: PosProduct.totalAmount,
      type: RETURN_POS_ORDER_TYPE.SALES_RETURN,
      reason: PosProduct.remark,
      refundViaCash: PosProduct.totalAmount,
      additionalCharges: PosProduct.additionalCharges,
      roundOff: PosProduct.roundOff,
      flatDiscount: PosProduct.flatDiscountAmount,
      discountAmount: PosProduct.totalDiscount,
    };
    await addReturnPosOrder(RemoveEmptyFields(payload), {
      onSuccess: (res) => {
        dispatch(setPrintType("print"));
        dispatch(setReturnPosOrderId(res?.data?._id));
        dispatch(clearPosProduct());
      },
    });
  };
  const handleNewCustomer = () => {
    dispatch(setCustomerModal({ open: true, data: null }));
  };

  const handleProductScan = () => dispatch(setIsProductScan());

  const keyMap: Record<string, () => void> = {
    F1: () => handleNewCustomer(),
    F2: () => handleProductScan(),
    F3: () => handleCard(""),
    F4: () => handleCash(""),
    F5: () => handleUpi(""),
    F6: () => handleHoldBill(""),
    F7: () => handleHoldBill("print"),
    F8: () => handleCash("print"),
    F9: () => handleCard("print"),
    F10: () => handleUpi("print"),
    F11: () => handlePayLater("print"),
    F12: () => handleMultiplePay("print"),
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (keyMap[e.key]) {
        e.preventDefault();
        keyMap[e.key]();
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [keyMap]);

  const handleRefund = () => {
    const payload = {
      posOrderId: PosProduct.posOrderId,
      creditsRemaining: PosProduct.totalAmount,
    };
    dispatch(setOrderRefundModal({ open: true, data: payload, isSalesReturn: true }));
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-dark">
        {/* Remarks */}
        <div className="p-2">
          <CommonTextField label="Remarks" placeholder="Remarks" value={PosProduct.remark} onChange={(e) => dispatch(setRemarks(e))} />
        </div>

        {/* Summary Row */}
        <Grid container spacing={{ xs: 1, xl: 0 }} className="flex items-center py-2">
          {summaryRowData.map((item, index) => (
            <Grid size={{ xs: 6, md: 3, xl: 1.5 }} key={index} className={`flex flex-col items-center justify-center px-4 ${!item.highlight ? "border-r border-gray-300 dark:border-gray-700" : ""} `}>
              {item.label === "Flat Discount" && <CommonTextField label="Flat Discount" value={PosProduct.flatDiscountAmount} type="number" onChange={(e) => dispatch(setFlatDiscountAmount(e))} isCurrency currencyDisabled />}
              {item.label === "Round OFF" && <CommonTextField label="Round OFF" value={PosProduct.roundOff} type="number" onChange={(e) => dispatch(setRoundOff(e))} />}
              {item.value !== undefined && (
                <>
                  <span className={`font-semibold ${item.highlight ? "text-brand-600 text-2xl" : "text-lg text-gray-900 dark:text-gray-100"}`}>{item.value.toString()}</span>
                  {item.label === "Add Charges+" ? (
                    <span onClick={() => dispatch(setAdditionalChargeModal({ open: true, data: null }))} className={`text-sm font-medium cursor-pointer text-brand-600 mt-1`}>
                      {item.label}
                    </span>
                  ) : (
                    <span className={`text-sm font-medium ${item.highlight ? "text-brand-600" : "text-gray-700 dark:text-gray-400"} mt-1`}>{item.label}</span>
                  )}
                </>
              )}
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
        {isReturnPosOrder ? (
          <div className="grid grid-cols-1 xsm:grid-cols-2 gap-2 p-2">
            <CommonButton title="Refund" variant="contained" startIcon={"₹"} onClick={() => handleRefund()} />
            <CommonButton title="Sales Return" variant="contained" startIcon={<RealEstateAgent />} onClick={() => handleSalesReturn()} loading={isAddReturnPosOrderLoading} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 p-2">
            <CommonButton title="Multiple Pay(F12)" variant="contained" startIcon={<VerticalSplitIcon />} onClick={() => handleMultiplePay("print")} />
            <CommonButton title="Redeem Credit" variant="contained" startIcon={<RedeemIcon />} onClick={handleRedeemCredit} />
            <CommonButton title="Hold(F6)" variant="contained" startIcon={<PauseIcon />} onClick={() => handleHoldBill("")} loading={isBtnStatus === "hold"} />
            <CommonButton title="UPI(F5)" variant="contained" startIcon={<FastForwardIcon />} onClick={() => handleUpi("")} loading={isBtnStatus === "upi"} />
            <CommonButton title="Card(F3)" variant="contained" startIcon={<CreditCardIcon />} onClick={() => handleCard("")} />
            <CommonButton title="Cash(F4)" variant="contained" startIcon={<CurrencyRupeeIcon />} onClick={() => handleCash("")} />
            <CommonButton title="Apply Coupon" variant="contained" startIcon={<RedeemIcon />} onClick={handleApplyCoupon} />
            <CommonButton title="Pay Later(F11)" variant="contained" startIcon={<CalendarMonthIcon />} onClick={() => handlePayLater("print")} />
            <CommonButton title="Hold & Print(F7)" variant="contained" startIcon={<PauseIcon />} onClick={() => handleHoldBill("print")} loading={isBtnStatus === "hold-print"} />
            <CommonButton title="UPI & Print(F10)" variant="contained" startIcon={<FastForwardIcon />} onClick={() => handleUpi("print")} loading={isBtnStatus === "upi-print"} />
            <CommonButton title="Card & Print(F9)" variant="contained" startIcon={<CreditCardIcon />} onClick={() => handleCard("print")} />
            <CommonButton title="Cash & Print(F8)" variant="contained" startIcon={<CurrencyRupeeIcon />} onClick={() => handleCash("print")} />
          </div>
        )}
      </div>
      <RedeemCredit />
      <CardDetails />
      <ApplyCoupon />
      <PayLater />
      <Cash />
      <AdditionalCharge />
      <OrderRefund />
    </>
  );
};

export default PosFooter;
