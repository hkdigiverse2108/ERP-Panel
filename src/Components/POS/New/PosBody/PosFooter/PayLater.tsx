import { useState } from "react";
import { CommonButton, CommonDatePicker, CommonRadio, CommonSelect } from "../../../../../Attribute";
import { PAYMENT_TERMS, SEND_REMINDER } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setPayLaterModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../Common";
import { Mutations } from "../../../../../Api";
import { RemoveEmptyFields } from "../../../../../Utils";
import { clearPosProduct } from "../../../../../Store/Slices/PosSlice";
import type { PosProductType } from "../../../../../Types";

const DEFAULT_DAYS = 7;

const calculateDueDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const PayLater = () => {
  const dispatch = useAppDispatch();

  const { mutate: addPayLater, isPending: isAddPayLaterPending } = Mutations.useAddPosOrder();

  const { isPayLaterModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);

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

  const handleProceedToPrint = () => {
    if (!PosProduct) return;
    const { ...rest } = PosProduct;
    (["posOrderId"] as const).forEach((field) => delete (rest as Partial<PosProductType>)[field]);

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
      payLater: {
        dueDate: dueDate.toISOString(),
        sendReminder: sendReminder === "yes",
        paymentTerm: paymentTerms[0],
      },
    };
    addPayLater(RemoveEmptyFields(payload), {
      onSuccess: () => {
        dispatch(setPayLaterModal());
        dispatch(clearPosProduct());
      },
    });
  };

  return (
    <CommonModal title="Pay Later" isOpen={isPayLaterModal} onClose={() => dispatch(setPayLaterModal())} className="max-w-[400px]">
      <div className="space-y-5 pe-1 sm:pe-3">
        <div className="flex justify-center">
          <span className="bg-brand-500 text-white px-4 py-2 rounded text-sm font-semibold">Invoice Amount: {Number(PosProduct?.totalAmount || 0).toFixed(2)}</span>
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
        <CommonButton fullWidth title="Proceed to Print" variant="contained" size="small" loading={isAddPayLaterPending} onClick={handleProceedToPrint} />
      </div>
    </CommonModal>
  );
};

export default PayLater;
