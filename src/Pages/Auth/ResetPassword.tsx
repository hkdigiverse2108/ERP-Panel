import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonButton, CommonValidationTextField } from "../../Attribute";
import { ImagePath, ROUTES, ThemeTitle } from "../../Constants";
import ThemeToggler from "../../Layout/ThemeToggler";
import { useAppSelector } from "../../Store/hooks";
import { ResetPasswordSchema } from "../../Utils/ValidationSchemas";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import type { ResetPasswordFormValues, UpdatePasswordPayload } from "../../Types";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { signinResponse } = useAppSelector((state) => state.auth);
  const { mutate: resetPassword, isPending: isLoading } = Mutations.useUpdatePassword();

  const handleSubmit = async (values: ResetPasswordFormValues, { resetForm }: FormikHelpers<ResetPasswordFormValues>) => {
    const payload: UpdatePasswordPayload = {
      email: signinResponse?.email || "",
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };

    resetPassword(payload, {
      onSuccess: () => {
        resetForm();
        navigate(ROUTES.AUTH.SIGNIN);
      },
    });
  };

  useEffect(() => {
    if (!signinResponse?.email) {
      navigate(ROUTES.AUTH.SIGNIN);
    }
  }, [navigate, signinResponse]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen relative">
      <div className="hidden w-full lg:grid lg:w-1/2 h-full bg-brand-950 relative dark:bg-white/5">
        <div>
          <img src={`${ImagePath}logo/grid-01.svg`} alt="pattern" className="absolute w-full z-1 right-0 top-0 max-w-[300px] xl:max-w-[500px]" />
        </div>
        <div>
          <img src={`${ImagePath}logo/grid-01.svg`} alt="pattern" className="absolute bottom-0 left-0 w-full max-w-[300px] rotate-180 xl:max-w-[500px]" />
        </div>
        <div className="absolute overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
          <img src={`${ImagePath}logo/logo-dark.png`} alt="Logo" className="w-39 h-11" />
          <p className="text-gray-300 text-sm flex pt-3">{ThemeTitle}</p>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full h-full px-5 pt-10 lg:px-10">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-10 lg:mt-0 gap-10">
          <div>
            <div className="mb-4 sm:mb-5">
              <Link to={ROUTES.AUTH.SIGNIN} className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-brand-950 dark:hover:text-white">
                <ArrowBackIosIcon sx={{ fontSize: 12 }} />
                Back to Sign In
              </Link>
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Reset Password</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Please enter your new password to reset.</p>
            </div>
            <Formik initialValues={{ newPassword: "", confirmPassword: "" }} validationSchema={ResetPasswordSchema} onSubmit={handleSubmit}>
              <Form>
                <Grid container spacing={2}>
                  <CommonValidationTextField name="newPassword" label="New Password" placeholder="Enter new password" type="password" required isFormLabel showPasswordToggle grid={{ xs: 12 }} />
                  <CommonValidationTextField name="confirmPassword" label="Confirm Password" placeholder="Confirm your new password" type="password" required isFormLabel showPasswordToggle grid={{ xs: 12 }} />
                  <CommonButton loading={isLoading} type="submit" variant="contained" title="Reset Password" size="medium" fullWidth grid={{ xs: 12 }} />
                </Grid>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 right-5 z-50">
        <ThemeToggler />
      </div>
    </div>
  );
};

export default ResetPassword;
