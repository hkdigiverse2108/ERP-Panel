import { Box, Grid } from "@mui/material";
import { Formik, Form, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonTextField, CommonSelect, CommonValidationSwitch } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { KEYS, PAGE_TITLE } from "../../../Constants";
import { BankFormBreadCrumbs } from "../../../Data"; // Assuming this is where BREADCRUMBS.BANK[pageMode] resides
import { useAppSelector } from "../../../Store/hooks";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { useQueryClient } from "@tanstack/react-query";

// Define the interface based on your ProductForm logic
interface BankFormValues {
  _submitAction?: "save" | "saveAndNew";
  bankGroup: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  swiftCode: string;
  accountHolderName: string;
  accountNumber: string;
  openingBalance: string | number;
  address: string;
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

  const initialValues: BankFormValues = {
    bankGroup: data?.bankGroup || "",
    bankName: data?.bankName || "",
    branchName: data?.branchName || "",
    ifscCode: data?.ifscCode || "",
    swiftCode: data?.swiftCode || "",
    accountHolderName: data?.accountHolderName || "",
    accountNumber: data?.accountNumber || "",
    openingBalance: data?.openingBalance || "",
    address: data?.address || "",
    country: data?.country || "",
    state: data?.state || "",
    city: data?.city || "",
    zipCode: data?.zipCode || "",
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: BankFormValues, { resetForm }: FormikHelpers<BankFormValues>) => {
    const { _submitAction, ...rest } = values;

    const payload = {
      ...rest,
      companyId: company!._id,
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
          // validationSchema={BankFormSchema} // Add your validation schema here
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, resetForm, dirty, isSubmitting }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* ---------- BANK DETAILS ---------- */}
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="bankName" label="Bank Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="branchName" label="Branch Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="ifscCode" label="IFSC Code" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="swiftCode" label="Swift Code" grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="accountHolderName" label="Account Holder Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="accountNumber" label="Account Number" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="openingBalance" label="Opening Balance" type="number" grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="address" label="Address" multiline rows={3} grid={{ xs: 12 }} />
                  </Grid>
                </CommonCard>

                {/* ---------- LOCATION DETAILS ---------- */}
                <CommonCard title="Location" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonSelect
                      label="Country"
                      required
                      options={[]} // Add your country options
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
                    <CommonTextField name="zipCode" label="Zip / Postal Code" grid={{ xs: 12, md: 6 }} />
                  </Grid>
                </CommonCard>

                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                {/* ---------- ACTION BAR ---------- */}
                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty || isSubmitting} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default BankForm;
