import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonTextField, CommonValidationSwitch } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import { useAppSelector } from "../../Store/hooks";
import type { BranchFormValues } from "../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../Utils";
// import { BranchFormSchema } from "../../Utils/ValidationSchemas";

const BranchForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const { mutate: addBranch, isPending: isAddLoading } = Mutations.useAddBranch();
  const { mutate: editBranch, isPending: isEditLoading } = Mutations.useEditBranch();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: BranchFormValues = {
    name: data?.name || "",
    address: data?.address || "",
    isActive: data?.isActive || true,
  };

  const handleSubmit = (values: BranchFormValues, { resetForm }: FormikHelpers<BranchFormValues>) => {
    const { _submitAction, ...rest } = values;

    const onSuccessHandler = () => {
      if (_submitAction === "saveAndNew") resetForm({ values: initialValues });
      else navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(rest, data);
      editBranch({ ...changedFields, branchId: data._id, companyId: company!._id }, { onSuccess: onSuccessHandler });
    } else {
      addBranch({ ...RemoveEmptyFields(rest), companyId: company!._id }, { onSuccess: onSuccessHandler });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BRANCH[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.BRANCH[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<BranchFormValues> enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="name" label="Branch Name" required grid={{ xs: 12 }} />
                    <CommonTextField name="address" label="Branch Address" required grid={{ xs: 12 }} />
                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                  </Grid>
                  <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                </CommonCard>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default BranchForm;
