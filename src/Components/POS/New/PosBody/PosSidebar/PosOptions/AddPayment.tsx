import { Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { Queries } from "../../../../../../Api";
import { CommonButton, CommonValidationRadio, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../../../../Attribute";
import { PAYMENT_MODE, PAYMENT_TYPE, VOUCHER_TYPE } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setAddPaymentModal } from "../../../../../../Store/Slices/ModalSlice";
import type { PosPaymentFormValues } from "../../../../../../Types";
import { GenerateOptions } from "../../../../../../Utils";
import { CommonModal } from "../../../../../Common";
import { PosPaymentFormSchema } from "../../../../../../Utils/ValidationSchemas";
// import { Mutations } from "../../../../../../Api";

const AddPayment = () => {
  const { isAddPaymentModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const { data: bankDropdown, isLoading: bankDropdownLoading } = Queries.useGetBankDropdown();
  const { data: contactDropdown, isLoading: contactDropdownLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" }, isAddPaymentModal);
  const { data: accountDropdown, isLoading: accountDropdownLoading } = Queries.useGetAccountDropdown({}, isAddPaymentModal);

  // const { mutate: addPosPayment , isPending: isAddPosPaymentPending} = Mutations.useAddPosPayment();

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
    roundOff: 0,
    amount: 0,
    remark: "",
    accountId: "",
    isNonGST: false,
  };

  const handleSubmit = (values: PosPaymentFormValues) => {
    console.log(values);
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
                        <CommonValidationSelect name="posOrderId" label="Select Sales" options={PAYMENT_TYPE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationSelect name="paymentMode" label="Payment Mode" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                        {showBank && <CommonValidationSelect name="bankId" label="Select Bank" options={GenerateOptions(bankDropdown?.data)} isLoading={bankDropdownLoading} grid={{ xs: 12, sm: 6, md: 4 }} required />}
                        <CommonValidationTextField name="totalAmount" label="Total Payment" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="paidAmount" label="Paid Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="pendingAmount" label="Pending Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="roundOff" label="Kasar" type="number" grid={{ xs: 12, sm: 6, md: 4 }} />
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
                  <CommonButton type="submit" variant="contained" title="Save" />
                  {values.voucherType === "sales" && values.paymentType === "advance" && <CommonButton type="submit" variant="contained" title="Save & Print" />}
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
