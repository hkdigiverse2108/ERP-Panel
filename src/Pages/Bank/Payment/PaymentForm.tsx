import { Box, Grid, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Form, Formik } from "formik";
import { CommonCard, CommonBottomActionBar, CommonBreadcrumbs } from "../../../Components/Common";
import { CommonTextField } from "../../../Attribute";
import { BREADCRUMBS, PAGE_TITLE } from "../../../Constants";
// import { pageMode } from "../../../Utils";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PAYMENT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.PAYMENT[pageMode]} />
      <Box sx={{ p: 3 }}>
        <Formik initialValues={initialValues} onSubmit={(values) => console.log(values)}>
          {({ values, setFieldValue, dirty, resetForm }) => (
            <Form>
              <Grid container spacing={2}>
                {/* PAYMENT MODE */}
                <CommonCard title="Payment Mode" grid={{ xs: 12 }}>
                  <RadioGroup row value={values.paymentMode} onChange={(e) => setFieldValue("paymentMode", e.target.value)}>
                    <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
                    <FormControlLabel value="BANK" control={<Radio />} label="Bank" />
                  </RadioGroup>
                </CommonCard>

                {/* CASH PAYMENT */}
                {values.paymentMode === "CASH" && (
                  <CommonCard title="Cash Payment Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonTextField name="party" label="Party" grid={{ xs: 12, md: 4 }} />
                      <CommonTextField name="paymentDate" type="date" label="Payment Date" grid={{ xs: 12, md: 4 }} />
                      <CommonTextField name="amount" type="number" label="Amount" grid={{ xs: 12, md: 4 }} />
                      <CommonTextField name="description" label="Description" grid={{ xs: 12 }} />

                      {/* CASH PAYMENT TYPE */}
                      <RadioGroup row value={values.paymentType} onChange={(e) => setFieldValue("paymentType", e.target.value)}>
                        <FormControlLabel value="ON_ACCOUNT" control={<Radio />} label="On Account" />
                        <FormControlLabel value="ADVANCE" control={<Radio />} label="Advance Payment" />
                        <FormControlLabel value="AGAINST_VOUCHER" control={<Radio />} label="Against Voucher" />
                      </RadioGroup>
                    </Grid>
                  </CommonCard>
                )}

                {/* BANK PAYMENT */}
                {values.paymentMode === "BANK" && (
                  <CommonCard title="Bank Payment Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      {/* BANK MODE */}
                      <RadioGroup row value={values.bankMode} onChange={(e) => setFieldValue("bankMode", e.target.value)}>
                        <FormControlLabel value="ONLINE" control={<Radio />} label="Online" />
                        <FormControlLabel value="CHEQUE" control={<Radio />} label="Cheque" />
                      </RadioGroup>

                      <CommonTextField name="party" label="Party" grid={{ xs: 12, md: 4 }} />
                      <CommonTextField name="paymentDate" type="date" label="Payment Date" grid={{ xs: 12, md: 4 }} />
                      <CommonTextField name="transactionDate" type="date" label="Transaction Date" grid={{ xs: 12, md: 4 }} />
                      <CommonTextField name="transactionNo" label="Transaction No" grid={{ xs: 12, md: 4 }} />
                      <CommonTextField name="amount" type="number" label="Amount" grid={{ xs: 12, md: 4 }} />
                      <CommonTextField name="description" label="Description" grid={{ xs: 12 }} />
                    </Grid>
                  </CommonCard>
                )}

                <CommonBottomActionBar clear disabled={!dirty} onClear={() => resetForm()} onSave={() => console.log("Save")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default PaymentForm;
