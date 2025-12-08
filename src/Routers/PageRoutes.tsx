import { ROUTES } from "../Constants";
import Dashboard from "../Pages/Dashboard";
import GeneralSetting from "../Pages/Settings/General";
import SignInForm from "../Pages/Auth/SignInForm";

export const PageRoutes = [
  // { path: ROUTES.HOME, element: <Dashboard /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.SETTINGS.GENERAL, element: <GeneralSetting /> },
];

export const AuthRoutes = [{ path: ROUTES.AUTH.LOGIN, element: <SignInForm/> }];
