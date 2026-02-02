import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonPhoneNumber, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import { useAppSelector } from "../../Store/hooks";
import type { EmployeeFormValues } from "../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { EmployeeFormSchema } from "../../Utils/ValidationSchemas";
import { useEffect } from "react";
import { useDependentReset, usePagePermission } from "../../Utils/Hooks";

const EmployeeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);
  const permission = usePagePermission(PAGE_TITLE.USER.BASE);

  const { data: rolesData, isLoading: rolesDataLoading } = Queries.useGetRolesDropdown();
  const { data: branchData, isLoading: branchDataLoading } = Queries.useGetBranchDropdown();
  const { mutate: addEmployee, isPending: isAddLoading } = Mutations.useAddEmployee();
  const { mutate: editEmployee, isPending: isEditLoading } = Mutations.useEditEmployee();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: EmployeeFormValues = {
    fullName: data?.fullName || "",
    username: data?.username || "",
    designation: data?.designation || "",
    phoneNo: {
      countryCode: data?.phoneNo?.countryCode || "",
      phoneNo: data?.phoneNo?.phoneNo || "",
    },
    email: data?.email || "",
    panNumber: data?.panNumber || "",
    role: data?.role?._id || "",
    branchId: data?.branchId?._id || "",
    password: data?.showPassword || "",
    userType: data?.userType || "employee",
    address: {
      address: data?.address?.address || "",
      country: data?.address?.country?._id || "",
      state: data?.address?.state?._id || "",
      city: data?.address?.city?._id || "",
      pinCode: data?.address?.pinCode || null,
    },

    bankDetails: {
      name: data?.bankDetails?.name || "",
      branchName: data?.bankDetails?.branchName || "",
      accountNumber: data?.bankDetails?.accountNumber || null,
      bankHolderName: data?.bankDetails?.bankHolderName || "",
      swiftCode: data?.bankDetails?.swiftCode || "",
      IFSCCode: data?.bankDetails?.IFSCCode || "",
    },

    wages: data?.wages || null,
    commission: data?.commission || null,
    extraWages: data?.extraWages || null,
    target: data?.target || null,
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: EmployeeFormValues, { resetForm }: FormikHelpers<EmployeeFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest, companyId: company!._id, userType: "employee" };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editEmployee({ ...changedFields, userId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addEmployee(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  const AddressDependencyHandler = () => {
    useDependentReset([
      { when: "address.country", reset: ["address.state", "address.city"] },
      { when: "address.state", reset: ["address.city"] },
    ]);
    return null;
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.USER[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.USERS[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<EmployeeFormValues> enableReinitialize initialValues={initialValues} validationSchema={EmployeeFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty, values }) => (
            <Form noValidate>
              <AddressDependencyHandler />
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="fullName" label="Full Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="username" label="User Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="designation" label="User designation" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="role" label="role" options={GenerateOptions(rolesData?.data)} isLoading={rolesDataLoading} grid={{ xs: 12, md: 4 }} required/>
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} required/>
                    <CommonValidationTextField name="panNumber" label="PAN No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="branchId" label="branch" options={GenerateOptions(branchData?.data)} isLoading={branchDataLoading} grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="password" label="Password" type="password" showPasswordToggle required grid={{ xs: 10, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* ADDRESS DETAILS */}
                <CommonCard title="Address Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="address.address" label="Address" required grid={{ xs: 12, md: 4 }} />
                    <DependentSelect name="address.country" label="Country" grid={{ xs: 12, md: 4 }} query={Queries.useGetCountryLocation} required />
                    <DependentSelect params={values?.address?.country} name="address.state" label="State" grid={{ xs: 12, md: 4 }} query={Queries.useGetStateLocation} disabled={!values?.address?.country} required />
                    <DependentSelect params={values?.address?.state} name="address.city" label="City" grid={{ xs: 12, md: 4 }} query={Queries.useGetCityLocation} disabled={!values?.address?.state} required />
                    <CommonValidationTextField name="address.pinCode" label="Pin Code" required type="number" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* BANK DETAILS */}
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="bankDetails.name" label="Bank Name" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.branchName" label="Branch Name" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.accountNumber" label="Account No." type="number" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.bankHolderName" label="Account Holder Name" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.swiftCode" label="Swift Code" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.IFSCCode" label="IFSC Code" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* SALARY DETAILS */}
                <CommonCard title="Salary Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="wages" label="Wages" type="number" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="commission" type="number" label="Commission" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="extraWages" type="number" label="Extra Wages" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="target" type="number" label="Target" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>
                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default EmployeeForm;
