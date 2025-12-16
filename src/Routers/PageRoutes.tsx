import { ROUTES } from "../Constants";
import Dashboard from "../Pages/Dashboard";
import GeneralSetting from "../Pages/Settings/GeneralSetting";
import SignInForm from "../Pages/Auth/SignInForm";
import { Navigate } from "react-router-dom";
import { EditCompany } from "../Components/Settings/GeneralSetting";
import Employees from "../Pages/Employee";
import EmployeeEdit from "../Pages/Employee/EmployeeEdit";
import Branch from "../Pages/Branch";
import BranchEdit from "../Pages/Branch/BranchEdit";

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.SETTINGS.GENERAL, element: <GeneralSetting /> },
  { path: ROUTES.COMPANY.EDIT, element: <EditCompany /> },
  { path: ROUTES.EMPLOYEE.LIST, element: <Employees /> },
  { path: ROUTES.EMPLOYEE.EDIT, element: <EmployeeEdit /> },
  { path: ROUTES.BRANCH.BASE, element: <Branch /> },
  { path: ROUTES.BRANCH.EDIT, element: <BranchEdit /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];

export const ComponentRoutes = [
  //  {path: ROUTES.COMPONENTS.EDIT_COMPANY, element: <EditCompany />},
];
