import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PauseIcon from "@mui/icons-material/Pause";
import RedeemIcon from "@mui/icons-material/Redeem";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import { Grid } from "@mui/material";
import { CommonButton, CommonTextField, ShowNotification } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setAdditionalChargeModal, setApplyCouponModal, setCardModal, setCashModal, setPayLaterModal, setRedeemCreditModal } from "../../../../../Store/Slices/ModalSlice";
import { setMultiplePay, setRemarks, setFlatDiscountAmount, setRoundOff, clearPosProduct } from "../../../../../Store/Slices/PosSlice";
import AdditionalCharge from "./AdditionalCharge";
import ApplyCoupon from "./ApplyCoupon";
import CardDetails from "./CardDetails";
import Cash from "./Cash";
import PayLater from "./PayLater";
import RedeemCredit from "./RedeemCredit";
import { Mutations } from "../../../../../Api";
import { RemoveEmptyFields } from "../../../../../Utils";
import type { PosProductType } from "../../../../../Types";
import { useMemo } from "react";
import { POS_PAYMENT_METHOD } from "../../../../../Data";

const PosFooter = () => {
  const { PosProduct } = useAppSelector((state) => state.pos);
  const dispatch = useAppDispatch();

  const { mutate: addPosOrder, isPending: addPosOrderLoading } = Mutations.useAddPosOrder();
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
    if (posOrderId) editPosOrder({ ...payload, posOrderId }, { onSuccess: () => dispatch(clearPosProduct()) });
    else addPosOrder(RemoveEmptyFields(payload), { onSuccess: () => dispatch(clearPosProduct()) });
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
    addPosOrder(RemoveEmptyFields(payload), { onSuccess: () => dispatch(clearPosProduct()) });
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
          <CommonButton title="Multiple Pay (F12)" variant="contained" startIcon={<VerticalSplitIcon />} onClick={() => dispatch(setMultiplePay())} />
          <CommonButton title="Redeem Credit" variant="contained" startIcon={<RedeemIcon />} onClick={() => dispatch(setRedeemCreditModal())} />
          <CommonButton title="Hold (F6)" variant="contained" startIcon={<PauseIcon />} onClick={handleHoldBill} loading={addPosOrderLoading || editPosOrderLoading} />
          <CommonButton title="UPI (F5)" variant="contained" startIcon={<FastForwardIcon />} onClick={handleUpi} />
          <CommonButton title="Card (F3)" variant="contained" startIcon={<CreditCardIcon />} onClick={handleCard} />
          <CommonButton title="Cash (F4)" variant="contained" startIcon={<CurrencyRupeeIcon />} onClick={handleCash} />
          <CommonButton title="Apply Coupon" variant="contained" startIcon={<RedeemIcon />} onClick={() => dispatch(setApplyCouponModal())} />
          <CommonButton title="Pay Later (F11)" variant="contained" startIcon={<CalendarMonthIcon />} onClick={handlePayLater} />
          <CommonButton title="Hold & Print (F7)" variant="contained" startIcon={<PauseIcon />} />
          <CommonButton title="UPI & Print (F10)" variant="contained" startIcon={<FastForwardIcon />} />
          <CommonButton title="Card & Print (F9)" variant="contained" startIcon={<CreditCardIcon />} />
          <CommonButton title="Cash & Print (F8)" variant="contained" startIcon={<CurrencyRupeeIcon />} />
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
