import { useState } from "react";
import { CommonButton, CommonDatePicker, CommonRadio, CommonSelect } from "../../../../../Attribute";
import { PAYMENT_TERMS, SEND_REMINDER } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setPayLaterModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../Common";

const DEFAULT_DAYS = 7;

const calculateDueDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const PayLater = () => {
  const dispatch = useAppDispatch();

  const { isPayLaterModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);

  const [paymentTerms, setPaymentTerms] = useState<string[]>(["7_days"]);
  const [sendReminder, setSendReminder] = useState<string>("yes");
  const [dueDate, setDueDate] = useState<Date>(() => calculateDueDate(DEFAULT_DAYS));

  if (!PosProduct) return null;
  const handlePaymentTermsChange = (v: string[]) => {
    setPaymentTerms(v);

    if (v?.length) {
      const days = Number(v[0].split("_")[0]);
      setDueDate(calculateDueDate(days));
    }
  };

  const handleProceedToPrint = () => {
    const payload = {
      customerId: PosProduct?.customerId,
      totalAmount: PosProduct?.totalAmount,
      paidAmount: 0,
      dueAmount: PosProduct?.totalAmount,
      status: "open",
      dueDate: dueDate.toISOString(),
      sendReminder: sendReminder === "yes",
    };

    console.log(payload);
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
        <CommonButton fullWidth title="Proceed to Print" variant="contained" size="small" onClick={handleProceedToPrint} />
      </div>
    </CommonModal>
  );
};

export default PayLater;
