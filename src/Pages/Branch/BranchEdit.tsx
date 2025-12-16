import { Box, Grid, Button } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard } from "../../Components/Common";
import { CommonTextField } from "../../Attribute";

const BranchEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  console.log("BranchEdit");
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Formik
        initialValues={{
          branchName: data?.name || "",
          branchAddress: data?.address || "",
        }}
        onSubmit={(values) => {
          console.log("Branch Edit Data:", values);
        }}
      >
        <Form>
          <Grid container spacing={2}>
            <CommonCard title="Edit Branch" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                {/* BRANCH FIELDS */}
                <CommonTextField name="branchName" label="Branch Name" grid={{ xs: 12, md: 6 }} />

                <CommonTextField name="branchAddress" label="Branch Address" grid={{ xs: 12, md: 6 }} />

                {/* ACTION BUTTONS */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
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
            </CommonCard>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default BranchEdit;
