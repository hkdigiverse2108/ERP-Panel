import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations } from "../../../../Api";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../../../Attribute";
import { PAGE_TITLE } from "../../../../Constants";
import { useAppSelector } from "../../../../Store/hooks";
import { setPrefixModal } from "../../../../Store/Slices/ModalSlice";
import type { PrefixFormValues } from "../../../../Types";
import { GetChangedFields, PrefixFormSchema, RemoveEmptyFields } from "../../../../Utils";
import { CommonModal } from "../../../Common";

const PrefixForm = () => {
  const { mutate: addPrefix, isPending: isAddLoading } = Mutations.useAddPrefix();
  const { mutate: editPrefix, isPending: isEditLoading } = Mutations.useEditPrefix();

  const dispatch = useDispatch();
  const { isPrefixModal } = useAppSelector((state) => state.modal);

  const isEdit = isPrefixModal.data;
  const openModal = isPrefixModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: PrefixFormValues = {
    name: isEdit?.name || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setPrefixModal({ open: false, data: null }));

  const handleSubmit = (values: PrefixFormValues, { resetForm }: FormikHelpers<PrefixFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<PrefixFormValues>);
      editPrefix({ ...changedFields, prefixId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addPrefix(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.SETTINGS.PREFIX[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<PrefixFormValues> enableReinitialize initialValues={initialValues} validationSchema={PrefixFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="name" label="Tax Name" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="percentage" label="percentage" type="number" required grid={{ xs: 12 }} />

              {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
              <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                <CommonButton variant="outlined" onClick={closeModal} title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Save" loading={isEditLoading || isAddLoading} disabled={!dirty} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};
export default PrefixForm;
