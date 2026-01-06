import { Box, FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import { Form, Formik } from "formik";
import { useLocation } from "react-router-dom";
import { CommonValidationTextField } from "../../../Attribute";
import { CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { PaymentFormValues } from "../../../Types";

const PaymentForm = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  const { data } = location.state || {};
  // const { company } = useAppSelector((state) => state.company);

  /* ================= API ================= */
  // const { mutate: addPayment, isPending: isAddLoading } = Mutations.useAddPayment();
  // const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPayment();

  /* ================= MODE ================= */
  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  /* ================= INITIAL VALUES ================= */
  const initialValues: PaymentFormValues = {
    paymentMode: data?.paymentMode || "CASH",
    paymentType: data?.paymentType || "ON_ACCOUNT",
    bankMode: data?.bankMode || "ONLINE",

    party: data?.party || "",
    paymentDate: data?.paymentDate || "",
    transactionDate: data?.transactionDate || "",
    transactionNo: data?.transactionNo || "",
    amount: data?.amount || null,
    description: data?.description || "",

    isActive: data?.isActive ?? true,
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    // const { _submitAction, ...rest } = values;

    // const onSuccessHandler = () => {
    //   if (_submitAction === "saveAndNew") resetForm({ values: initialValues });
    //   else navigate(-1);
    // };

    if (isEditing) {
      // const changedFields = GetChangedFields(rest, data);
      // editPayment(
      //   {
      //     ...changedFields,
      //     // paymentId: data._id,
      //     // companyId: company!._id,
      //   },
      //   { onSuccess: onSuccessHandler }
      // );
    } else {
      // addPayment(
      //   {
      //     ...RemoveEmptyFields(rest),
      //     companyId: company!._id,
      //   },
      //   { onSuccess: onSuccessHandler }
      // );
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PAYMENT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.PAYMENT[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, setFieldValue}) => (
            <Form noValidate>
              <Grid container spacing={{ xs: 1.5, md: 2 }}>
                {/* PAYMENT MODE */}
                <CommonCard title="Payment Mode" grid={{ xs: 12 }}>
                  <RadioGroup className="p-2 m-2"
                    row={false}
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1,
                    }}
                    value={values.paymentMode}
                    onChange={(e) => setFieldValue("paymentMode", e.target.value)}
                  >
                    <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
                    <FormControlLabel value="BANK" control={<Radio />} label="Bank" />
                  </RadioGroup>
                </CommonCard>

                {/* CASH */}
                {values.paymentMode === "CASH" && (
                  <CommonCard title="Cash Payment Details" grid={{ xs: 12 }}>
                    <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ p: { xs: 1, md: 2 } }}>
                      <CommonValidationTextField name="party" label="Party" grid={{ xs: 12, sm: 6, md: 4 }} />
                      <CommonValidationTextField name="paymentDate" type="date" label="Payment Date" grid={{ xs: 12, sm: 6, md: 4 }}/>
                      <CommonValidationTextField name="amount" type="number" label="Amount" grid={{ xs: 12, sm: 6, md: 4 }} />
                      <CommonValidationTextField name="description" label="Description" grid={{ xs: 12 }} />

                      <RadioGroup
                        sx={{
                          mt: 1,
                          flexDirection: { xs: "column", md: "row" },
                        }}
                        value={values.paymentType}
                        onChange={(e) => setFieldValue("paymentType", e.target.value)}
                      >
                        <FormControlLabel value="ON_ACCOUNT" control={<Radio />} label="On Account" />
                        <FormControlLabel value="ADVANCE" control={<Radio />} label="Advance Payment" />
                        <FormControlLabel value="AGAINST_VOUCHER" control={<Radio />} label="Against Voucher" />
                      </RadioGroup>
                    </Grid>
                  </CommonCard>
                )}

                {/* BANK */}
                {values.paymentMode === "BANK" && (
                  <CommonCard title="Bank Payment Details" grid={{ xs: 12 }}>
                    <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ p: { xs: 1, md: 2 } }}>
                      <RadioGroup
                        sx={{
                          mb: 1,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                        value={values.bankMode}
                        onChange={(e) => setFieldValue("bankMode", e.target.value)}
                      >
                        <FormControlLabel value="ONLINE" control={<Radio />} label="Online" />
                        <FormControlLabel value="CHEQUE" control={<Radio />} label="Cheque" />
                      </RadioGroup>

                      <CommonValidationTextField name="party" label="Party" grid={{ xs: 12, sm: 6, md: 4 }} />
                      <CommonValidationTextField name="paymentDate" type="date" label="Payment Date" grid={{ xs: 12, sm: 6, md: 4 }}  />
                      <CommonValidationTextField name="transactionDate" type="date" label="Transaction Date" grid={{ xs: 12, sm: 6, md: 4 }}  />
                      <CommonValidationTextField name="transactionNo" label="Transaction No" grid={{ xs: 12, sm: 6, md: 4 }} />
                      <CommonValidationTextField name="amount" type="number" label="Amount" grid={{ xs: 12, sm: 6, md: 4 }} />
                      <CommonValidationTextField name="description" label="Description" grid={{ xs: 12 }} />
                    </Grid>
                  </CommonCard>
                )}

                {/* ACTION BAR */}
                {/* <CommonBottomActionBar clear disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} /> */}
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default PaymentForm;
