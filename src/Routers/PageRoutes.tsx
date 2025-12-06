import { Navigate } from "react-router-dom";
import { ROUTES } from "../Constants";
import Dashboard from "../Pages/Dashboard";
import SignUpForm from "../Pages/auth/SignUpfurm";
import SignInForm from "../Pages/auth/Signinform";

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
];

export const AuthRoutes = [{ path: ROUTES.AUTH.LOGIN, element: <SignInForm/> }];
