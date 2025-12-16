 import { Grid } from "@mui/material";
import { CommonTextField } from "../../../Attribute";

const BasicDetailsForm = () => {
  return (
    <Grid container spacing={2}>
      <CommonTextField name="name" label="Company Name" required grid={{ xs: 12, md: 6 }} />
      <CommonTextField name="displayName" label="Display Name" grid={{ xs: 12, md: 6 }} />
      <CommonTextField name="contactName" label="Contact Name" grid={{ xs: 12, md: 6 }} />
      <CommonTextField name="mobile" label="Mobile No" grid={{ xs: 12, md: 6 }} />
      <CommonTextField name="email" label="Email" grid={{ xs: 12, md: 6 }} />
    </Grid>
  );
};

export default BasicDetailsForm;
