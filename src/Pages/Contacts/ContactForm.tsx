import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonValidationTextField as CommonTextField, CommonSwitch, CommonPhoneNumber, CommonRadio, CommonValidationSelect } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, CityOptionsByState, CONTACT_TYPE, CountryOptions, StateOptions } from "../../Data";
import { useAppSelector } from "../../Store/hooks";
import type { ContactFormValues } from "../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { ContactFormSchema } from "../../Utils/ValidationSchemas";
import { useState } from "react";

const ContactForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const [contactType, setContactType] = useState("");

  const { mutate: addContact, isPending: isAddLoading } = Mutations.useAddContact();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContact();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";
  const address = data?.addressDetails?.[0];
  const initialValues: ContactFormValues = {
    //  GENERAL DETAILS
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    phoneNo: {
      countryCode: data?.phoneNo?.countryCode || "",
      phoneNo: data?.phoneNo?.phoneNo || "",
    },
    whatsappNo: {
      countryCode: data?.whatsappNo?.countryCode || "",
      phoneNo: data?.whatsappNo?.whatsappNo || "",
    },
    panNo: data?.panNo || "",
    customerCategory: data?.customerCategory || "",
    paymentMode: data?.paymentMode || "",
    paymentTerms: data?.paymentTerms || "",
    openingBalance: data?.openingBalance || "",
    customerType: data?.customerType || "retailer",
    vendorType: data?.vendorType || "manufacturer",
    isActive: data?.isActive ?? true,
    //  ADDRESS DETAILS

    addressDetails: {
      gstType: address?.gstType || "",
      gstIn: address?.gstIn || "",
      contactFirstName: address?.contactFirstName || "",
      contactLastName: address?.contactLastName || "",
      contactEmail: address?.contactEmail || "",
      addressLine1: address?.addressLine1 || "",
      addressLine2: address?.addressLine2 || "",
      country: address?.country || "",
      state: address?.state || "",
      city: address?.city || "",
      pinCode: address?.pinCode || "",
      companyName: address?.companyName || "",
    },
  };

  const handleSubmit = async (values: ContactFormValues, { resetForm }: FormikHelpers<ContactFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest, companyId: company!._id };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editContact({ ...changedFields, contactId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addContact(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };
  const topContent = <CommonRadio value={contactType} onChange={setContactType} options={CONTACT_TYPE} grid={{ xs: "auto" }} />;
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.CONTACT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<ContactFormValues> enableReinitialize initialValues={initialValues} validationSchema={ContactFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty, values }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* GENERAL DETAILS */}
                <CommonCard topContent={topContent} title="General Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="firstName" label="First Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="lastName" label="Last Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="email" label="Email" grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="addressDetails.companyName" label="Company Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 6 }} required />
                    <CommonPhoneNumber label="Whatsapp No." countryCodeName="whatsappNo.countryCode" numberName="whatsappNo.phoneNo" grid={{ xs: 12, md: 6 }} required />
                    <CommonTextField name="panNo" label="PAN No" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="paymentMode" label="Payment Mode" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="paymentTerms" label="Payment Terms" grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="openingBalance" label="Opening Balance" type="number" grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="customerCategory" label="Customer Category" grid={{ xs: 12, md: 6 }} />
                  </Grid>
                </CommonCard>

                {/*  ADDRESS DETAILS */}
                <CommonCard title="Address Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="addressDetails.gstType" label="GST Type" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="addressDetails.gstIn" label="GSTIN" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="addressDetails.contactFirstName" label="Contact First Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="addressDetails.contactLastName" label="Contact Last Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="addressDetails.companyName" label="Contact Company Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonPhoneNumber label="Phone No." countryCodeName="addressDetails.contactNo.countryCode" numberName="addressDetails.contactNo.phoneNo" grid={{ xs: 12, md: 6 }} required />
                    <CommonTextField name="addressDetails.contactEmail" label="Email" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="addressDetails.addressLine1" label="Addressline1" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="addressDetails.addressLine2" label="Addressline2" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationSelect name="addressDetails.state" label="State" disabled={!values.addressDetails?.country} options={StateOptions} grid={{ xs: 12, md: 6 }} required />
                    <CommonValidationSelect name="addressDetails.city" label="City" disabled={!values.addressDetails?.state} options={CityOptionsByState[values?.addressDetails?.state || ""] || []} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="addressDetails.country" label="Country"  options={CountryOptions} required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="addressDetails.pinCode" label="Pin Code" required grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {!isEditing && <CommonSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ContactForm;
