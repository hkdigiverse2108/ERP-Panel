import { Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useMemo, useState } from "react";
import { Mutations, Queries } from "../../../../../../Api";
import { CommonButton, CommonValidationDatePicker, CommonValidationRadio, CommonValidationSelect, CommonValidationTextField } from "../../../../../../Attribute";
import { PAYMENT_MODE, PAYMENT_TYPE, VOUCHER_TYPE } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setAddPaymentModal, setSelectedFiles, setUploadModal } from "../../../../../../Store/Slices/ModalSlice";
import type { ImageSyncProps, PosPaymentFormValues } from "../../../../../../Types";
import { DateConfig, GenerateOptions, RemoveEmptyFields } from "../../../../../../Utils";
import { PosPaymentFormSchema } from "../../../../../../Utils/ValidationSchemas";
import { CommonModal } from "../../../../../Common";
import { CommonFormImageBox } from "../../../../../Common/CommonUploadImage/CommonImageBox";

const AddPayment = () => {
  const { isAddPaymentModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const [activeImageKey, setActiveImageKey] = useState<"image" | null>(null);

  const { data: bankDropdown, isLoading: bankDropdownLoading } = Queries.useGetBankDropdown();
  const { data: contactDropdown, isLoading: contactDropdownLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" }, isAddPaymentModal);

  const { mutate: addPosPayment, isPending: isAddPosPaymentPending } = Mutations.useAddPosPayment();
  const { mutate: addExpense, isPending: isAddExpensePending } = Mutations.useAddExpense();

  const initialValues = useMemo<PosPaymentFormValues>(
    () => ({
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
      isNonGST: false,
      fromDate: DateConfig.utc().toISOString(),
      image: "",
    }),
    [],
  );

  const FormikImageSync = <T extends FormikValues>({ activeKey, clearActiveKey }: ImageSyncProps) => {
    const { selectedFiles } = useAppSelector((state) => state.modal);
    const dispatch = useAppDispatch();
    const { setFieldValue } = useFormikContext<T>();

    useEffect(() => {
      if (!selectedFiles[0] || !activeKey) return;
      setFieldValue(activeKey, selectedFiles[0]);

      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, dispatch, clearActiveKey]);

    return null;
  };

  const handleUpload = () => {
    setActiveImageKey("image");
    dispatch(setUploadModal({ open: true, type: "image" }));
  };

  const handleSubmit = (values: PosPaymentFormValues, { resetForm }: FormikHelpers<PosPaymentFormValues>) => {
    const payload =
      values.voucherType === VOUCHER_TYPE[0].value
        ? {
            partyId: values.partyId,
            remark: values.remark,
            voucherType: values.voucherType,
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
            amount: values.amount,
            total: values.amount,
            description: values.remark,
            partyId: values.partyId,
            type: values.voucherType,
            fromDate: values.fromDate,
            image: values.image,
          };

    const finalPayload = RemoveEmptyFields(payload);
    const onSuccess = () => {
      resetForm();
      dispatch(setAddPaymentModal());
    };
    if (values.voucherType === VOUCHER_TYPE[0].value) {
      addPosPayment(finalPayload, { onSuccess });
    } else {
      addExpense(finalPayload, { onSuccess });
    }
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

  const ResetFieldsOnChange = () => {
    const { values, setFieldValue } = useFormikContext<PosPaymentFormValues>();

    // voucherType change
    useEffect(() => {
      setFieldValue("partyId", "");
      setFieldValue("posOrderId", "");
      setFieldValue("paymentMode", "");
      setFieldValue("bankId", "");
      setFieldValue("totalAmount", 0);
      setFieldValue("paidAmount", 0);
      setFieldValue("pendingAmount", 0);
      setFieldValue("kasar", 0);
      setFieldValue("amount", 0);
      setFieldValue("remark", "");
    }, [values.voucherType]);

    // paymentType change
    useEffect(() => {
      setFieldValue("posOrderId", "");
      setFieldValue("totalAmount", 0);
      setFieldValue("paidAmount", 0);
      setFieldValue("pendingAmount", 0);
      setFieldValue("kasar", 0);
      setFieldValue("amount", 0);
    }, [values.paymentType]);

    return null;
  };

  return (
    <CommonModal title="Payments" isOpen={isAddPaymentModal} onClose={() => dispatch(setAddPaymentModal())} className="max-w-[1000px]">
      <Formik<PosPaymentFormValues> enableReinitialize initialValues={initialValues} onSubmit={handleSubmit} validationSchema={PosPaymentFormSchema}>
        {({ values, setFieldValue }) => {
          const showBank = values.paymentMode && values.paymentMode !== "cash";
          return (
            <Form noValidate>
              <ResetFieldsOnChange />
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
                    <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />
                    <CommonValidationSelect name="partyId" label="Select Party Name" options={GenerateOptions(contactDropdown?.data)} isLoading={contactDropdownLoading} grid={{ xs: 12, sm: 6, md: 4 }} required />
                    <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} required />
                    <CommonValidationDatePicker name="fromDate" label="from Date" grid={{ xs: 12, sm: 6, md: 4 }} />
                    <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12 }} multiline />
                    <CommonFormImageBox name="image" label="Image" type="image" grid={{ xs: 12 }} onUpload={handleUpload} onDelete={() => setFieldValue("image", null)} />
                  </>
                )}
                <Grid sx={{ display: "flex", justifyContent: "center", gap: 2 }} size={12}>
                  <CommonButton type="submit" variant="contained" title="Save" loading={isAddPosPaymentPending || isAddExpensePending} />
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
