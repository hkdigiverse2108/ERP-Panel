import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import type { FC } from "react";
import { Mutations, Queries } from "../../../../Api";
import { CommonButton, CommonValidationTextField, CommonValidationSwitch, CommonValidationSelect } from "../../../../Attribute";
import { PAGE_TITLE } from "../../../../Constants";
import type { AdditionalChargesBase, AdditionalChargesFormValues } from "../../../../Types/AdditionalCharges";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../../Utils";
import { AdditionalChargesFormSchema } from "../../../../Utils/ValidationSchemas";
import { CommonCard, CommonModal } from "../../../Common";

interface Props {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  isEdit: AdditionalChargesBase;
}

const AdditionalChargesForm: FC<Props> = ({ openModal, setOpenModal, isEdit }) => {
  const { mutate: addAdditionalCharge, isPending: isAddLoading } = Mutations.useAddAdditionalCharges();
  const { mutate: editAdditionalCharge, isPending: isEditLoading } = Mutations.useEditAdditionalCharges();
  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown();

  const isEditing = Boolean(isEdit?._id);

  const initialValues: AdditionalChargesFormValues = {
    type: isEdit?.type || "",
    name: isEdit?.name || "",
    hsnSac: isEdit?.hsnSac || "",
    taxId: isEdit?.taxId || "",
    accountGroupId: isEdit?.accountGroupId || "",
    isActive: isEdit?.isActive ?? true,
    defaultValue: isEdit?.defaultValue || { value: 0, type: "flat" },
  };

  const handleSubmit = (values: AdditionalChargesFormValues, { resetForm }: FormikHelpers<AdditionalChargesFormValues>) => {
    if (isEditing) {
      const changed = GetChangedFields(values, isEdit);
      editAdditionalCharge(
        { ...changed, additionalChargeId: isEdit._id },
        {
          onSuccess: () => {
            resetForm();
            setOpenModal(false);
          },
        },
      );
    } else {
      addAdditionalCharge(RemoveEmptyFields(values), {
        onSuccess: () => {
          resetForm();
          setOpenModal(false);
        },
      });
    }
  };

  return (
    <CommonModal title={isEditing ? PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.EDIT : PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.ADD} isOpen={openModal} onClose={() => setOpenModal(false)} className="max-w-125 m-2 sm:m-5">
      <Formik enableReinitialize initialValues={initialValues} validationSchema={AdditionalChargesFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2}>
              <CommonCard hideDivider grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField name="name" label="Additional Charge" required grid={{ xs: 12 }} />

                  <CommonValidationTextField name="type" label="Default value" required grid={{ xs: 12 }} isCurrency currencyDisabled />

                  <CommonValidationSelect name="taxId" label="Select Tax" isLoading={TaxDataLoading} options={GenerateOptions(TaxData?.data)} required grid={{ xs: 12 }} />

                  <CommonValidationSelect name="accountGroupId" label="Select Group" options={[]} required grid={{ xs: 12 }} />

                  <CommonValidationTextField name="hsnSac" label="HSN / SAC" grid={{ xs: 12 }} />

                  {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton variant="outlined" title="Cancel" onClick={() => setOpenModal(false)} />
                    <CommonButton type="submit" variant="contained" title="Save" loading={isAddLoading || isEditLoading} disabled={!dirty} />
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

export default AdditionalChargesForm;
