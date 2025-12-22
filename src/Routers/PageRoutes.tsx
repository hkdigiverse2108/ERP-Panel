import { ROUTES } from "../Constants";
import Dashboard from "../Pages/Dashboard";
import GeneralSetting from "../Pages/Settings/GeneralSetting";
import SignInForm from "../Pages/Auth/SignInForm";
import { Navigate } from "react-router-dom";
import { EditCompany } from "../Components/Settings/GeneralSetting";
import Employees from "../Pages/Employee";
import EmployeeForm from "../Pages/Employee/EmployeeForm";
import Branch from "../Pages/Branch";
import BranchForm from "../Pages/Branch/BranchForm";
import Product from "../Pages/Inventory/Product";
import ProductForm from "../Pages/Inventory/Product/ProductForm";
import Stocks from "../Pages/Inventory/Stock";
import Contact from "../Pages/Contacts";
import ContactForm from "../Pages/Contacts/ContactForm";

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.SETTINGS.GENERAL, element: <GeneralSetting /> },
  { path: ROUTES.COMPANY.EDIT, element: <EditCompany /> },
  { path: ROUTES.EMPLOYEE.BASE, element: <Employees /> },
  { path: ROUTES.EMPLOYEE.ADD_EDIT, element: <EmployeeForm /> },
  { path: ROUTES.BRANCH.BASE, element: <Branch /> },
  { path: ROUTES.BRANCH.ADD_EDIT, element: <BranchForm /> },
  { path: ROUTES.PRODUCT.BASE, element: <Product /> },
  { path: ROUTES.PRODUCT.ADD_EDIT, element: <ProductForm /> },
  { path: ROUTES.STOCK.BASE, element: <Stocks /> },
  { path: ROUTES.CONTACT.BASE, element: <Contact /> },
  { path: ROUTES.CONTACT.ADD_EDIT, element: <ContactForm /> },
];
export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];

export const ComponentRoutes = [
  //  {path: ROUTES.COMPONENTS.EDIT_COMPANY, element: <EditCompany />},
];
