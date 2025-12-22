import { Box, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard } from "../../Components/Common";
import { CommonButton, CommonSwitch, CommonTextField } from "../../Attribute";
import { Mutations } from "../../Api";
import { cleanEditPayload, getChangedFields, removeEmptyFields } from "../../Utils";
import { useAppSelector } from "../../Store/hooks";
import { boolean, number } from "yup";
import { EmployeeFormSchema } from "../../Utils/ValidationSchemas";

const EmployeeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const { mutate: editEmployeeMutate, isPending: isEditLoading } = Mutations.useEditEmployee();
  const { mutate: addEmployeeMutate, isPending: isAddLoading } = Mutations.useAddEmployee();

  const isEditing = Boolean(data?._id);

  const initialValues = {
    name: data?.name || "",
    username: data?.username || "",
    mobileNo: data?.mobileNo || "",
    email: data?.email || "",
    panNumber: data?.panNumber || null,
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
    },

    wages: data?.wages || null,
    commission: data?.commission || null,
    extraWages: data?.extraWages || null,
    target: data?.target || null,
    isActive: data?.isActive || false,
  };

  const handleSubmit = async (values: any) => {
    if (isEditLoading || isAddLoading) return;
    try {
      if (isEditing) {
        const changedFields = getChangedFields(values, data);

        let payload = cleanEditPayload(changedFields, data);
        payload.companyId = company?._id;
        payload.employeeId = data._id;

        editEmployeeMutate(payload, {
          onSuccess: () => {
            navigate(-1);
          },
        });
      } else {
        let payload = removeEmptyFields(values);
        payload.companyId = company?._id;

        addEmployeeMutate(payload, {
          onSuccess: () => {
            navigate(-1);
          },
        });
      }
    } catch (error) {
      console.error("error -> ", error);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <h2 style={{ marginBottom: 16 }}> {isEditing ? "Edit" : "Add"} Employee </h2>

      <Formik enableReinitialize initialValues={initialValues} validationSchema={EmployeeFormSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue, isSubmitting }) => (
          <Form noValidate>
            <Grid container spacing={2}>
              {/* BASIC DETAILS */}
              <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonTextField name="name" label="Employee Name" required grid={{ xs: 12, md: 4 }} />
                  <CommonTextField name="username" label="User Name" required grid={{ xs: 12, md: 4 }} />
                  <CommonTextField name="role" label="Role" required grid={{ xs: 12, md: 4 }} />
                  <CommonTextField name="mobileNo" label="Mobile No." required grid={{ xs: 12, md: 4 }} />
                  <CommonTextField name="email" label="Email" required grid={{ xs: 12, md: 4 }} />
                  <CommonTextField name="panNumber" label="PAN No." inputProps={{ textTransform: "uppercase" }} grid={{ xs: 12, md: 4 }} />
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

              <CommonSwitch name="isActive" label="Is Active" value={values.isActive} onChange={(checked) => setFieldValue("isActive", checked)} grid={{ xs: 12, md: 12 }} />
              {/* ACTION BUTTONS */}
              <Grid className="w-full! flex justify-end ">
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Back" loading={isEditLoading || isAddLoading} />
                  <CommonButton type="submit" variant="contained" title="Save" loading={isEditLoading || isAddLoading || isSubmitting} disabled={isEditLoading || isAddLoading || isSubmitting} />
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EmployeeForm;
