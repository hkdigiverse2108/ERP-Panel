import { Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { Mutations, Queries } from "../../../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../../../Attribute";
import { POS_PAYMENT_METHOD } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setCardModal } from "../../../../../Store/Slices/ModalSlice";
import { clearPosProduct } from "../../../../../Store/Slices/PosSlice";
import { GenerateOptions, RemoveEmptyFields } from "../../../../../Utils";
import { CardDetailsSchema } from "../../../../../Utils/ValidationSchemas";
import { CommonModal } from "../../../../Common";

const CardDetails = () => {
  const { isCardModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { PosProduct } = useAppSelector((state) => state.pos);

  const { data: bankDropdown, isLoading: bankDropdownLoading } = Queries.useGetBankDropdown();

  const { mutate: addPosOrder, isPending: addPosOrderLoading } = Mutations.useAddPosOrder();
  const { mutate: editPosOrder, isPending: editPosOrderLoading } = Mutations.useEditPosOrder();

  const initialValues = {
    paymentAccountId: "",
    amount: PosProduct.totalAmount,
    cardHolderName: "",
    cardTransactionNo: "",
  };

  const handleClose = () => dispatch(setCardModal());

  const handleSubmit = (values: typeof initialValues) => {
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
      paymentMethod: POS_PAYMENT_METHOD.CARD,
      multiplePayments: [
        {
          method: "card",
          paymentAccountId: values.paymentAccountId,
          amount: values.amount,
          cardHolderName: values.cardHolderName,
          cardTransactionNo: values.cardTransactionNo,
        },
      ],
    };
    const onSuccess = () => {
      dispatch(clearPosProduct());
      handleClose();
    };
    const onError = () => {
      handleClose();
    };
    const changedFields = RemoveEmptyFields(payload);
    if (posOrderId) editPosOrder({ ...changedFields, posOrderId }, { onSuccess, onError });
    else addPosOrder(RemoveEmptyFields(payload), { onSuccess, onError });
  };

  return (
    <CommonModal title="Card Details" isOpen={isCardModal} onClose={() => handleClose()} className="max-w-[400px]">
      <Formik enableReinitialize initialValues={initialValues} validationSchema={CardDetailsSchema} onSubmit={handleSubmit}>
        <Form noValidate>
          <Grid container spacing={2} py={1}>
            <CommonValidationSelect name="paymentAccountId" label="Payment Account" options={GenerateOptions(bankDropdown?.data)} disabled={bankDropdownLoading} grid={12} required />
            <CommonValidationTextField name="amount" label="Card Payment Amount" grid={12} required />
            <CommonValidationTextField name="cardHolderName" label="Card Holder Name" grid={12} required />
            <CommonValidationTextField name="cardTransactionNo" label="Card Transaction No." grid={12} required />
            <Grid size={12} sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <CommonButton type="submit" variant="contained" title="Finalize Payment" loading={addPosOrderLoading || editPosOrderLoading} />
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </CommonModal>
  );
};

export default CardDetails;
