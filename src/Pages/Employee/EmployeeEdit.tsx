import { Box, Grid, Button } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard } from "../../Components/Common";
import { CommonTextField } from "../../Attribute";
import { CommonButton } from "../../Attribute";

const EmployeeEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <h2 style={{ margin: 3 }}>Employee Form</h2>
      </Box>

      <Formik
        initialValues={{
          name: data?.name || "",
          mobile: "",
          email: data?.email || "",
          pan: "",
          address: "",
          country: "",
          state: "",
          city: "",
          zip: "",
          bankName: "",
          branchName: "",
          accountNo: "",
          ifsc: "",
          accountHolder: "",
          swift: "",
          wages: "",
          commission: "",
          extraWages: "",
          target: "",
        }}
        onSubmit={(values) => {
          console.log("Employee Edit Data:", values);
        }}
      >
        <Form>
          <Grid container spacing={2}>
            {/* BASIC DETAILS  */}
            <CommonCard title="Basic Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="name" label="Employee Name" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="mobile" label="Mobile No." type="number" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="email" label="Email" type="email" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="pan" label="PAN No." required grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/* ADDRESS DETAILS  */}
            <CommonCard title="Address Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="address" label="Address" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="country" label="Country" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="state" label="State" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="city" label="City" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="zip" label="ZIP Code" type="number" required grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/*  BANK DETAILS  */}
            <CommonCard title="Bank Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="bankName" label="Bank Name" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="branchName" label="Branch Name" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="accountNo" label="Account No." type="number" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="ifsc" label="IFSC Code" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="accountHolder" label="Account Holder Name" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="swift" label="Swift Code" required grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/*  SALARY DETAILS  */}
            <CommonCard title="Salary Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="wages" label="Wages" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="commission" label="Commission (%)" type="number" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="extraWages" label="Extra Wages" type="number" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="target" label="Target" type="number" required grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/*  ACTION BUTTONS */}
            <Grid className="w-full! flex justify-end ">
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Back" />

                <CommonButton type="submit" variant="contained" title="Save" />
              </Box>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default EmployeeEdit;
