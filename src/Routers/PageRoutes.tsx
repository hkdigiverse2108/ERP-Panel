import { Navigate } from "react-router-dom";
import { CompanyForm, UserForm } from "../Components/Settings/GeneralSetting";
import { ROUTES } from "../Constants";
import SignInForm from "../Pages/Auth/SignInForm";
import Bank from "../Pages/Bank/Bank";
import BankForm from "../Pages/Bank/Bank/BankForm";
import BankTransaction from "../Pages/Bank/BankTransaction";
import PaymentList from "../Pages/Bank/Payment";
import PaymentForm from "../Pages/Bank/Payment/PaymentForm";
import Contact from "../Pages/Contacts";
import ContactForm from "../Pages/Contacts/ContactForm";
import Dashboard from "../Pages/Dashboard";
import Employees from "../Pages/Employee";
import EmployeeForm from "../Pages/Employee/EmployeeForm";
import Product from "../Pages/Inventory/Product";
import ProductRequestForm from "../Pages/Inventory/Product/ProductRequestForm";
import Recipe from "../Pages/Inventory/Recipe";
import RecipeForm from "../Pages/Inventory/Recipe/RecipeFrom";
import Stocks from "../Pages/Inventory/Stock";
import StockForm from "../Pages/Inventory/Stock/StockForm";
import NewPos from "../Pages/POS/New";
import GeneralSetting from "../Pages/Settings/GeneralSetting";

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },

  { path: ROUTES.DASHBOARD, element: <Dashboard /> },

  { path: ROUTES.SETTINGS.GENERAL, element: <GeneralSetting /> },
  { path: ROUTES.COMPANY.EDIT, element: <CompanyForm /> },
  { path: ROUTES.USER.EDIT, element: <UserForm /> },

  { path: ROUTES.EMPLOYEE.BASE, element: <Employees /> },
  { path: ROUTES.EMPLOYEE.ADD_EDIT, element: <EmployeeForm /> },

  { path: ROUTES.PRODUCT.BASE, element: <Product /> },
  { path: ROUTES.PRODUCT.REQUEST.ADD, element: <ProductRequestForm /> },

  { path: ROUTES.STOCK.BASE, element: <Stocks /> },
  { path: ROUTES.STOCK.ADD_EDIT, element: <StockForm /> },

  { path: ROUTES.CONTACT.BASE, element: <Contact /> },
  { path: ROUTES.CONTACT.ADD_EDIT, element: <ContactForm /> },

  { path: ROUTES.BANK.BASE, element: <Bank /> },
  { path: ROUTES.BANK.ADD_EDIT, element: <BankForm /> },

  { path: ROUTES.TRANSACTION.BASE, element: <BankTransaction /> },

  { path: ROUTES.PAYMENT.BASE, element: <PaymentList /> },
  { path: ROUTES.PAYMENT.ADD_EDIT, element: <PaymentForm /> },

  { path: ROUTES.POS.NEW, element: <NewPos /> },
  
  { path: ROUTES.RECIPE.BASE, element: <Recipe /> },
  { path: ROUTES.RECIPE.ADD_EDIT, element: <RecipeForm /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];
