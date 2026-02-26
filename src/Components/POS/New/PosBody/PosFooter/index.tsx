import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PauseIcon from "@mui/icons-material/Pause";
import RedeemIcon from "@mui/icons-material/Redeem";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import { Grid } from "@mui/material";
import { useMemo } from "react";
import { Mutations } from "../../../../../Api";
import { CommonButton, CommonTextField, ShowNotification } from "../../../../../Attribute";
import { POS_PAYMENT_METHOD } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setAdditionalChargeModal, setApplyCouponModal, setCardModal, setCashModal, setPayLaterModal, setRedeemCreditModal } from "../../../../../Store/Slices/ModalSlice";
import { clearPosProduct, setBtnStatus, setFlatDiscountAmount, setMultiplePay, setRemarks, setRoundOff } from "../../../../../Store/Slices/PosSlice";
import type { PosProductType } from "../../../../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../../../../Utils";
import AdditionalCharge from "./AdditionalCharge";
import ApplyCoupon from "./ApplyCoupon";
import CardDetails from "./CardDetails";
import Cash from "./Cash";
import PayLater from "./PayLater";
import RedeemCredit from "./RedeemCredit";

const PosFooter = () => {
  const { PosProduct, isBtnStatus } = useAppSelector((state) => state.pos);
  const dispatch = useAppDispatch();

  const { mutate: addPosOrder } = Mutations.useAddPosOrder();
  const { mutate: editPosOrder, isPending: editPosOrderLoading } = Mutations.useEditPosOrder();

  const summaryRowData = [
    { label: "Quantity", value: PosProduct.totalQty }, //totalQty
    { label: "MRP", value: PosProduct.totalMrp }, //totalMrp
    { label: "Tax Amount", value: PosProduct.totalTaxAmount }, //totalTaxAmount
    { label: "Add Charges+", value: PosProduct.totalAdditionalCharge }, //totalAdditionalCharge
    { label: "Discount", value: PosProduct.totalDiscount }, //totalDiscount
    { label: "Flat Discount" }, //flatDiscountAmount
    { label: "Round OFF" },
    { label: "Amount", value: PosProduct.totalAmount, highlight: true },
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

  const handleHoldBill = () => {
    if (!validate()) return;
    const { posOrderId, ...rest } = PosProduct;
    const payload = {
      ...rest,
      items: mappedItems,
      status: "hold",
    };
    dispatch(setBtnStatus("hold"));
    const onSuccess = () => {
      dispatch(clearPosProduct());
      dispatch(setBtnStatus(""));
    };
    const onError = () => {
      dispatch(setBtnStatus(""));
    };
    const changedFields = GetChangedFields(payload, PosProduct);
    if (posOrderId) editPosOrder({ ...changedFields, posOrderId }, { onSuccess, onError });
    else addPosOrder(RemoveEmptyFields(payload), { onSuccess, onError });
  };

  const handleUpi = () => {
    if (!validate(true)) return;
    const { ...rest } = PosProduct;
    (["posOrderId"] as const).forEach((field) => delete (rest as Partial<PosProductType>)[field]);

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
    dispatch(setBtnStatus("upi"));
    const onSuccess = () => {
      dispatch(clearPosProduct());
      dispatch(setBtnStatus(""));
    };
    const onError = () => {
      dispatch(setBtnStatus(""));
    };
    addPosOrder(RemoveEmptyFields(payload), { onSuccess, onError });
  };

  const handlePayLater = () => {
    if (!validate(true)) return;
    dispatch(setPayLaterModal({ open: true, data: [] }));
  };

  const handleCard = () => {
    if (!validate(true)) return;
    dispatch(setCardModal());
  };

  const handleCash = () => {
    if (!validate(true)) return;
    dispatch(setCashModal());
  };

  const handleMultiplePay = () => {
    if (!validate(true)) return;
    dispatch(setMultiplePay());
  };

  const handleApplyCoupon = () => {
    if (!validate(true)) return;
    dispatch(setApplyCouponModal());
  };

  const handleRedeemCredit = () => {
    if (!validate(true)) return;
    dispatch(setRedeemCreditModal());
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
              {item.label === "Flat Discount" && <CommonTextField label="Flat Discount" value={PosProduct.flatDiscountAmount} onChange={(e) => dispatch(setFlatDiscountAmount(e))} isCurrency currencyDisabled />}
              {item.label === "Round OFF" && <CommonTextField label="Round OFF" value={PosProduct.roundOff} onChange={(e) => dispatch(setRoundOff(e))} />}
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
        <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 p-2">
          <CommonButton title="Multiple Pay" variant="contained" startIcon={<VerticalSplitIcon />} onClick={handleMultiplePay} />
          <CommonButton title="Redeem Credit" variant="contained" startIcon={<RedeemIcon />} onClick={handleRedeemCredit} />
          <CommonButton title="Hold" variant="contained" startIcon={<PauseIcon />} onClick={handleHoldBill} loading={isBtnStatus === "hold" || editPosOrderLoading} />
          <CommonButton title="UPI" variant="contained" startIcon={<FastForwardIcon />} onClick={handleUpi} loading={isBtnStatus === "upi"} />
          <CommonButton title="Card" variant="contained" startIcon={<CreditCardIcon />} onClick={handleCard} />
          <CommonButton title="Cash" variant="contained" startIcon={<CurrencyRupeeIcon />} onClick={handleCash} />
          <CommonButton title="Apply Coupon" variant="contained" startIcon={<RedeemIcon />} onClick={handleApplyCoupon} />
          <CommonButton title="Pay Later" variant="contained" startIcon={<CalendarMonthIcon />} onClick={handlePayLater} />
          <CommonButton title="Hold & Print" variant="contained" startIcon={<PauseIcon />} />
          <CommonButton title="UPI & Print" variant="contained" startIcon={<FastForwardIcon />} />
          <CommonButton title="Card & Print" variant="contained" startIcon={<CreditCardIcon />} />
          <CommonButton title="Cash & Print" variant="contained" startIcon={<CurrencyRupeeIcon />} />
        </div>
      </div>
      <RedeemCredit />
      <CardDetails />
      <ApplyCoupon />
      <PayLater />
      <Cash />
      <AdditionalCharge />
    </>
  );
};

export default PosFooter;
