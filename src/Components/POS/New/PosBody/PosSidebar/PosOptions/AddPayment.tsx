import { Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers } from "formik";
import { Queries } from "../../../../../../Api";
import { CommonButton, CommonValidationRadio, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../../../../Attribute";
import { PAYMENT_MODE, PAYMENT_TYPE, VOUCHER_TYPE } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setAddPaymentModal } from "../../../../../../Store/Slices/ModalSlice";
import type { PosPaymentFormValues } from "../../../../../../Types";
import { GenerateOptions, RemoveEmptyFields } from "../../../../../../Utils";
import { CommonModal } from "../../../../../Common";
import { PosPaymentFormSchema } from "../../../../../../Utils/ValidationSchemas";
import { useEffect } from "react";
import { Mutations } from "../../../../../../Api";

const AddPayment = () => {
  const { isAddPaymentModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const { data: bankDropdown, isLoading: bankDropdownLoading } = Queries.useGetBankDropdown();
  const { data: contactDropdown, isLoading: contactDropdownLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" }, isAddPaymentModal);
  const { data: accountDropdown, isLoading: accountDropdownLoading } = Queries.useGetAccountDropdown({}, isAddPaymentModal);

  const { mutate: addPosPayment, isPending: isAddPosPaymentPending } = Mutations.useAddPosPayment();

  const initialValues: PosPaymentFormValues = {
    voucherType: VOUCHER_TYPE[0].value,
    paymentType: PAYMENT_TYPE[1].value,
    partyId: "",
    posOrderId: "",
    paymentMode: "",
    bankId: "",
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    kasar: 0,
    amount: 0,
    remark: "",
    accountId: "",
    isNonGST: false,
  };

  const handleSubmit = (values: PosPaymentFormValues, { resetForm }: FormikHelpers<PosPaymentFormValues>) => {
    const payload =
      values.voucherType === VOUCHER_TYPE[0].value
        ? {
            paymentType: values.paymentType,
            paymentMode: values.paymentMode,
            bankId: values.bankId,
            amount: values.amount,
            ...(values.paymentType === PAYMENT_TYPE[1].value && {
              posOrderId: values.posOrderId,
              totalAmount: values.totalAmount,
              paidAmount: values.paidAmount,
              pendingAmount: values.pendingAmount,
              kasar: values.kasar,
            }),
          }
        : {
            accountId: values.accountId,
            isNonGST: values.isNonGST,
            amount: values.amount,
          };

    const finalPayload = RemoveEmptyFields({ ...payload, partyId: values.partyId, remark: values.remark, voucherType: values.voucherType });

    const onSuccess = () => {
      resetForm();
      dispatch(setAddPaymentModal());
    };
    addPosPayment(finalPayload, { onSuccess });
  };

  const PosOrderDetails = () => {
    const { values, setFieldValue } = useFormikContext<PosPaymentFormValues>();
    const { data: posOrderDropdown, isLoading: posOrderDropdownLoading } = Queries.useGetPosOrderDropdown({ customerFilter: values.partyId, duePaymentFilter: true }, Boolean(values.partyId));
    const selectedPosOrder = posOrderDropdown?.data?.find((item) => item._id === values.posOrderId);
    useEffect(() => {
      if (selectedPosOrder) {
        setFieldValue("totalAmount", selectedPosOrder.totalAmount ?? 0);
        setFieldValue("paidAmount", selectedPosOrder.paidAmount ?? 0);
        setFieldValue("pendingAmount", selectedPosOrder.dueAmount ?? 0);
      } else {
        setFieldValue("totalAmount", 0);
        setFieldValue("paidAmount", 0);
        setFieldValue("pendingAmount", 0);
      }
    }, [selectedPosOrder, setFieldValue]);
    useEffect(() => {
      setFieldValue("amount", (values.pendingAmount ?? 0) - (values.kasar ?? 0));
    }, [values.pendingAmount, values.kasar, setFieldValue]);
    useEffect(() => {
      const pending = Number(values.pendingAmount ?? 0);
      let kasar = Number(values.kasar ?? 0);
      let amount = Number(values.amount ?? 0);

      if (kasar + amount > pending) {
        amount = pending - kasar;

        if (amount < 0) {
          amount = 0;
          kasar = pending;
          setFieldValue("kasar", kasar);
        }

        setFieldValue("amount", amount);
      }
    }, [values.amount, values.kasar, values.pendingAmount, setFieldValue]);

    return <CommonValidationSelect name="posOrderId" label="Select Sales" disabled={!values.partyId} options={GenerateOptions(posOrderDropdown?.data)} isLoading={posOrderDropdownLoading} grid={{ xs: 12, sm: 6, md: 4 }} required />;
  };

  return (
    <CommonModal title="Payments" isOpen={isAddPaymentModal} onClose={() => dispatch(setAddPaymentModal())} className="max-w-[1000px]">
      <Formik<PosPaymentFormValues> enableReinitialize initialValues={initialValues} onSubmit={handleSubmit} validationSchema={PosPaymentFormSchema}>
        {({ values }) => {
          const showBank = values.paymentMode && values.paymentMode !== "cash";
          return (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonValidationRadio name="voucherType" label="Select Voucher Type" options={VOUCHER_TYPE} grid={12} />
                {values?.voucherType === "sales" && (
                  <>
                    <CommonValidationRadio name="paymentType" label="Select Payment Type" options={PAYMENT_TYPE} grid={12} />
                    <CommonValidationSelect name="partyId" label="Select Party Name" options={GenerateOptions(contactDropdown?.data)} isLoading={contactDropdownLoading} grid={{ xs: 12, sm: 6, md: values.paymentType === "advance" ? 6 : 4 }} required />
                    {values.paymentType === "advance" ? (
                      <>
                        <CommonValidationSelect name="paymentMode" label="Payment Mode" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6 }} required />
                        {showBank && <CommonValidationSelect name="bankId" label="Select Bank" options={GenerateOptions(bankDropdown?.data)} isLoading={bankDropdownLoading} grid={{ xs: 12, sm: 6 }} required />}
                        <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 6 }} required />
                        <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12 }} multiline />
                      </>
                    ) : (
                      <>
                        <PosOrderDetails />
                        <CommonValidationSelect name="paymentMode" label="Payment Mode" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                        {showBank && <CommonValidationSelect name="bankId" label="Select Bank" options={GenerateOptions(bankDropdown?.data)} isLoading={bankDropdownLoading} grid={{ xs: 12, sm: 6, md: 4 }} required />}
                        <CommonValidationTextField name="totalAmount" label="Total Payment" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="paidAmount" label="Paid Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="pendingAmount" label="Pending Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="kasar" label="Kasar" type="number" grid={{ xs: 12, sm: 6, md: 4 }} />
                        <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12 }} multiline />
                      </>
                    )}
                  </>
                )}
                {values.voucherType === "expense" && (
                  <>
                    <CommonValidationSelect name="partyId" label="Select Party Name" options={GenerateOptions(contactDropdown?.data)} isLoading={contactDropdownLoading} grid={{ xs: 12, sm: 6, md: 4 }} required />
                    <CommonValidationSelect name="accountId" label="Account" options={GenerateOptions(accountDropdown?.data)} isLoading={accountDropdownLoading} grid={{ xs: 12, sm: 6, md: 4 }} required />
                    <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} required />
                    <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12 }} multiline />
                    <CommonValidationSwitch name="isNonGST" label="Non-GST" grid={{ xs: 12, md: 6 }} />
                  </>
                )}
                <Grid sx={{ display: "flex", justifyContent: "center", gap: 2 }} size={12}>
                  <CommonButton type="submit" variant="contained" title="Save" loading={isAddPosPaymentPending} />
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </CommonModal>
  );
};

export default AddPayment;
