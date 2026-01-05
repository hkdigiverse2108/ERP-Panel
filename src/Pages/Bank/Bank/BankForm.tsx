import { Box, Grid } from "@mui/material";
import { Formik, Form, type FormikHelpers } from "formik";
import { Await, useLocation, useNavigate } from "react-router-dom";
import { CommonButton, CommonValidationTextField, CommonSelect, CommonValidationSwitch } from "../../../Attribute";
import { Mutations } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { KEYS, PAGE_TITLE } from "../../../Constants";
import { BankFormBreadCrumbs } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
// import { useQueryClient } from "@tanstack/react-query";
import type { BankFormValues } from "../../../Types/Bank";

const BankForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);
  
  const { mutate: addBank, isPending: isAddLoading } = Mutations.useAddBank();
  const { mutate: editBank, isPending: isEditLoading } = Mutations.useEditBank();

  const isEditing = Boolean(data?._id);

 
  const initialValues: BankFormValues = {
    bankName: data?.bankName || "",
    branchName: data?.branchName || "",
    ifscCode: data?.ifscCode || "",
    swiftCode: data?.swiftCode || "",
    accountHolderName: data?.accountHolderName || "",
    bankAccountNumber: data?.bankAccountNumber || "",
    openingBalance: data?.openingBalance || { creditBalance: 0, debitBalance: 0 },
    addressLine1: data?.addressLine1 || "",
    country: data?.country || "",
    state: data?.state || "",
    city: data?.city || "",
    zipCode: data?.zipCode || undefined,
    isActive: data?.isActive ?? true,
    _submitAction: "", 
  };

  const handleSubmit = async (
    values: BankFormValues, 
    { resetForm }: FormikHelpers<BankFormValues>
  ) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest, companyId: company?._id };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
    
      editBank(
        { ...changedFields, bankId: data._id } as any, 
        { onSuccess: handleSuccess }
      );
    } else {
      
      const cleanedPayload = RemoveEmptyFields(payload) as BankFormValues;
      addBank(cleanedPayload, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BANK.ADD } maxItems={1} breadcrumbs={BankFormBreadCrumbs} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, resetForm, dirty, submitForm }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="bankName" label="Bank Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="branchName" label="Branch Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="ifscCode" label="IFSC Code" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="swiftCode" label="Swift Code" grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="accountHolderName" label="Account Holder Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="bankAccountNumber" label="Account Number" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField 
                      name="openingBalance.creditBalance" 
                      label="Opening Balance" 
                      type="number" 
                      grid={{ xs: 12, md: 6 }} 
                    />
                    
                    <CommonValidationTextField name="addressLine1" label="Address" multiline rows={3} grid={{ xs: 12 }} />
                    <CommonValidationTextField name="zipCode" label="Zip Code" type="number" grid={{ xs: 12, md: 6 }} />
                  </Grid>
                </CommonCard>

                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                <CommonBottomActionBar 
                  save={isEditing} 
                  clear={!isEditing} 
                  disabled={!dirty} 
                  isLoading={isAddLoading || isEditLoading} 
                  onClear={() => resetForm()} 
                  onSave={() => {
                    setFieldValue("_submitAction", "save");
                    submitForm();
                  }} 
                  onSaveAndNew={() => {
                    setFieldValue("_submitAction", "saveAndNew");
                    submitForm();
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
export default BankForm;