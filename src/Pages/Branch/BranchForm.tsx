import { Box, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard } from "../../Components/Common";
import { CommonButton, CommonTextField, CommonSwitch } from "../../Attribute";
import { Mutations } from "../../Api";
import {  GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS, PAGE_TITLE, ROUTES } from "../../Constants";
import { useAppSelector } from "../../Store/hooks";
import {CommonBreadcrumbs} from "../../Components/Common";
import { BranchFormBreadcrumbs } from "../../Data";

const BranchForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const queryClient = useQueryClient();

  const { mutate: addBranchMutate, isPending: isAddLoading } = Mutations.useAddBranch();
  const { mutate: editBranchMutate, isPending: isEditLoading } = Mutations.useEditBranch();
  const isEditing = Boolean(data?._id);

  const handleSubmit = async (values: any) => {
    if (isAddLoading || isEditLoading) return;

    try {
      if (isEditing) {
        const changedFields = GetChangedFields(values, data);
        // let payload = cleanEditPayload(changedFields, data);

        // payload.branchId = data._id;
        // payload.companyId = company?._id;

        // editBranchMutate(payload, {
        //   onSuccess: () => {
        //     queryClient.invalidateQueries({ queryKey: [KEYS.BRANCH.ALL] });
        //     navigate(-1);
        //   },
        // });
      } else {
        let payload = RemoveEmptyFields(values);
        payload.companyId = company?._id;

        addBranchMutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEYS.BRANCH.ALL] });
            navigate(-1);
          },
        });
      }
    } catch (error) {
      console.error("Branch form error:", error);
    }
  };

  return (
     <>
      <CommonBreadcrumbs title={PAGE_TITLE.BRANCH.ADDEDIT} maxItems={1} breadcrumbs={BranchFormBreadcrumbs} />

      <div className="m-4 md:m-6">
   
      

      <Formik
        enableReinitialize
        initialValues={{
          name: data?.name || "",
          address: data?.address || "",
          isActive: data?.isActive ?? true,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <CommonCard title="Branch Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonTextField name="name" label="Branch Name" required grid={{ xs: 12 }} />

                  <CommonTextField name="address" label="Branch Address" required grid={{ xs: 12 }} />

                  <CommonSwitch name="isActive" label="Is Active" value={values.isActive} onChange={(checked) => setFieldValue("isActive", checked)} grid={{ xs: 12 }} />

                  {/* ACTION BUTTONS */}
                  <Grid className="w-full! flex justify-end">
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <CommonButton variant="outlined" title="Back" onClick={() => navigate(-1)} loading={isAddLoading || isEditLoading} />
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

export default BranchForm;
