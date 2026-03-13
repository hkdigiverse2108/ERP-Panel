import { Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { Mutations } from "../../../Api";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setCompanyDriveModal, setSelectedFiles, setUploadModal, } from "../../../Store/Slices/ModalSlice";
import type { CompanyDriveFormValues, ImageSyncProps } from "../../../Types";
import { CompanyDriveCreateSchema } from "../../../Utils/ValidationSchemas";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { RemoveEmptyFields, GetChangedFields } from "../../../Utils";
import { PAGE_TITLE } from "../../../Constants";

const CompanyDriveForm = () => {
  const dispatch = useAppDispatch();
  const { isCompanyDriveModal, selectedFiles } = useAppSelector((state) => state.modal);
  const data = isCompanyDriveModal?.data;
  const open = isCompanyDriveModal?.open;

  const [activeFileKey, setActiveFileKey] = useState<"documentUrl" | null>(null);
  const { mutate: addCompanyDrive, isPending: isAddLoading } = Mutations.useAddCompanyDrive();
  const { mutate: editCompanyDrive, isPending: isEditLoading } = Mutations.useEditCompanyDrive();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: CompanyDriveFormValues = {
    documentName: data?.documentName || "",
    documentUrl: data?.documentUrl || "",
    remark: data?.remark || "",
    isActive: data?.isActive ?? true,
  };

  const FormikFileSync = <T extends FormikValues>({ activeKey, clearActiveKey }: ImageSyncProps) => {
    const { setFieldValue } = useFormikContext<T>();

    useEffect(() => {
      if (
        !selectedFiles[0] || !activeKey) return;
      setFieldValue(activeKey, selectedFiles[0]);
      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, clearActiveKey, dispatch]);

    return null;
  };

  const closeModal = () => dispatch(setCompanyDriveModal({ open: false, data: null }))
  const handleUpload = () => { setActiveFileKey("documentUrl"); dispatch(setUploadModal({ open: true, type: "pdf", multiple: false })); };

  const handleSubmit = (values: CompanyDriveFormValues) => {
    const onSuccess = () => closeModal();
    if (isEditing) {
      const changedFields = GetChangedFields(values, data ?? {});
      const payload = RemoveEmptyFields(changedFields);

      if (Object.keys(payload).length === 0) { onSuccess(); return; }
      editCompanyDrive({ documentId: data?._id, ...payload }, { onSuccess });
    } else {
      const payload = RemoveEmptyFields(values);
      addCompanyDrive(payload, { onSuccess });
    }
  };
  return (
    <CommonModal title={PAGE_TITLE.COMPANY_DRIVE[pageMode]} isOpen={open} onClose={() => closeModal()} className="max-w-125">
      <Formik enableReinitialize initialValues={initialValues} validationSchema={CompanyDriveCreateSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <FormikFileSync activeKey={activeFileKey} clearActiveKey={() => setActiveFileKey(null)} />
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="documentName" label="Document Name" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="remark" label="Remark" multiline required rows={2} grid={{ xs: 12 }} />
              <CommonFormImageBox name="documentUrl" label="PDF" type="pdf" grid={{ xs: 12 }} required onUpload={handleUpload} />
              {!isEditing && <CommonValidationSwitch name="isActive" label="Active" grid={{ xs: 12 }} />}

              <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                <CommonButton variant="outlined" title="Cancel" onClick={() => { closeModal(); }} />
                <CommonButton type="submit" variant="contained" title="Save" loading={isAddLoading || isEditLoading} disabled={!dirty} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default CompanyDriveForm;
