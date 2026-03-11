import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonPhoneNumber, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { DebitNoteFormValues, ImageSyncProps } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { DebitNoteFormSchema } from "../../../Utils/ValidationSchemas";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";

const DebitNoteForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  console.log(data);
  const permission = usePagePermission(PAGE_TITLE.ACCOUNTING.DEBIT_NOTE.BASE);
  const [activeImageKey, setActiveImageKey] = useState<"file" | null>(null);
  const dispatch = useAppDispatch();
  const { data: bankAccountData, isLoading: bankAccountLoading } = Queries.useGetBankDropdown();
  const { mutate: addDebitNote, isPending: isAddLoading } = Mutations.useAddDebitNote();
  const { mutate: editDebitNote, isPending: isEditLoading } = Mutations.useEditDebitNote();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: DebitNoteFormValues = useMemo(
    () => ({
      type: data?.type || "receiver",
      date: data?.date || DateConfig.utc().toISOString(),
      bankAccountId: data?.bankAccountId?._id || "",
      amount: data?.amount || "",
      description: data?.description || "",
      phoneNo: {
        countryCode: data?.phoneNo?.countryCode || "",
        phoneNo: data?.phoneNo?.phoneNo || "",
      },
      isActive: data?.isActive ?? true,
    }),
    [data],
  );
  console.log(initialValues);
  const FormikImageSync = <T extends FormikValues>({ activeKey, clearActiveKey }: ImageSyncProps) => {
    const { selectedFiles } = useAppSelector((state) => state.modal);
    const dispatch = useAppDispatch();
    const { setFieldValue } = useFormikContext<T>();

    useEffect(() => {
      if (!selectedFiles[0] || !activeKey) return;

      setFieldValue(activeKey, selectedFiles[0]);

      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, dispatch, clearActiveKey]);

    return null;
  };
  const handleUpload = () => {
    setActiveImageKey("file");
    dispatch(setUploadModal({ open: true, type: "image" }));
  };

  const handleSubmit = async (values: DebitNoteFormValues, { resetForm }: FormikHelpers<DebitNoteFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editDebitNote({ ...changedFields, debitNoteId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addDebitNote(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNTING.DEBIT_NOTE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.DEBIT_NOTE[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<DebitNoteFormValues> enableReinitialize initialValues={initialValues} validationSchema={DebitNoteFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty }) => (
            <Form noValidate>
              <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />
              <Grid container spacing={2}>
                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="bankAccountId" label="Bank Account" options={GenerateOptions(bankAccountData?.data)} isLoading={bankAccountLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="description" label="Description" grid={{ xs: 12, md:8 }} multiline/>
                    <CommonFormImageBox name="file" label="File" type="image" grid={{ xs: 12 }} onUpload={handleUpload} onDelete={() => setFieldValue("file", null)} />

                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                  </Grid>
                </CommonCard>
                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default DebitNoteForm;
