import { Box, Grid, Button } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard } from "../../Components/Common";
import { CommonTextField } from "../../Attribute";

const EmployeeEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <h2 style={{ margin: 3, }}>Employee Edit</h2>
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
            {/* ================= BASIC DETAILS ================= */}
            <CommonCard title="Basic Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="name" label="Employee Name" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="mobile" label="Mobile No." grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="email" label="Email" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="pan" label="PAN No." grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/* ================= ADDRESS DETAILS ================= */}
            <CommonCard title="Address Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="address" label="Address" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="country" label="Country" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="state" label="State" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="city" label="City" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="zip" label="ZIP Code" grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/* ================= BANK DETAILS ================= */}
            <CommonCard title="Bank Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="bankName" label="Bank Name" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="branchName" label="Branch Name" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="accountNo" label="Account No." grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="ifsc" label="IFSC Code" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="accountHolder" label="Account Holder Name" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="swift" label="Swift Code" grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/* ================= SALARY DETAILS ================= */}
            <CommonCard title="Salary Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="wages" label="Wages" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="commission" label="Commission (%)" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="extraWages" label="Extra Wages" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="target" label="Target" grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/* ================= ACTION BUTTONS ================= */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default EmployeeEdit;
