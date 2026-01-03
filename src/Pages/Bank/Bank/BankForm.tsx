import { Box, Grid } from "@mui/material";
import { Formik, Form, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonButton, CommonValidationTextField, CommonSelect, CommonValidationSwitch } from "../../../Attribute";
import { Mutations } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { KEYS, PAGE_TITLE } from "../../../Constants";
import { BankFormBreadCrumbs } from "../../../Data"; 
import { useAppSelector } from "../../../Store/hooks";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { useQueryClient } from "@tanstack/react-query";

// 1. Updated Interface to match your Joi schema structure if needed
interface BankFormValues {
  _submitAction?: "save" | "saveAndNew";
  bankName: string;
  branchName: string;
  ifscCode: string;
  swiftCode: string;
  accountHolderName: string;
  bankAccountNumber: string; // Changed to match your Joi/Backend naming
  openingBalance: number;
  addressLine1: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  isActive: boolean;
}

const BankForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const { mutate: addBank, isPending: isAddLoading } = Mutations.useAddBank();
  const { mutate: editBank, isPending: isEditLoading } = Mutations.useEditBank();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  // 2. DEFINE INITIAL VALUES (This was missing)
  const initialValues: BankFormValues = {
    bankName: data?.bankName || "",
    branchName: data?.branchName || "",
    ifscCode: data?.ifscCode || "",
    swiftCode: data?.swiftCode || "",
    accountHolderName: data?.accountHolderName || "",
    bankAccountNumber: data?.bankAccountNumber || "",
    openingBalance: data?.openingBalance || 0,
    addressLine1: data?.addressLine1 || "",
    country: data?.country || "",
    state: data?.state || "",
    city: data?.city || "",
    zipCode: data?.zipCode || "",
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: BankFormValues, { resetForm }: FormikHelpers<BankFormValues>) => {
    const { _submitAction, ...rest } = values;

    // Safety check for company ID
    if (!company?._id) {
        console.error("Company ID missing");
        return;
    }

    const payload = {
      ...rest,
      companyId: company._id,
    };

    const handleSuccess = () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.BANK.ALL] });
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editBank({ ...changedFields, bankId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addBank(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BANK.BANK.ADDEDIT} maxItems={1} breadcrumbs={BankFormBreadCrumbs} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<BankFormValues>
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, resetForm, dirty, isSubmitting }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* ---------- BANK DETAILS ---------- */}
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="bankName" label="Bank Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="branchName" label="Branch Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="ifscCode" label="IFSC Code" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="swiftCode" label="Swift Code" grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="accountHolderName" label="Account Holder Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="bankAccountNumber" label="Account Number" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="openingBalance" label="Opening Balance" type="number" grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="addressLine1" label="Address" multiline rows={3} grid={{ xs: 12 }} />
                  </Grid>
                </CommonCard>

                {/* ---------- LOCATION DETAILS ---------- */}
                <CommonCard title="Location" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonSelect 
                        label="Country" 
                        required 
                        options={[]} 
                        value={values.country ? [values.country] : []} 
                        onChange={(v) => setFieldValue("country", v[0] || "")} 
                        grid={{ xs: 12, md: 4 }} 
                    />
                    <CommonSelect 
                        label="State" 
                        required 
                        options={[]} 
                        value={values.state ? [values.state] : []} 
                        onChange={(v) => setFieldValue("state", v[0] || "")} 
                        grid={{ xs: 12, md: 4 }} 
                    />
                    <CommonSelect 
                        label="City" 
                        required 
                        options={[]} 
                        value={values.city ? [values.city] : []} 
                        onChange={(v) => setFieldValue("city", v[0] || "")} 
                        grid={{ xs: 12, md: 4 }} 
                    />
                    <CommonValidationTextField name="zipCode" label="Zip / Postal Code" grid={{ xs: 12, md: 6 }} />
                  </Grid>
                </CommonCard>

                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                <CommonBottomActionBar 
                    save={isEditing} 
                    clear={!isEditing} 
                    disabled={!dirty || isSubmitting} 
                    isLoading={isAddLoading || isEditLoading} 
                    onClear={() => resetForm()} 
                    onSave={() => setFieldValue("_submitAction", "save")} 
                    onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} 
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