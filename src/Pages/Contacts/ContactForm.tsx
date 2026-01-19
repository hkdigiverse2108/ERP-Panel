import { Box, Grid } from "@mui/material";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonValidationTextField as CommonTextField, CommonSwitch, CommonPhoneNumber, CommonRadio, CommonValidationSelect, CommonValidationRadio, CommonValidationDatePicker, CommonButton } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, CityOptionsByState, CONTACT_CATEGORY_CUSTOMER, CONTACT_CATEGORY_SUPPLIER, CONTACT_TYPE, CountryOptions, CUSTOMER_CATEGORY, GST_TYPE, PAYMENT_MODE, PAYMENT_TERMS, StateOptions } from "../../Data";
import { useAppSelector } from "../../Store/hooks";
import type { ContactFormValues } from "../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { getContactFormSchema } from "../../Utils/ValidationSchemas";
import { useState } from "react";
import type { AddressDetails } from "../../Types/Contacts";

const ContactForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const [contactType, setContactType] = useState(data?.contactType || "customer");

  const { mutate: addContact, isPending: isAddLoading } = Mutations.useAddContact();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContact();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const bank = data?.bankDetails?.[0];

  const emptyAddress: AddressDetails = {
    gstType: "UnRegistered",
    gstIn: "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    contactCompanyName: "",
    contactNo: {
      countryCode: "",
      phoneNo: "",
    },
  };

  const mapAddress = (addr?: AddressDetails) => ({
    gstType: addr?.gstType || "UnRegistered",
    gstIn: addr?.gstIn || "",
    contactFirstName: addr?.contactFirstName || "",
    contactLastName: addr?.contactLastName || "",
    contactEmail: addr?.contactEmail || "",
    addressLine1: addr?.addressLine1 || "",
    addressLine2: addr?.addressLine2 || "",
    country: addr?.country || "",
    state: addr?.state || "",
    city: addr?.city || "",
    pinCode: addr?.pinCode || "",
    contactCompanyName: addr?.contactCompanyName || "",

    contactNo: {
      countryCode: addr?.contactNo?.countryCode || "",
      phoneNo: addr?.contactNo?.phoneNo != null ? String(addr.contactNo.phoneNo) : "",
    },
  });

  const initialValues: ContactFormValues = {
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    phoneNo: {
      countryCode: data?.phoneNo?.countryCode || "",
      phoneNo: data?.phoneNo?.phoneNo || "",
    },

    whatsappNo: {
      countryCode: data?.whatsappNo?.countryCode || "",
      phoneNo: data?.whatsappNo?.phoneNo || "",
    },

    panNo: data?.panNo || "",
    customerCategory: data?.customerCategory || "",
    paymentMode: data?.paymentMode || "",
    paymentTerms: data?.paymentTerms || "",
    openingBalance: {
      debitBalance: data?.openingBalance?.debitBalance || "",
      creditBalance: data?.openingBalance?.creditBalance || "",
    },
    customerType: data?.customerType || "",
    vendorType: data?.vendorType || "",
    isActive: data?.isActive ?? true,
    dob: data?.dob ? data.dob :"",
    anniversaryDate: data?.anniversaryDate ? data.anniversaryDate : "",
    telephoneNo: data?.telephoneNo || "",
    remarks: data?.remarks || "",
    supplierType: data?.supplier || "",
    transporterId: data?.transporterId || "",
    companyName: data?.companyName || "",
    tanNo: data?.tanNo || "",

    // ADDRESS DETAILS
    addressDetails: data?.addressDetails?.length ? data.addressDetails.map(mapAddress) : [mapAddress()],

    //BANK DETAILS
    bankDetails: {
      ifscCode: bank?.ifscCode || "",
      name: bank?.name || "",
      branch: bank?.branch || "",
      accountNumber: bank?.accountNumber || "",
    },
  };

  const handleSubmit = async (values: ContactFormValues, { resetForm }: FormikHelpers<ContactFormValues>) => {
    const { _submitAction, ...rest } = values;

    const payload = {
      ...rest,
      companyId: company!._id,
      contactType,
    };

    console.log("Form Submission Data:", { values, payload, contactType });

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      editContact({ ...changedFields, contactId: data._id }, { onSuccess: handleSuccess });
    } else {
      const cleanedPayload = RemoveEmptyFields(payload);
      addContact(cleanedPayload, { onSuccess: handleSuccess });
    }
  };

  const topContent = (
    <CommonRadio
      value={contactType}
      onChange={setContactType}
      options={CONTACT_TYPE.map((opt) => ({
        ...opt,
        disabled: isEditing && opt.value !== data?.contactType,
      }))}
      grid={{ xs: "auto" }}
    />
  );
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.CONTACT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} validationSchema={getContactFormSchema} onSubmit={handleSubmit} context={{ contactType }}>
          {({ resetForm, setFieldValue, dirty, values }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* GENERAL DETAILS */}
                <CommonCard topContent={topContent} title="General Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="firstName" label="First Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="lastName" label="Last Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="companyName" label="Company Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    {["supplier","customer"].includes(contactType) && <CommonPhoneNumber label="Whatsapp No." countryCodeName="whatsappNo.countryCode" numberName="whatsappNo.phoneNo" grid={{ xs: 12, md: 4 }} />}
                    <CommonTextField name="telephoneNo" label="Telephone No" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="remarks" label="Remarks" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="panNo" label="PAN No" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="paymentMode" label="Payment Mode" options={PAYMENT_MODE} required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="paymentTerms" label="Payment Terms" options={PAYMENT_TERMS} grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="openingBalance.debitBalance" label="Debit Balance" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="openingBalance.creditBalance" label="Credit Balance" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationDatePicker name="dob" label="Date Of Birth" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationDatePicker name="anniversaryDate" label="anniversary Date" grid={{ xs: 12, md: 4 }} />
                    {contactType === "customer" && (
                      <>
                        <CommonValidationSelect name="customerCategory" label="Customer Category" options={CUSTOMER_CATEGORY} grid={{ xs: 12, md: 4 }} />
                        <CommonValidationRadio name="customerType" label="Customer Type" options={CONTACT_CATEGORY_CUSTOMER} row grid={{ xs: 12 }} />
                      </>
                    )}

                    {contactType === "supplier" && (
                      <>
                        <CommonTextField name="tanNo" label="Tan No" grid={{ xs: 12, md: 4 }} />
                        <CommonValidationRadio name="supplierType" label="Supplier Type" options={CONTACT_CATEGORY_SUPPLIER} row grid={{ xs: 12 }} />
                        <CommonTextField name="bankDetails.ifscCode" label="Bank IfscCode" grid={{ xs: 12, md: 4 }} />
                        <CommonTextField name="bankDetails.name" label="Bank Name" grid={{ xs: 12, md: 4 }} />
                        <CommonTextField name="bankDetails.branch" label="Bank Branch" grid={{ xs: 12, md: 4 }} />
                        <CommonTextField name="bankDetails.accountNumber" label="Account Number" grid={{ xs: 12, md: 4 }} />
                      </>
                    )}
                    {contactType === "transporter" && <CommonTextField name="transporterId" label="Transport Id" required grid={{ xs: 12, md: 4 }} />}
                  </Grid>
                </CommonCard>

                {/*  ADDRESS DETAILS */}
                <CommonCard title="Address Details" grid={{ xs: 12 }}>
                  <FieldArray name="addressDetails">
                    {({ push, remove }) => (
                      <Box p={2}>
                        {values?.addressDetails?.map((_, index) => {
                          const selectedState = values.addressDetails?.[index]?.state;

                          return (
                            <Box key={index} mb={2} border="1px solid #ddd" p={2} borderRadius={1}>
                              <Grid container spacing={2}>
                                <CommonValidationSelect name={`addressDetails.${index}.gstType`} label="GST Type" options={GST_TYPE} grid={{ xs: 12, md: 3 }} />
                                <CommonTextField name={`addressDetails.${index}.gstIn`} label="GSTIN" required disabled={values.addressDetails?.[index]?.gstType === "UnRegistered"} grid={{ xs: 12, md: 3 }} />
                                <CommonTextField name={`addressDetails.${index}.contactFirstName`} label="Contact First Name" required grid={{ xs: 12, md: 3 }} />
                                <CommonTextField name={`addressDetails.${index}.contactLastName`} label="Contact Last Name" grid={{ xs: 12, md: 3 }} />

                                <CommonTextField name={`addressDetails.${index}.contactCompanyName`} label="Company Name" grid={{ xs: 12, md: 3 }} />

                                <CommonPhoneNumber label="Phone No." countryCodeName={`addressDetails.${index}.contactNo.countryCode`} numberName={`addressDetails.${index}.contactNo.phoneNo`} grid={{ xs: 12, md: 3 }} />

                                <CommonTextField name={`addressDetails.${index}.contactEmail`} label="Email" grid={{ xs: 12, md: 3 }} />

                                <CommonTextField name={`addressDetails.${index}.addressLine1`} label="Address Line 1" grid={{ xs: 12, md: 3 }} />
                                <CommonTextField name={`addressDetails.${index}.addressLine2`} label="Address Line 2" grid={{ xs: 12, md: 3 }} />

                                <CommonValidationSelect name={`addressDetails.${index}.country`} label="Country" options={CountryOptions} required grid={{ xs: 12, md: 2 }} />

                                <CommonValidationSelect name={`addressDetails.${index}.state`} label="State" options={StateOptions} required grid={{ xs: 12, md: 2 }} />

                                <CommonValidationSelect name={`addressDetails.${index}.city`} label="City" options={(selectedState && CityOptionsByState[selectedState]) || []} required grid={{ xs: 12, md: 2 }} />

                                <CommonTextField name={`addressDetails.${index}.pinCode`} label="Pin Code" grid={{ xs: 12, md: 2 }} />

                                {(values?.addressDetails?.length || 0) > 1 && (
                                  <Grid size={12}>
                                    <CommonButton onClick={() => remove(index)} variant="outlined" color="error">
                                      Remove Address
                                    </CommonButton>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          );
                        })}

                        <CommonButton variant="outlined" onClick={() => push(emptyAddress)}>
                          + Add New Address
                        </CommonButton>
                      </Box>
                    )}
                  </FieldArray>
                </CommonCard>

                {!isEditing && <CommonSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                <CommonBottomActionBar
                  save={isEditing}
                  clear={!isEditing}
                  disabled={!dirty}
                  isLoading={isAddLoading || isEditLoading}
                  onClear={() => resetForm({ values: initialValues })}
                  onSave={() => {
                    setFieldValue("_submitAction", "save");
                  }}
                  onSaveAndNew={() => {
                    setFieldValue("_submitAction", "saveAndNew");
                  }}
                />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ContactForm;
