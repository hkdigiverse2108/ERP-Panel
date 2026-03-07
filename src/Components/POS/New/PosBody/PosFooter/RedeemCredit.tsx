import { CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Mutations, Queries } from "../../../../../Api";
import { CommonButton, CommonRadio, CommonSelect, CommonTextField } from "../../../../../Attribute";
import { REDEEM_CREDIT_TYPE } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setRedeemCreditModal } from "../../../../../Store/Slices/ModalSlice";
import { setHandleDiscount, setRedeemCredit, setTotalAmount, setTotalDiscount } from "../../../../../Store/Slices/PosSlice";
import { FormatDate } from "../../../../../Utils";
import { CommonModal } from "../../../../Common";

const RedeemCredit = () => {
  const dispatch = useAppDispatch();
  const { isRedeemCreditModal } = useAppSelector((state) => state.modal);
  const { PosProduct } = useAppSelector((state) => state.pos);

  const [type, setType] = useState<string>("credit_note");
  const [creditNoteId, setCreditNoteId] = useState<string>("");
  const totalAmount = Number(PosProduct?.totalAmount) + Number(PosProduct?.loyaltyDiscount || 0) + Number(PosProduct?.couponDiscount || 0);
  const [isDetails, setDetails] = useState({ id: "", date: "N/A", amount: "0.00", available: "0.00", apply: "0.00", payable: totalAmount?.toString() });

  const { data: posCreditNoteDropdown, isLoading: isPosCreditNoteDropdownLoading, isFetching: isPosCreditNoteDropdownFetching } = Queries.useGetPosCreditNoteRedeemDropdown({ typeFilter: type, customerFilter: PosProduct?.customerId }, Boolean(PosProduct?.customerId));

  const { mutate: redeemCreditNote, isPending: isPosCustomerDetailPending } = Mutations.useRedeemCreditNote();

  const prevTotalAmountRef = useRef<number | undefined>(undefined);
  const editRecalcDoneRef = useRef<string | null>(null);
  const editLoadedRef = useRef<boolean>(false);

  const posCreditNoteDropdownOptions = posCreditNoteDropdown?.data?.map((item) => ({ label: item.no, value: item.id }));

  const render = (value: string | number) => (isPosCustomerDetailPending ? <CircularProgress color="primary" size={10} className="mr-2!" /> : value);

  useEffect(() => {
    const currentAmount = PosProduct?.totalAmount;
    const isEditMode = Boolean(PosProduct.posOrderId);

    if (prevTotalAmountRef.current === undefined) {
      prevTotalAmountRef.current = currentAmount;
      return;
    }

    if (isEditMode) {
      if (!editLoadedRef.current) {
        editLoadedRef.current = true;
        prevTotalAmountRef.current = currentAmount;
        return;
      }
      if (prevTotalAmountRef.current !== currentAmount) {
        dispatch(setRedeemCredit({ redeemCreditId: "", redeemCreditAmount: 0, redeemCreditType: "" }));
        setDetails({ id: "", date: "N/A", amount: "0.00", available: "0.00", apply: "0.00", payable: "0.00" });
        setCreditNoteId("");
      }
    } else {
      editLoadedRef.current = false;
      if (prevTotalAmountRef.current !== currentAmount) {
        dispatch(setRedeemCredit({ redeemCreditId: "", redeemCreditAmount: 0, redeemCreditType: "" }));
        setDetails({ id: "", date: "N/A", amount: "0.00", available: "0.00", apply: "0.00", payable: "0.00" });
        setCreditNoteId("");
      }
    }

    prevTotalAmountRef.current = currentAmount;
  }, [PosProduct?.totalAmount, PosProduct.posOrderId, dispatch]);

  useEffect(() => {
    const isEditMode = Boolean(PosProduct.posOrderId);

    if (!isEditMode) {
      editRecalcDoneRef.current = null;
      return;
    }

    if (editRecalcDoneRef.current === PosProduct.posOrderId) return;
    editRecalcDoneRef.current = PosProduct.posOrderId;

    const finalDiscount = Number(PosProduct.totalDiscount || 0);
    const payableAmount = Number(totalAmount || 0) - finalDiscount;
    dispatch(setTotalDiscount(Number(finalDiscount).toFixed(2)));
    if (!isEditMode) dispatch(setTotalAmount(payableAmount));
    else dispatch(setTotalAmount(totalAmount));

    prevTotalAmountRef.current = payableAmount;
  }, [PosProduct.posOrderId, dispatch]);

  const isCredit = type === "credit_note";
  const creditDetails = [
    { label: `${isCredit ? "Credit Note" : "Adv Payment"} Date`, value: FormatDate(isDetails.date) || "N/A" }, //
    { label: `${isCredit ? "Credit " : "Adv Payment"} Amount`, value: isDetails.amount },
    { label: `${isCredit ? "Credit " : "Amount "} Available`, value: isDetails.available },
    { label: `Apply ${isCredit ? "Credit" : "Amount"}` },
  ];

  const handleTypeChange = (value: string) => {
    setType(value);
    setCreditNoteId("");
    setDetails({ id: "", date: "N/A", amount: "0.00", available: "0.00", apply: "0.00", payable: totalAmount?.toString() });
  };

  const handleRedeemCredit = async (e: string[]) => {
    setCreditNoteId(e[0]);
    const code = posCreditNoteDropdown?.data?.find((item) => item.id === e[0]);
    if (code) {
      const payload = {
        code: code?.no,
        type: type,
        customerId: PosProduct?.customerId,
      };
      await redeemCreditNote(payload, {
        onSuccess: (data) => {
          const redeemableTotalAmount = data?.data?.totalAmount?.toFixed(2);
          const redeemableAmount = data?.data?.redeemableAmount?.toFixed(2);
          const payableAmount = Number(totalAmount) - Number(redeemableAmount);
          const payable = payableAmount >= 0 ? payableAmount?.toFixed(2) : "0.00";
          setDetails((prev) => ({ ...prev, id: data?.data?.id, date: data?.data?.date, amount: redeemableTotalAmount, available: redeemableAmount, apply: redeemableAmount, payable: payable }));
        },
      });
    } else {
      setDetails({ id: "", date: "N/A", amount: "0.00", available: "0.00", apply: "0.00", payable: totalAmount?.toString() });
    }
  };

  const handleClose = () => {
    dispatch(setRedeemCreditModal());
  };

  const handleApplyCredit = () => {
    if (PosProduct.loyaltyId || PosProduct.couponId) dispatch(setHandleDiscount("redeemCredit"));

    dispatch(setRedeemCredit({ redeemCreditId: isDetails.id, redeemCreditAmount: Number(isDetails.apply), redeemCreditType: type }));
    const payableAmount = totalAmount - Number(isDetails.apply);
    const payable = payableAmount >= 0 ? payableAmount?.toFixed(2) : "0.00";
    dispatch(setTotalAmount(Number(payable)));

    prevTotalAmountRef.current = Number(payable);
    handleClose();
  };

  const handleRemoveCredit = () => {
    dispatch(setRedeemCredit({ redeemCreditId: "", redeemCreditAmount: 0, redeemCreditType: "" }));
    dispatch(setTotalAmount(Number(totalAmount) + Number(isDetails.apply)));
    setCreditNoteId("");
    setDetails({ id: "", date: "N/A", amount: "0.00", available: "0.00", apply: "0.00", payable: (Number(totalAmount) + Number(isDetails.apply))?.toFixed(2) });
  };

  return (
    <CommonModal title="Redeem Credit" isOpen={isRedeemCreditModal} onClose={handleClose} className="max-w-[400px]">
      <div className="space-y-3">
        {/* Type Selection */}
        <div className="flex justify-center">
          <CommonRadio value={type} onChange={handleTypeChange} options={REDEEM_CREDIT_TYPE} />
        </div>

        {/* Invoice Balance */}
        <div className="flex justify-center">
          <span className="bg-brand-500 text-white px-4 py-2 rounded text-sm font-semibold">Invoice Balance: {totalAmount}</span>
        </div>

        {/* Scan / Input */}
        <div>
          <CommonSelect label={isCredit ? "Sales Return" : "Advance Payment"} value={[creditNoteId]} options={posCreditNoteDropdownOptions || []} disabled={!!PosProduct?.redeemCreditId} isLoading={isPosCreditNoteDropdownLoading || isPosCreditNoteDropdownFetching} onChange={handleRedeemCredit} />
        </div>

        {/* Credit Details */}
        <div>
          {creditDetails.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm py-1">
              <span className="font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
              {item.value ? (
                <span className="font-medium dark:text-gray-200">{render(item.value)} </span>
              ) : (
                <div className="w-1/2">
                  <CommonTextField
                    value={isDetails.apply}
                    type="number"
                    disabled={!!PosProduct?.redeemCreditId}
                    onChange={(e) => {
                      const inputValue = Number(e);
                      const availableAmount = Number(isDetails.available);
                      const finalApply = inputValue > availableAmount ? availableAmount : inputValue < 0 ? 0 : inputValue;

                      const payableAmount = Number(totalAmount) - finalApply;

                      setDetails((prev) => ({
                        ...prev,
                        apply: finalApply?.toString(),
                        payable: payableAmount >= 0 ? payableAmount?.toFixed(2) : "0.00",
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Apply Credit */}

        {/* Payable Amount */}
        <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-700 pt-2">
          <span className="text-lg font-semibold dark:text-gray-200">₹ Payable Amt</span>
          <span className="text-lg font-bold dark:text-gray-200">{isDetails.payable}</span>
        </div>

        {/* Action Button */}
        {PosProduct?.redeemCreditId ? <CommonButton title="Remove Credit" variant="contained" fullWidth onClick={handleRemoveCredit} /> : <CommonButton title="Apply Credit" variant="contained" disabled={!creditNoteId || !!PosProduct?.redeemCreditId || isPosCustomerDetailPending} fullWidth onClick={handleApplyCredit} />}
      </div>
    </CommonModal>
  );
};

export default RedeemCredit;
