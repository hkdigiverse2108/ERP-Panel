import { Grid } from "@mui/material";
import { Formik } from "formik";
import { Form } from "react-router-dom";
import { Queries } from "../../../../Api";
import { CommonButton, CommonPhoneNumber, CommonValidationDatePicker, CommonValidationTextField } from "../../../../Attribute";
import { PAGE_TITLE } from "../../../../Constants";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import { setCustomerModal } from "../../../../Store/Slices/ModalSlice";
import type { CustomerFormValues } from "../../../../Types";
import { CustomerFormSchema } from "../../../../Utils/ValidationSchemas";
import { CommonModal, DependentSelect } from "../../../Common";

const CustomerForm = () => {
  const { isCustomerModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const open = isCustomerModal.open;
  const pageMode = isCustomerModal.data ? "EDIT" : "ADD";

  const initialValues: CustomerFormValues = {
    name: isCustomerModal.data?.name || "",
    phoneNo: { countryCode: isCustomerModal.data?.phoneNo?.countryCode || "", phoneNo: isCustomerModal.data?.phoneNo?.phoneNo || "" },
    whatsappNo: { countryCode: isCustomerModal.data?.whatsappNo?.countryCode || "", phoneNo: isCustomerModal.data?.whatsappNo?.phoneNo || "" },
    dateOfBirth: isCustomerModal.data?.dateOfBirth || "",
    email: isCustomerModal.data?.email || "",
    address: {
      address: isCustomerModal.data?.address?.address || "",
      country: isCustomerModal.data?.address?.country || "",
      state: isCustomerModal.data?.address?.state || "",
      city: isCustomerModal.data?.address?.city || "",
      pinCode: isCustomerModal.data?.address?.pinCode || "",
    },
  };

  const handleClose = () => dispatch(setCustomerModal({ open: false, data: null }));

  const handleSubmit = (values: CustomerFormValues) => {
    console.log(values);
  };

  return (
    <>
      <CommonModal isOpen={open} title={PAGE_TITLE.CUSTOMER[pageMode]} onClose={() => handleClose()} className="max-w-[1000px]">
        <Formik<CustomerFormValues> enableReinitialize initialValues={initialValues} validationSchema={CustomerFormSchema} onSubmit={handleSubmit}>
          {({ values, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2} py={1}>
                <CommonValidationTextField name="name" label="Name" required grid={{ xs: 12, md: 4 }} />
                <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                <CommonPhoneNumber label="WhatsApp No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} />
                <CommonValidationDatePicker name="dateOfBirth" label="Date Of Birth" grid={{ xs: 12, md: 4 }} />
                <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                <CommonValidationTextField name="address.address" label="Address" grid={{ xs: 12, md: 4 }} />
                <DependentSelect name="address.country" label="Country" grid={{ xs: 12, md: 4 }} query={Queries.useGetCountryLocation} required />
                <DependentSelect params={values?.address?.country} name="address.state" label="State" grid={{ xs: 12, md: 4 }} query={Queries.useGetStateLocation} disabled={!values?.address?.country} required />
                <DependentSelect params={values?.address?.state} name="address.city" label="City" grid={{ xs: 12, md: 4 }} query={Queries.useGetCityLocation} disabled={!values?.address?.state} required />
                <CommonValidationTextField name="address.pinCode" label="Pin Code" grid={{ xs: 12, md: 4 }} />
                <Grid size={12} sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <CommonButton variant="outlined" onClick={() => handleClose()} title="Cancel" />
                  <CommonButton type="submit" variant="contained" title="Save" loading={false} disabled={!dirty} />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CommonModal>
    </>
  );
};

export default CustomerForm;
