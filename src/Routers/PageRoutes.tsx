import { ROUTES } from "../Constants";
import Dashboard from "../Pages/Dashboard";
import GeneralSetting from "../Pages/Settings/GeneralSetting";
import SignInForm from "../Pages/Auth/SignInForm";
import { Navigate } from "react-router-dom";

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.SETTINGS.GENERAL, element: <GeneralSetting /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];
