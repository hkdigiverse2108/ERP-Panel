import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import type { FC } from "react";
import { CommonCard, CommonModal } from "../../../Components/Common";
import { CommonButton, CommonValidationTextField } from "../../../Attribute";
import type { FormValues, TermsAndConditionModalProps, TermsConditionBase } from "../../../Types/TermsAndCondition";
import { useAppSelector } from "../../../Store/hooks";
import { useDispatch } from "react-redux";
import { setTermsAndConditionModal } from "../../../Store/Slices/ModalSlice";


const TermsAndConditionModal: FC<TermsAndConditionModalProps> = ({ onSave }) => {
  const { isTermsAndConditionModal } = useAppSelector((state) => state.modal);
  const dispatch = useDispatch();
  const openModal = isTermsAndConditionModal.open;
  const data = isTermsAndConditionModal.data as TermsConditionBase | null;
  const isEditing = Boolean(data?._id);
  const initialValues: FormValues = {
    termsCondition: data?.termsCondition || "",
  };

  const closeModal = () => {
    dispatch(setTermsAndConditionModal({ open: false, data: null }));
  };

  const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    if (isEditing) {
      const payload: TermsConditionBase = {
        ...data!,
        termsCondition: values.termsCondition,
      };

      onSave(payload);
    } else {
      const payload: TermsConditionBase = {
        _id: Date.now().toString(), 
        termsCondition: values.termsCondition,
        isActive: true,
      };

      onSave(payload);
    }

    resetForm();
    closeModal();
  };

  return (
    <CommonModal title={isEditing ? "Edit Terms & Conditions" : "Add Terms & Conditions"} isOpen={openModal} onClose={closeModal} className="max-w-125 m-2 sm:m-5">
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2}>
              <CommonCard hideDivider grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField name="termsCondition" label="Terms & Conditions" multiline rows={4} required grid={{ xs: 12 }} />

                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton variant="outlined" title="Cancel" onClick={closeModal} />
                    <CommonButton type="submit" variant="contained" title="Save" disabled={!dirty} />
                  </Grid>
                </Grid>
              </CommonCard>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default TermsAndConditionModal;
