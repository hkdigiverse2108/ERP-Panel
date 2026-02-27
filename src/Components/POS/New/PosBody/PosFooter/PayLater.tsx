import { useState } from "react";
import { Mutations } from "../../../../../Api";
import { CommonButton, CommonDatePicker, CommonRadio, CommonSelect } from "../../../../../Attribute";
import { PAYMENT_TERMS, POS_PAYMENT_METHOD, SEND_REMINDER } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setPayLaterModal } from "../../../../../Store/Slices/ModalSlice";
import { clearPosProduct, setMultiplePay } from "../../../../../Store/Slices/PosSlice";
import { RemoveEmptyFields } from "../../../../../Utils";
import { CommonModal } from "../../../../Common";

const DEFAULT_DAYS = 7;

const calculateDueDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const PayLater = () => {
  const dispatch = useAppDispatch();

  const { mutate: addPayLater, isPending: isAddPayLaterPending } = Mutations.useAddPosOrder();
  const { mutate: editPosOrder, isPending: editPosOrderLoading } = Mutations.useEditPosOrder();

  const { isPayLaterModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);
  const multiplePayments = isPayLaterModal?.data;
  const totalAmount = multiplePayments?.reduce((total, pay) => total + (pay.amount ? Number(pay.amount) : 0), 0);
  const balanceAmount = PosProduct.totalAmount - totalAmount;

  const [paymentTerms, setPaymentTerms] = useState<string[]>(["7_days"]);
  const [sendReminder, setSendReminder] = useState<string>("yes");
  const [dueDate, setDueDate] = useState<Date>(() => calculateDueDate(DEFAULT_DAYS));

  const handlePaymentTermsChange = (v: string[]) => {
    setPaymentTerms(v);

    if (v?.length) {
      const days = Number(v[0].split("_")[0]);
      setDueDate(calculateDueDate(days));
    }
  };

  const handleClose = () => {
    dispatch(setPayLaterModal({ open: false, data: [] }));
  };

  const handleProceedToPrint = () => {
    if (!PosProduct) return;
    const { posOrderId, ...rest } = PosProduct;
    const payload = {
      ...rest,
      items: rest.items.map((item) => ({
        productId: item?._id,
        qty: item?.posQty,
        mrp: item?.mrp,
        discountAmount: item?.discount,
        additionalDiscountAmount: item?.additionalDiscount,
        unitCost: item?.unitCost,
        netAmount: item?.netAmount,
      })),
      paymentMethod: multiplePayments?.length ? POS_PAYMENT_METHOD.MULTI_PAY : POS_PAYMENT_METHOD.PAY_LATER,
      ...(multiplePayments?.length && { multiplePayments: multiplePayments?.length ? multiplePayments : [] }),
      payLater: {
        dueDate: dueDate.toISOString(),
        sendReminder: sendReminder === "yes",
        paymentTerm: paymentTerms[0],
      },
    };
    const onSuccess = () => {
      dispatch(clearPosProduct());
      handleClose();
      if (multiplePayments?.length) dispatch(setMultiplePay());
    };
    const onError = () => {
      handleClose();
    };
    const changedFields = RemoveEmptyFields(payload);
    if (posOrderId) editPosOrder({ ...changedFields, posOrderId }, { onSuccess, onError });
    else addPayLater(RemoveEmptyFields(payload), { onSuccess, onError });
  };

  return (
    <CommonModal title="Pay Later" isOpen={isPayLaterModal.open} onClose={handleClose} className="max-w-[400px]">
      <div className="space-y-5 pe-1 sm:pe-3">
        <div className="flex justify-center">
          <span className="bg-brand-500 text-white px-4 py-2 rounded text-sm font-semibold">Invoice Amount: {Number(multiplePayments?.length ? balanceAmount : PosProduct?.totalAmount || 0).toFixed(2)}</span>
        </div>
        {/* Payment Terms */}
        <div>
          <CommonSelect label="Payment Terms" options={PAYMENT_TERMS} value={paymentTerms} limitTags={1} onChange={handlePaymentTermsChange} />{" "}
        </div>

        {/* Due Date */}
        <div>
          <CommonDatePicker name="dueDate" label="Due Date" value={dueDate} onChange={(v) => v && setDueDate(v)} disabled />
        </div>

        {/* Send Reminder */}
        <div>
          <CommonRadio label="Send Reminder" value={sendReminder} onChange={setSendReminder} options={SEND_REMINDER} />{" "}
        </div>
        <CommonButton fullWidth title="Proceed to Print" variant="contained" size="small" loading={isAddPayLaterPending || editPosOrderLoading} onClick={handleProceedToPrint} />
      </div>
    </CommonModal>
  );
};

export default PayLater;
