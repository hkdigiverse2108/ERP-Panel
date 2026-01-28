import { Navigate } from "react-router-dom";
import { CompanyForm, UserForm } from "../Components/Settings/GeneralSetting";
import { PAGE_TITLE, ROUTES } from "../Constants";
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
import ItemForm from "../Pages/Inventory/Product/ItemForm";
import ProductForm from "../Pages/Inventory/Product/ProductForm";
import Recipe from "../Pages/Inventory/Recipe";
import RecipeForm from "../Pages/Inventory/Recipe/RecipeFrom";
import Stocks from "../Pages/Inventory/Stock";
import StockVerification from "../Pages/Inventory/StockVerification";
import NewPos from "../Pages/POS/New";
import GeneralSetting from "../Pages/Settings/GeneralSetting";
import StockVerificationForm from "../Pages/Inventory/StockVerification/StockVerificationForm";
import BillOfMaterials from "../Pages/Inventory/BillOfMaterials";
import BillOfMaterialsForm from "../Pages/Inventory/BillOfMaterials/BillOfMaterialForm";
import Permission from "../Pages/Employee/Permission";
import SupplierBill from "../Pages/Purchase/SupplierBill";
import SupplierBillForm from "../Pages/Purchase/SupplierBill/SupplierBillForm";

export const PageRoutes = [
  { path: ROUTES.HOME, name: PAGE_TITLE.DASHBOARD, element: <Navigate to={ROUTES.DASHBOARD} replace /> },

  { path: ROUTES.DASHBOARD, name: PAGE_TITLE.DASHBOARD, element: <Dashboard /> },

  { path: ROUTES.SETTINGS.GENERAL, name: PAGE_TITLE.SETTINGS.GENERAL, element: <GeneralSetting /> },
  { path: ROUTES.COMPANY.EDIT, name: PAGE_TITLE.CONTACT.BASE, element: <CompanyForm /> },
  { path: ROUTES.USER.EDIT, name: PAGE_TITLE.USER.BASE, element: <UserForm /> },

  { path: ROUTES.USERS.BASE, name: PAGE_TITLE.USER.BASE, element: <Employees /> },
  { path: ROUTES.USERS.ADD_EDIT, name: PAGE_TITLE.USER.BASE, element: <EmployeeForm /> },
  { path: ROUTES.USERS.PERMISSION_ADD_EDIT, name: PAGE_TITLE.USER.BASE, element: <Permission /> },

  { path: ROUTES.PRODUCT.BASE, name: PAGE_TITLE.INVENTORY.PRODUCT.BASE, element: <Product /> },
  { path: ROUTES.PRODUCT.ADD_EDIT, name: PAGE_TITLE.INVENTORY.PRODUCT.BASE, element: <ProductForm /> },
  { path: ROUTES.PRODUCT.ITEM_ADD_EDIT, name: PAGE_TITLE.INVENTORY.STOCK.BASE, element: <ItemForm /> },

  { path: ROUTES.STOCK.BASE, name: PAGE_TITLE.INVENTORY.STOCK.BASE, element: <Stocks /> },
  { path: ROUTES.STOCK_VERIFICATION.BASE, name: PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE, element: <StockVerification /> },
  { path: ROUTES.STOCK_VERIFICATION.ADD_EDIT, name: PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE, element: <StockVerificationForm /> },

  { path: ROUTES.CONTACT.BASE, name: PAGE_TITLE.CONTACT.BASE, element: <Contact /> },
  { path: ROUTES.CONTACT.ADD_EDIT, name: PAGE_TITLE.CONTACT.BASE, element: <ContactForm /> },

  { path: ROUTES.BANK.BASE, name: PAGE_TITLE.BANK.BASE, element: <Bank /> },
  { path: ROUTES.BANK.ADD_EDIT, name: PAGE_TITLE.BANK.BASE, element: <BankForm /> },

  { path: ROUTES.TRANSACTION.BASE, name: PAGE_TITLE.TRANSACTION.BASE, element: <BankTransaction /> },

  { path: ROUTES.PAYMENT.BASE, name: PAGE_TITLE.PAYMENT.BASE, element: <PaymentList /> },
  { path: ROUTES.PAYMENT.ADD_EDIT, name: PAGE_TITLE.PAYMENT.BASE, element: <PaymentForm /> },

  { path: ROUTES.POS.NEW, name: PAGE_TITLE.POS.BASE, element: <NewPos /> },

  { path: ROUTES.RECIPE.BASE, name: PAGE_TITLE.INVENTORY.RECIPE.BASE, element: <Recipe /> },
  { path: ROUTES.RECIPE.ADD_EDIT, name: PAGE_TITLE.INVENTORY.RECIPE.BASE, element: <RecipeForm /> },

  { path: ROUTES.BILL_OF_Live_Product.BASE, name: PAGE_TITLE.INVENTORY.BILL_OF_Live_Product.BASE, element: <BillOfMaterials /> },
  { path: ROUTES.BILL_OF_Live_Product.ADD_EDIT, name: PAGE_TITLE.INVENTORY.BILL_OF_Live_Product.BASE, element: <BillOfMaterialsForm /> },

    { path: ROUTES.SUPPLIER_BILL.BASE, name: PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE, element: <SupplierBill /> },
  { path: ROUTES.SUPPLIER_BILL.ADD_EDIT, name: PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE, element: <SupplierBillForm /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];
