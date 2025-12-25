import { Box, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard, CommonBreadcrumbs } from "../../../Components/Common";
import { CommonButton, CommonTextField, CommonSwitch, CommonSelect } from "../../../Attribute";
import { Mutations } from "../../../Api";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS, PAGE_TITLE } from "../../../Constants";
import { useAppSelector } from "../../../Store/hooks";
import { BankFormBreadCrumbs } from "../../../Data";

const BankForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const queryClient = useQueryClient();

//   const { mutate: addBankMutate, isPending: isAddLoading } = Mutations.useAddBank();
//   const { mutate: editBankMutate, isPending: isEditLoading } = Mutations.useEditBank();

  const isEditing = Boolean(data?._id);

  const handleSubmit = (values: any) => {
    if (isAddLoading || isEditLoading) return;

    if (isEditing) {
      // const changedFields = getChangedFields(values, data);
      // let payload = cleanEditPayload(changedFields, data);

      // payload.bankId = data._id;
      // payload.companyId = company?._id;

      // editBankMutate(payload, {
      //   onSuccess: () => {
      //     queryClient.invalidateQueries({ queryKey: [KEYS.BANK.ALL] });
      //     navigate(-1);
      //   },
      // });
    } else {
      // let payload = removeEmptyFields(values);
      // payload.companyId = company?._id;

      // addBankMutate(payload, {
      //   onSuccess: () => {
      //     queryClient.invalidateQueries({ queryKey: [KEYS.BANK.ALL] });
      //     navigate(-1);
      //   },
      // });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BANK.BANK.ADDEDIT} maxItems={1} breadcrumbs={BankFormBreadCrumbs} />

      <div className="m-4 md:m-6">
        <Formik
          enableReinitialize
          initialValues={{
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
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    {/* SELECT GROUP */}
                    <CommonSelect name="bankGroup" label="Select Group" require d options={[]} grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="bankName" label="Bank Name" required grid={{ xs: 12, md: 6 }} />

                    <CommonTextField name="branchName" label="Branch Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="ifscCode" label="IFSC Code" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="swiftCode" label="Swift Code" grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="accountHolderName" label="Account Holder Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="accountNumber" label="Account Number" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="openingBalance" label="Opening Balance" type="number" grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="address" label="Address" multiline rows={3} grid={{ xs: 12 }} />

                    {/* LOCATION */}
                    <CommonSelect name="country" label="Country" required options={[]} grid={{ xs: 12, md: 4 }} />

                    <CommonSelect name="state" label="State" required options={[]} grid={{ xs: 12, md: 4 }} />

                    <CommonSelect name="city" label="City" required options={[]} grid={{ xs: 12, md: 4 }} />

                    <CommonTextField name="zipCode" label="Zip / Postal Code" grid={{ xs: 12, md: 6 }} />

                    <CommonSwitch name="isActive" label="Is Active" value={values.isActive} onChange={(checked) => setFieldValue("isActive", checked)} grid={{ xs: 12 }} />

                    {/* ACTION BUTTONS */}
                    <Grid className="w-full! flex justify-end">
                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <CommonButton variant="outlined" title="Back" onClick={() => navigate(-1)} />
                        <CommonButton type="submit" variant="contained" title="Save" loading={isAddLoading || isEditLoading || isSubmitting} disabled={isAddLoading || isEditLoading || isSubmitting} />
                      </Box>
                    </Grid>
                  </Grid>
                </CommonCard>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default BankForm;
