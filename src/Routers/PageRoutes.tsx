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
import ChangePassword from "../Pages/Auth/ChangePassword";
import StockVerificationForm from "../Pages/Inventory/StockVerification/StockVerificationForm";
import BillOfMaterials from "../Pages/Inventory/BillOfLiveProduct";
import BillOfMaterialsForm from "../Pages/Inventory/BillOfLiveProduct/BillOfLiveProductForm";
import Permission from "../Pages/Employee/Permission";
import SupplierBill from "../Pages/Purchase/SupplierBill";
import SupplierBillForm from "../Pages/Purchase/SupplierBill/SupplierBillForm";
import MaterialConsumption from "../Pages/Inventory/MaterialConsumption";
import MaterialConsumptionForm from "../Pages/Inventory/MaterialConsumption/MaterialConsumptionForm";
import PurchaseOrder from "../Pages/Purchase/PurchaseOrder";
import PurchaseOrderForm from "../Pages/Purchase/PurchaseOrder/PurchaseOrderForm";
import Coupon from "../Pages/CRM/Coupon";
import CouponForm from "../Pages/CRM/Coupon/CouponForm";
import LoyaltyForm from "../Pages/CRM/Loyalty/LoyaltyForm";
import Loyalty from "../Pages/CRM/Loyalty";
import OrderList from "../Pages/POS/OrderList";
import CreditNoteList from "../Pages/POS/CreditNote";
import AccountGroup from "../Pages/Accounting/AccountGroup";
import AccountGroupTree from "../Pages/Accounting/AccountGroup/AccountGroupTree";
import Account from "../Pages/Accounting/Account";
import CreditNote from "../Pages/Accounting/CreditNote";
import CreditNoteForm from "../Pages/Accounting/CreditNote/CreditNoteForm";
import SalesRegister from "../Pages/POS/SalesRegister";
import DebitNote from "../Pages/Accounting/DebitNote";
import DebitNoteForm from "../Pages/Accounting/DebitNote/DebitNoteForm";
import JournalVoucher from "../Pages/Accounting/JournalVoucher";
import JournalVoucherForm from "../Pages/Accounting/JournalVoucher/JournalVoucherForm";

export const PageRoutes = [
  { path: ROUTES.HOME, name: PAGE_TITLE.DASHBOARD, element: <Navigate to={ROUTES.DASHBOARD} replace /> },

  { path: ROUTES.DASHBOARD, name: PAGE_TITLE.DASHBOARD, element: <Dashboard /> },

  { path: ROUTES.SETTINGS.GENERAL, name: PAGE_TITLE.SETTINGS.GENERAL, element: <GeneralSetting /> },
  { path: ROUTES.SETTINGS.CHANGE_PASSWORD, name: PAGE_TITLE.SETTINGS.CHANGE_PASSWORD, element: <ChangePassword /> },
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
  { path: ROUTES.POS.ORDER_LIST, name: PAGE_TITLE.POS.ORDER_LIST, element: <OrderList /> },
  { path: ROUTES.POS.CREDIT_NOTE, name: PAGE_TITLE.POS.CREDIT_NOTE, element: <CreditNoteList /> },

  { path: ROUTES.RECIPE.BASE, name: PAGE_TITLE.INVENTORY.RECIPE.BASE, element: <Recipe /> },
  { path: ROUTES.RECIPE.ADD_EDIT, name: PAGE_TITLE.INVENTORY.RECIPE.BASE, element: <RecipeForm /> },

  { path: ROUTES.BILL_OF_LIVE_PRODUCT.BASE, name: PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE, element: <BillOfMaterials /> },
  { path: ROUTES.BILL_OF_LIVE_PRODUCT.ADD_EDIT, name: PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE, element: <BillOfMaterialsForm /> },

  { path: ROUTES.SUPPLIER_BILL.BASE, name: PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE, element: <SupplierBill /> },
  { path: ROUTES.SUPPLIER_BILL.ADD_EDIT, name: PAGE_TITLE.PURCHASE.SUPPLIER_BILL.BASE, element: <SupplierBillForm /> },

  { path: ROUTES.MATERIAL_CONSUMPTION.BASE, name: PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE, element: <MaterialConsumption /> },
  { path: ROUTES.MATERIAL_CONSUMPTION.ADD_EDIT, name: PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE, element: <MaterialConsumptionForm /> },

  { path: ROUTES.PURCHASE_ORDER.BASE, name: PAGE_TITLE.PURCHASE.PURCHASE_ORDER.BASE, element: <PurchaseOrder /> },
  { path: ROUTES.PURCHASE_ORDER.ADD_EDIT, name: PAGE_TITLE.PURCHASE.PURCHASE_ORDER.BASE, element: <PurchaseOrderForm /> },

  { path: ROUTES.COUPON.BASE, name: PAGE_TITLE.CRM.COUPON.BASE, element: <Coupon /> },
  { path: ROUTES.COUPON.ADD_EDIT, name: PAGE_TITLE.CRM.COUPON.BASE, element: <CouponForm /> },

  { path: ROUTES.LOYALTY.BASE, name: PAGE_TITLE.CRM.LOYALTY.BASE, element: <Loyalty /> },
  { path: ROUTES.LOYALTY.ADD_EDIT, name: PAGE_TITLE.CRM.LOYALTY.BASE, element: <LoyaltyForm /> },

  { path: ROUTES.ACCOUNTING.ACCOUNT_GROUP.BASE, name: PAGE_TITLE.ACCOUNTING.ACCOUNT_GROUP.BASE, element: <AccountGroup /> },
  { path: ROUTES.ACCOUNTING.ACCOUNT_GROUP.TREE, name: PAGE_TITLE.ACCOUNTING.ACCOUNT_GROUP.BASE, element: <AccountGroupTree /> },
  { path: ROUTES.ACCOUNTING.ACCOUNT.BASE, name: PAGE_TITLE.ACCOUNTING.ACCOUNT.BASE, element: <Account /> },
  { path: ROUTES.ACCOUNTING.CREDIT_NOTE.BASE, name: PAGE_TITLE.ACCOUNTING.CREDIT_NOTE.BASE, element: <CreditNote /> },
  { path: ROUTES.ACCOUNTING.CREDIT_NOTE.ADD_EDIT, name: PAGE_TITLE.ACCOUNTING.CREDIT_NOTE.ADD, element: <CreditNoteForm /> },

  { path: ROUTES.POS.SALES_REGISTER, name: PAGE_TITLE.POS.SALES_REGISTER, element: <SalesRegister /> },
  { path: ROUTES.ACCOUNTING.CREDIT_NOTE.ADD_EDIT, name: PAGE_TITLE.ACCOUNTING.CREDIT_NOTE.BASE, element: <CreditNoteForm /> },
  { path: ROUTES.ACCOUNTING.DEBIT_NOTE.BASE, name: PAGE_TITLE.ACCOUNTING.DEBIT_NOTE.BASE, element: <DebitNote /> },
  { path: ROUTES.ACCOUNTING.DEBIT_NOTE.ADD_EDIT, name: PAGE_TITLE.ACCOUNTING.DEBIT_NOTE.BASE, element: <DebitNoteForm /> },
  { path: ROUTES.ACCOUNTING.JOURNAL_VOUCHER.BASE, name: PAGE_TITLE.ACCOUNTING.JOURNAL_VOUCHER.BASE, element: <JournalVoucher /> },
  { path: ROUTES.ACCOUNTING.JOURNAL_VOUCHER.ADD_EDIT, name: PAGE_TITLE.ACCOUNTING.JOURNAL_VOUCHER.BASE, element: <JournalVoucherForm /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];
