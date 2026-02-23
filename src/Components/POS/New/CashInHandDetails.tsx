import { Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CommonButton, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../Common";

const CashInHandDetails = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    setOpen(false);
  };

  return (
    <CommonModal isOpen={!open} title="Cash In Hand Details" onClose={() => {}} className="max-w-[400px] m-2 sm:m-5" showCloseButton={false}>
      <Formik initialValues={{ openingCash: "" }} enableReinitialize onSubmit={handleSubmit}>
        {() => (
          <Form noValidate>
            <Grid sx={{ p: 1 }} container spacing={2}>
              <CommonValidationTextField name="openingCash" label="Cash In Hand" required grid={{ xs: 12 }} />
              <CommonButton sx={{ width: "100%" }} type="submit" variant="contained" title="Start Selling" size="medium" loading={false} />
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default CashInHandDetails;
