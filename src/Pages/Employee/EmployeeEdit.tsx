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
            <CommonCard title="Edit Employee" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>

                {/* BASIC */}
                <CommonTextField name="name" label="Employee Name" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="mobile" label="Mobile No." grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="pan" label="PAN No." grid={{ xs: 12, md: 4 }} />

                {/* ADDRESS */}
                <CommonTextField name="address" label="Address" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="country" label="Country" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="state" label="State" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="city" label="City" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="zip" label="ZIP Code" grid={{ xs: 12, md: 4 }} />

                {/* BANK */}
                <CommonTextField name="bankName" label="Bank Name" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="branchName" label="Branch Name" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="accountNo" label="Account No." grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="ifsc" label="IFSC Code" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="accountHolder" label="Account Holder Name" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="swift" label="Swift Code" grid={{ xs: 12, md: 4 }} />

                {/* SALARY */}
                <CommonTextField name="wages" label="Wages" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="commission" label="Commission (%)" grid={{ xs: 12, md: 4 }} />
                <CommonTextField name="extraWages" label="Extra Wages" grid={{ xs: 12, md: 4 }} />
              
                {/* ACTION BUTTONS */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                      Back
                    </Button>
                    <Button type="submit" variant="contained">
                      Save
                    </Button>
                  </Box>
                </Grid>

              </Grid>
            </CommonCard>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default EmployeeEdit;
