import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, COUPON_STATUS, DISCOUNT_APPLICABLE, DISCOUNT_MODE, VALUE_TYPE } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import type { DiscountFormValues } from "../../../Types";
import { DiscountFormSchema, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";

const DiscountForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);
  const permission = usePagePermission(PAGE_TITLE.CRM.DISCOUNT.BASE);

  const { mutate: addDiscount, isPending: isAddLoading } = Mutations.useAddDiscount();
  const { mutate: editDiscount, isPending: isEditLoading } = Mutations.useEditDiscount();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: DiscountFormValues = {
    title: data?.title || "",
    isActive: data?.isActive || true,
  };

  const handleSubmit = async (values: DiscountFormValues, { resetForm }: FormikHelpers<DiscountFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest, companyId: company!._id };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editDiscount({ ...changedFields, discountId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addDiscount(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CRM.DISCOUNT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.DISCOUNT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: { xs: 17, md: 8 } }}>
        <Formik<DiscountFormValues> enableReinitialize initialValues={initialValues} validationSchema={DiscountFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="title" label="Title" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="discountCode" label="Discount Code" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSwitch name="autoApply" label="Auto Apply" grid={"auto"} />
                    <CommonValidationSwitch name="excludeAlreadyDiscounted" label="Exclude Already Discounted" grid={"auto"} />
                    <CommonValidationSelect name="discountApplicable" label="Discount Applicable" options={DISCOUNT_APPLICABLE} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="discountMode" label="Discount Mode" options={DISCOUNT_MODE} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="discountType" label="Discount Type" options={VALUE_TYPE} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="discountValue" label="Discount Value" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="buyXGetY" label="Buy X Get Y" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="productAtFixAmount" label="Product At Fix Amount" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="usageLimit" label="Usage Limit" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="expiryDays" label="Expiry Days" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationDatePicker name="startDate" label="Start Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationDatePicker name="endDate" label="End Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="status" label="Status" options={COUPON_STATUS} grid={{ xs: 12, md: 4 }} required />
                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={"auto"} />}
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

export default DiscountForm;
