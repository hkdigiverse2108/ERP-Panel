import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { Mutations, Queries } from "../../../../Api";
import { CommonButton, CommonPhoneNumber, CommonValidationDatePicker, CommonValidationTextField } from "../../../../Attribute";
import { PAGE_TITLE } from "../../../../Constants";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import { setCustomerModal } from "../../../../Store/Slices/ModalSlice";
import type { ContactFormFormikValues } from "../../../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../../../Utils";
import { useDependentReset } from "../../../../Utils/Hooks";
import { CustomerFormSchema } from "../../../../Utils/ValidationSchemas";
import { CommonModal, DependentSelect } from "../../../Common";

const CustomerForm = () => {
  const { isCustomerModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const open = isCustomerModal.open;
  const isEditing = !!isCustomerModal.data;
  const pageMode = isEditing ? "EDIT" : "ADD";
  const customerData = isCustomerModal.data;

  const { mutate: addContact, isPending: isAddLoading } = Mutations.useAddContact();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContact();

  const initialValues: ContactFormFormikValues = {
    firstName: customerData?.firstName || "",
    lastName: customerData?.lastName || "",
    phoneNo: { countryCode: customerData?.phoneNo?.countryCode || "", phoneNo: customerData?.phoneNo?.phoneNo || "" },
    whatsappNo: { countryCode: customerData?.whatsappNo?.countryCode || "", phoneNo: customerData?.whatsappNo?.phoneNo || "" },
    dob: customerData?.dob || "",
    email: customerData?.email || "",
    address: {
      addressLine1: customerData?.address?.[0]?.addressLine1 || "",
      country: customerData?.address?.[0]?.country?._id || "",
      state: customerData?.address?.[0]?.state?._id || "",
      city: customerData?.address?.[0]?.city?._id || "",
      pinCode: customerData?.address?.[0]?.pinCode || "",
    },
    contactType: "customer",
    customerType: "retailer",
  };

  const AddressDependencyHandler = () => {
    useDependentReset([
      { when: "address.country", reset: ["address.state", "address.city"] },
      { when: "address.state", reset: ["address.city"] },
    ]);
    return null;
  };

  const handleClose = () => dispatch(setCustomerModal({ open: false, data: null }));

  const handleSubmit = (values: ContactFormFormikValues, { resetForm }: FormikHelpers<ContactFormFormikValues>) => {
    const payload = {
      ...values,
      address: values.address ? [values.address] : [],
    };
    const handleSuccess = () => {
      resetForm();
      dispatch(setCustomerModal({ open: false, data: null }));
    };
    if (isEditing) {
      const normalizedCustomerData = {
        ...customerData,
        address: customerData?.address?.[0]
          ? [
              {
                ...customerData?.address?.[0],
                country: customerData?.address?.[0].country?._id,
                state: customerData?.address?.[0].state?._id,
                city: customerData?.address?.[0].city?._id,
              },
            ]
          : [],
      };

      const changedFields = GetChangedFields(payload, normalizedCustomerData);
      editContact({ ...changedFields, contactId: customerData?._id }, { onSuccess: handleSuccess });
    } else {
      addContact(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonModal isOpen={open} title={PAGE_TITLE.CUSTOMER[pageMode]} onClose={() => handleClose()} className="max-w-[1000px]">
        <Formik<ContactFormFormikValues> enableReinitialize initialValues={initialValues} validationSchema={CustomerFormSchema} onSubmit={handleSubmit}>
          {({ values, dirty }) => (
            <Form noValidate>
              <AddressDependencyHandler />
              <Grid container spacing={2} py={1}>
                <CommonValidationTextField name="firstName" label="First Name" grid={{ xs: 12, md: 4 }} required />
                <CommonValidationTextField name="lastName" label="Last Name" grid={{ xs: 12, md: 4 }} required />
                <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                <CommonPhoneNumber label="WhatsApp No." countryCodeName="whatsappNo.countryCode" numberName="whatsappNo.phoneNo" grid={{ xs: 12, md: 4 }} />
                <CommonValidationDatePicker name="dob" label="Date Of Birth" grid={{ xs: 12, md: 4 }} />
                <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                <CommonValidationTextField name="address.addressLine1" label="Address" grid={{ xs: 12, md: 4 }} />
                <DependentSelect name="address.country" label="Country" grid={{ xs: 12, md: 4 }} query={Queries.useGetCountryLocation} />
                <DependentSelect params={values?.address?.country} name="address.state" label="State" grid={{ xs: 12, md: 4 }} query={Queries.useGetStateLocation} disabled={!values?.address?.country} />
                <DependentSelect params={values?.address?.state} name="address.city" label="City" grid={{ xs: 12, md: 4 }} query={Queries.useGetCityLocation} disabled={!values?.address?.state} />
                <CommonValidationTextField name="address.pinCode" label="Pin Code" grid={{ xs: 12, md: 4 }} />
                <Grid size={12} sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <CommonButton variant="outlined" onClick={() => handleClose()} title="Cancel" />
                  <CommonButton type="submit" variant="contained" title="Save" loading={isAddLoading || isEditLoading} disabled={!dirty} />
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
