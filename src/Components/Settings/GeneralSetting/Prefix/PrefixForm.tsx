import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations } from "../../../../Api";
import { CommonButton, CommonValidationTextField } from "../../../../Attribute";
import { PAGE_TITLE } from "../../../../Constants";
import { useAppSelector } from "../../../../Store/hooks";
import { setPrefixModal } from "../../../../Store/Slices/ModalSlice";
import type { PrefixFormValues } from "../../../../Types";
import { GetChangedFields, PrefixFormSchema } from "../../../../Utils";
import { CommonModal } from "../../../Common";

const PrefixForm = () => {
  const { mutate: editPrefix, isPending: isEditLoading } = Mutations.useEditPrefix();

  const dispatch = useDispatch();
  const { isPrefixModal } = useAppSelector((state) => state.modal);

  const isEdit = isPrefixModal.data;
  const openModal = isPrefixModal.open;

  const initialValues: PrefixFormValues = {
    prefix: isEdit?.prefix || "",
    sequenceNumber: isEdit?.sequenceNumber || 1,
  };

  const closeModal = () => dispatch(setPrefixModal({ open: false, data: null }));

  const handleSubmit = (values: PrefixFormValues, { resetForm }: FormikHelpers<PrefixFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isPrefixModal.data?._id) {
      const changedFields = GetChangedFields(values, isEdit as Partial<PrefixFormValues>);
      editPrefix({ ...changedFields, prefixId: isEdit?._id }, { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.SETTINGS.PREFIX.EDIT} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<PrefixFormValues> enableReinitialize initialValues={initialValues} validationSchema={PrefixFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="prefix" label="Prefix" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="sequenceNumber" label="Sequence Number" type="number" required grid={{ xs: 12 }} />

              <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                <CommonButton variant="outlined" onClick={closeModal} title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Save" loading={isEditLoading} disabled={!dirty} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};
export default PrefixForm;
