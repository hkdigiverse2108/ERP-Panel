import { Grid, Box, Button } from "@mui/material";
import { Formik, Form } from "formik";
import { CommonTextField, CommonSwitch } from "../../../Attribute";
import { CommonCard } from "../../Common";
import { Validation } from "../../../Utils/ValidationSchemas/Validation";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";

export const EditCompany = () => {
  const navigate = useNavigate();
  const ValidationSchemas = Yup.object({
    name: Validation("string", "Company Name"),
    mobile: Validation("string", "Mobile"),
    email: Validation("string", "Email"),
    city: Validation("string", "City"),
    state: Validation("string", "State"),
    bankName: Validation("string", "Bank Name"),
    accountNo: Validation("string", "Account No"),
  });
  return (
    <Box
      sx={{
        p: { xs: 2, md: 2 },
        m: { xs: 1, md: 2 },
      }}
    >
      <Formik
        initialValues={{
          AccountingType: "",
          name: "",
          displayName: "",
          contactName: "",
          OwnerNo: "",
          mobile: "",
          email: "",
          address: "",
          city: "",
          state: "",
          country: "",
          pinCode: "",
          Timezone: "",
          bankName: "",
          ifsc: "",
          UPI: "",
          accountNo: "",
          accountHolderName: "",
          UserName: "",
          pan: "",
          gstin: "",
          gstType: "",
          FinancialMonthInterval: "",
          DefaultFinancialYear: "",
          cin: "",
          tan: "",
          iec: "",
          lut: "",
          OutletSize: "",
          roundOff: false,
        }}
        onSubmit={(values) => {
          console.log("Edit Company Data:", values);
        }}
      >
        <Form>
          <Grid container spacing={2}>
            {/* BASIC DETAILS */}
            <CommonCard title="Basic Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="AccountingType" label="Accounting Type" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="name" label="Company Name" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="displayName" label="Display Name" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="contactName" label="Contact Name" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="mobile" label="Mobile No" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="email" label="Email" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="OwnerNo" label="Owner No" grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/* COMMUNICATION */}
            <CommonCard title="Communication Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="address" label="Address" grid={{ xs: 12 }} />
                <CommonTextField name="city" label="City" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="state" label="State" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="country" label="Country" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="pinCode" label="Pin Code" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="Timezone" label="Timezone" grid={{ xs: 12, md: 4 }} />
              </Grid>
            </CommonCard>

            {/* BANK */}
            <CommonCard title="Bank Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="bankName" label="Bank Name" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="ifsc" label="IFSC Code" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="accountNo" label="Account No" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="accountHolderName" label="Account Holder Name" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="UPI" label="UPI ID" grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/* OTHER */}
            <CommonCard title="Other Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="cin" label="CIN No" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="lut" label="LUT No" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="tan" label="TAN No" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="iec" label="IEC No" grid={{ xs: 12, md: 6 }} />
                <CommonSwitch name="roundOff" label="Allow Round Off" grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/* ACTION BUTTONS */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Back
              </Button>

              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Box>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default EditCompany;
