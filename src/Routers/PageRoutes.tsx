import { Navigate } from "react-router-dom";
import { CompanyForm, UserForm } from "../Components/Settings/GeneralSetting";
import { PAGE_TITLE, ROUTES } from "../Constants";
import CreditNote from "../Pages/Accounting/CreditNote";
import CreditNoteForm from "../Pages/Accounting/CreditNote/CreditNoteForm";
import DebitNote from "../Pages/Accounting/DebitNote";
import DebitNoteForm from "../Pages/Accounting/DebitNote/DebitNoteForm";
import ChangePassword from "../Pages/Auth/ChangePassword";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import SignInForm from "../Pages/Auth/SignInForm";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import Bank from "../Pages/Bank/Bank";
import BankForm from "../Pages/Bank/Bank/BankForm";
import BankTransaction from "../Pages/Bank/BankTransaction";
import PaymentList from "../Pages/Bank/Payment";
import PaymentForm from "../Pages/Bank/Payment/PaymentForm";
import Contact from "../Pages/Contacts";
import ContactForm from "../Pages/Contacts/ContactForm";
import Coupon from "../Pages/CRM/Coupon";
import CouponForm from "../Pages/CRM/Coupon/CouponForm";
import Loyalty from "../Pages/CRM/Loyalty";
import LoyaltyForm from "../Pages/CRM/Loyalty/LoyaltyForm";
import Dashboard from "../Pages/Dashboard";
import Employees from "../Pages/Employee";
import EmployeeForm from "../Pages/Employee/EmployeeForm";
import Permission from "../Pages/Employee/Permission";
import BillOfMaterials from "../Pages/Inventory/BillOfLiveProduct";
import BillOfMaterialsForm from "../Pages/Inventory/BillOfLiveProduct/BillOfLiveProductForm";
import MaterialConsumption from "../Pages/Inventory/MaterialConsumption";
import MaterialConsumptionForm from "../Pages/Inventory/MaterialConsumption/MaterialConsumptionForm";
import Product from "../Pages/Inventory/Product";
import ItemForm from "../Pages/Inventory/Product/ItemForm";
import ProductForm from "../Pages/Inventory/Product/ProductForm";
import Recipe from "../Pages/Inventory/Recipe";
import RecipeForm from "../Pages/Inventory/Recipe/RecipeFrom";
import Stocks from "../Pages/Inventory/Stock";
import StockVerification from "../Pages/Inventory/StockVerification";
import StockVerificationForm from "../Pages/Inventory/StockVerification/StockVerificationForm";
import CreditNoteList from "../Pages/POS/CreditNote";
import NewPos from "../Pages/POS/New";
import OrderList from "../Pages/POS/OrderList";
import SalesRegister from "../Pages/POS/SalesRegister";
import PurchaseOrder from "../Pages/Purchase/PurchaseOrder";
import PurchaseOrderForm from "../Pages/Purchase/PurchaseOrder/PurchaseOrderForm";
import SupplierBill from "../Pages/Purchase/SupplierBill";
import SupplierBillForm from "../Pages/Purchase/SupplierBill/SupplierBillForm";
import PurchaseDebitNote from "../Pages/Purchase/PurchaseDebitNote";
import PurchaseDebitNoteForm from "../Pages/Purchase/PurchaseDebitNote/PurchaseDebitNoteForm";
import GeneralSetting from "../Pages/Settings/GeneralSetting";
import Discount from "../Pages/CRM/Discount";
import DiscountForm from "../Pages/CRM/Discount/DiscountForm";
import Estimate from "../Pages/Sales/Estimate";
import EstimateForm from "../Pages/Sales/Estimate/EstimateForm";
import SalesOrder from "../Pages/Sales/SalesOrder";
import SalesOrderForm from "../Pages/Sales/SalesOrder/SalesOrderForm";
import Invoice from "../Pages/Sales/Invoice";
import InvoiceForm from "../Pages/Sales/Invoice/InvoiceForm";
import DeliveryChallan from "../Pages/Sales/DeliveryChallan";
import DeliveryChallanForm from "../Pages/Sales/DeliveryChallan/DeliveryChallanForm";
import SalesCreditNote from "../Pages/Sales/SalesCreditNote";
import SalesCreditNoteForm from "../Pages/Sales/SalesCreditNote/SalesCreditNoteForm";
import ReceiptForm from "../Pages/Bank/Receipt/ReceiptForm";
import Receipt from "../Pages/Bank/Receipt";
import Expense from "../Pages/Bank/Expense";
import ExpenseForm from "../Pages/Bank/Expense/ExpenseForm";
import Salary from "../Pages/Bank/Salary";
import SalaryForm from "../Pages/Bank/Salary/SalaryForm";
import ResetPassword from "../Pages/Auth/UpdatePassword";
import StockTransfer from "../Pages/Inventory/StockTransfer";
import StockTransferForm from "../Pages/Inventory/StockTransfer/StockTransferForm";
import StockTransferDetails from "../Pages/Inventory/StockTransfer/StockTransferDetails";
import Notification from "../Pages/Notification";

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

  { path: ROUTES.BANK_TRANSACTION.BASE, name: PAGE_TITLE.BANK_TRANSACTION.BASE, element: <BankTransaction /> },

  { path: ROUTES.RECEIPT.BASE, name: PAGE_TITLE.RECEIPT.BASE, element: <Receipt /> },
  { path: ROUTES.RECEIPT.ADD_EDIT, name: PAGE_TITLE.RECEIPT.BASE, element: <ReceiptForm /> },

  { path: ROUTES.PAYMENT.BASE, name: PAGE_TITLE.PAYMENT.BASE, element: <PaymentList /> },
  { path: ROUTES.PAYMENT.ADD_EDIT, name: PAGE_TITLE.PAYMENT.BASE, element: <PaymentForm /> },

  { path: ROUTES.EXPENSE.BASE, name: PAGE_TITLE.EXPENSE.BASE, element: <Expense /> },
  { path: ROUTES.EXPENSE.ADD_EDIT, name: PAGE_TITLE.EXPENSE.BASE, element: <ExpenseForm /> },

  { path: ROUTES.SALARY.BASE, name: PAGE_TITLE.SALARY.BASE, element: <Salary /> },
  { path: ROUTES.SALARY.ADD_EDIT, name: PAGE_TITLE.SALARY.BASE, element: <SalaryForm /> },

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

  { path: ROUTES.PURCHASE_DEBIT_NOTE.BASE, name: PAGE_TITLE.PURCHASE.PURCHASE_DEBIT_NOTE.BASE, element: <PurchaseDebitNote /> },
  { path: ROUTES.PURCHASE_DEBIT_NOTE.ADD_EDIT, name: PAGE_TITLE.PURCHASE.PURCHASE_DEBIT_NOTE.BASE, element: <PurchaseDebitNoteForm /> },

  { path: ROUTES.COUPON.BASE, name: PAGE_TITLE.CRM.COUPON.BASE, element: <Coupon /> },
  { path: ROUTES.COUPON.ADD_EDIT, name: PAGE_TITLE.CRM.COUPON.BASE, element: <CouponForm /> },

  { path: ROUTES.LOYALTY.BASE, name: PAGE_TITLE.CRM.LOYALTY.BASE, element: <Loyalty /> },
  { path: ROUTES.LOYALTY.ADD_EDIT, name: PAGE_TITLE.CRM.LOYALTY.BASE, element: <LoyaltyForm /> },

  { path: ROUTES.DISCOUNT.BASE, name: PAGE_TITLE.CRM.DISCOUNT.BASE, element: <Discount /> },
  { path: ROUTES.DISCOUNT.ADD_EDIT, name: PAGE_TITLE.CRM.DISCOUNT.BASE, element: <DiscountForm /> },

  { path: ROUTES.ACCOUNTING.CREDIT_NOTE.BASE, name: PAGE_TITLE.ACCOUNTING.CREDIT_NOTE.BASE, element: <CreditNote /> },
  { path: ROUTES.ACCOUNTING.CREDIT_NOTE.ADD_EDIT, name: PAGE_TITLE.ACCOUNTING.CREDIT_NOTE.BASE, element: <CreditNoteForm /> },

  { path: ROUTES.POS.SALES_REGISTER, name: PAGE_TITLE.POS.SALES_REGISTER, element: <SalesRegister /> },
  { path: ROUTES.ACCOUNTING.DEBIT_NOTE.BASE, name: PAGE_TITLE.ACCOUNTING.DEBIT_NOTE.BASE, element: <DebitNote /> },
  { path: ROUTES.ACCOUNTING.DEBIT_NOTE.ADD_EDIT, name: PAGE_TITLE.ACCOUNTING.DEBIT_NOTE.BASE, element: <DebitNoteForm /> },

  { path: ROUTES.ESTIMATE.BASE, name: PAGE_TITLE.SALES.ESTIMATE.BASE, element: <Estimate /> },
  { path: ROUTES.ESTIMATE.ADD_EDIT, name: PAGE_TITLE.SALES.ESTIMATE.BASE, element: <EstimateForm /> },

  { path: ROUTES.SALES_ORDER.BASE, name: PAGE_TITLE.SALES.SALES_ORDER.BASE, element: <SalesOrder /> },
  { path: ROUTES.SALES_ORDER.ADD_EDIT, name: PAGE_TITLE.SALES.SALES_ORDER.BASE, element: <SalesOrderForm /> },

  { path: ROUTES.INVOICE.BASE, name: PAGE_TITLE.SALES.INVOICE.BASE, element: <Invoice /> },
  { path: ROUTES.INVOICE.ADD_EDIT, name: PAGE_TITLE.SALES.INVOICE.BASE, element: <InvoiceForm /> },

  { path: ROUTES.DELIVERY_CHALLAN.BASE, name: PAGE_TITLE.SALES.DELIVERY_CHALLAN.BASE, element: <DeliveryChallan /> },
  { path: ROUTES.DELIVERY_CHALLAN.ADD_EDIT, name: PAGE_TITLE.SALES.DELIVERY_CHALLAN.BASE, element: <DeliveryChallanForm /> },

  { path: ROUTES.SALES_CREDIT_NOTE.BASE, name: PAGE_TITLE.SALES.SALES_CREDIT_NOTE.BASE, element: <SalesCreditNote /> },
  { path: ROUTES.SALES_CREDIT_NOTE.ADD_EDIT, name: PAGE_TITLE.SALES.SALES_CREDIT_NOTE.BASE, element: <SalesCreditNoteForm /> },

  { path: ROUTES.STOCK_TRANSFER.BASE, name: PAGE_TITLE.INVENTORY.STOCK_TRANSFER.BASE, element: <StockTransfer /> },
  { path: ROUTES.STOCK_TRANSFER.ADD_EDIT, name: PAGE_TITLE.INVENTORY.STOCK_TRANSFER.BASE, element: <StockTransferForm /> },
  { path: ROUTES.STOCK_TRANSFER.VIEW, name: PAGE_TITLE.INVENTORY.STOCK_TRANSFER.BASE, element: <StockTransferDetails /> },
  { path: ROUTES.NOTIFICATION.BASE, name: PAGE_TITLE.NOTIFICATION, element: <Notification /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, name: PAGE_TITLE.AUTH.SIGNIN, element: <SignInForm /> },
  { path: ROUTES.FORGOT_PASSWORD.BASE, name: PAGE_TITLE.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: ROUTES.AUTH.VERIFY_OTP, name: PAGE_TITLE.AUTH.VERIFY_OTP, element: <VerifyOtp /> },
  { path: ROUTES.AUTH.RESET_PASSWORD, name: PAGE_TITLE.AUTH.RESET_PASSWORD, element: <ResetPassword /> },
];
