import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonTextField, CommonValidationSelect, CommonValidationSwitch } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, PRODUCT_TYPE_OPTIONS } from "../../Data";
import { useAppSelector } from "../../Store/hooks";
import type { EmployeeFormValues } from "../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { EmployeeFormSchema } from "../../Utils/ValidationSchemas";

const EmployeeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const { mutate: addEmployee, isPending: isAddLoading } = Mutations.useAddEmployee();
  const { mutate: editEmployee, isPending: isEditLoading } = Mutations.useEditEmployee();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: EmployeeFormValues = {
    name: data?.name || "",
    username: data?.username || "",
    designation: data?.designation || "",
    phoneNo: data?.phoneNo || "",
    email: data?.email || "",
    panNumber: data?.panNumber || "",
    role: data?.role || "",
    branchId: data?.branchId || "",

    address: {
      address: data?.address?.address || "",
      country: data?.address?.country || "",
      state: data?.address?.state || "",
      city: data?.address?.city || "",
      postalCode: data?.address?.postalCode || null,
    },

    bankDetails: {
      bankName: data?.bankDetails?.bankName || "",
      branch: data?.bankDetails?.branch || "",
      accountNumber: data?.bankDetails?.accountNumber || null,
      bankHolderName: data?.bankDetails?.bankHolderName || "",
      swiftCode: data?.bankDetails?.swiftCode || "",
      IFSCCode: data?.bankDetails?.IFSCCode || "",
    },

    wages: data?.wages || null,
    commission: data?.commission || null,
    extraWages: data?.extraWages || null,
    target: data?.target || null,
    isActive: data?.isActive || false,
  };

  const handleSubmit = (values: EmployeeFormValues, { resetForm }: FormikHelpers<EmployeeFormValues>) => {
    const { _submitAction, ...rest } = values;

    const onSuccessHandler = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(rest, data);
      editEmployee({ ...changedFields, employeeId: data._id, companyId: company!._id }, { onSuccess: () => onSuccessHandler() });
    } else {
      addEmployee({ ...RemoveEmptyFields(rest), companyId: company!._id }, { onSuccess: () => onSuccessHandler() });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.EMPLOYEE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.EMPLOYEE[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<EmployeeFormValues> enableReinitialize initialValues={initialValues} validationSchema={EmployeeFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="name" label="Employee Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="username" label="User Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="designation" label="User designation" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="role" label="role" options={PRODUCT_TYPE_OPTIONS} grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="phoneNo" label="Phone No." required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="panNumber" label="PAN No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="branchId" label="branch" options={PRODUCT_TYPE_OPTIONS} grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* ADDRESS DETAILS */}
                <CommonCard title="Address Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="address.address" label="Address" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="address.country" label="Country" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="address.state" label="State" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="address.city" label="City" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="address.postalCode" label="ZIP Code" required type="number" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* BANK DETAILS */}
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="bankDetails.bankName" label="Bank Name" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="bankDetails.branch" label="Branch Name" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="bankDetails.accountNumber" label="Account No." type="number" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="bankDetails.bankHolderName" label="Account Holder Name" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="bankDetails.swiftCode" label="Swift Code" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="bankDetails.IFSCCode" label="IFSC Code" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* SALARY DETAILS */}
                <CommonCard title="Salary Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="wages" label="Wages" type="number" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="commission" type="number" label="Commission" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="extraWages" type="number" label="Extra Wages" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="target" type="number" label="Target" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />

                <CommonBottomActionBar clear isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default EmployeeForm;
