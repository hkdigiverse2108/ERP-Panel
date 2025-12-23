import { Box, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonButton, CommonSwitch, CommonTextField } from "../../Attribute";
import { CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { EmployeeFormBreadcrumbs } from "../../Data";
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

  const initialValues: EmployeeFormValues = {
    name: data?.name || "",
    username: data?.username || "",
    phoneNo: data?.phoneNo || "",
    email: data?.email || "",
    panNumber: data?.panNumber || "",
    role: data?.role || "",

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

  const handleSubmit = (values: EmployeeFormValues) => {
    if (isAddLoading || isEditLoading) return;
    if (isEditing) {
      const changedFields = GetChangedFields(values, data);
      editEmployee({ ...changedFields, employeeId: data._id, companyId: company!._id }, { onSuccess: () => navigate(-1) });
    } else {
      addEmployee({ ...RemoveEmptyFields(values), companyId: company!._id }, { onSuccess: () => navigate(-1) });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.EMPLOYEE.ADDEDIT} maxItems={1} breadcrumbs={EmployeeFormBreadcrumbs} />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Formik<EmployeeFormValues> enableReinitialize initialValues={initialValues} validationSchema={EmployeeFormSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="name" label="Employee Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="username" label="User Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="role" label="Role" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="phoneNo" label="Phone No." required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="email" label="Email" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="panNumber" label="PAN No." inputProps={{ textTransform: "uppercase" }} grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="branch" label="branch" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* ADDRESS DETAILS */}
                <CommonCard title="Address Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="address.address" label="Address" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="address.country" label="Country" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="address.state" label="State" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="address.city" label="City" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="address.postalCode" label="ZIP Code" type="number" grid={{ xs: 12, md: 4 }} />
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

                <CommonSwitch name="isActive" label="Is Active" value={values.isActive} onChange={(checked) => setFieldValue("isActive", checked)} grid={{ xs: 12 }} />
                {/* ACTION BUTTONS */}
                <Grid className="w-full! flex justify-end">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                    <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Back" loading={isEditLoading || isAddLoading} />
                    <CommonButton type="submit" variant="contained" title="Save" loading={isEditLoading || isAddLoading} disabled={isEditLoading || isAddLoading} />
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default EmployeeForm;
