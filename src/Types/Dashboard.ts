import type { BranchBase } from "./Branch";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";
import type { EmployeeBase } from "./Employee";

// ************ Sales And Purchase ***********

export interface SalesAndPurchaseBase {
  date: string;
  purchase: number;
  purchaseReturn: number;
  sales: number;
  salesReturn: number;
}

export interface SalesAndPurchaseApiResponse extends MessageStatus {
  data: SalesAndPurchaseBase[];
}

// ************ Transaction ***********

export interface TransactionBaseGraph {
  bank: number;
  card: number;
  cash: number;
  cheque: number;
  date: string;
  other: number;
  upi: number;
}

export interface TransactionGraphApiResponse extends MessageStatus {
  data: TransactionBaseGraph[];
}

// ************ Best Selling Products ***********

export interface SellingProductsBase {
  noOfBills: number;
  productName: string;
  salesPercentage: number;
  totalProfit: number;
  totalSalesQty: number;
  totalSalesValue: number;
  _id: string;
}

export interface BestSellingProductsApiResponse extends MessageStatus {
  data: SellingProductsBase[];
}

// ************ Least Selling Products ***********

export interface LeastSellingProductsApiResponse extends MessageStatus {
  data: SellingProductsBase[];
}

// ************ Top Expenses ***********

export interface TopExpensesBase {
  accountName: string;
  expenseCount: number;
  totalAmount: number;
  _id: string;
}

export interface TopExpensesApiResponse extends MessageStatus {
  data: TopExpensesBase[];
}

// ************ Top Coupons ***********

export interface TopCouponsBase {
  name: string;
  totalDiscountGiven: number;
  uniqueCustomersCount: number;
  usageCount: number;
  _id: string;
}

export interface TopCouponsApiResponse extends MessageStatus {
  data: TopCouponsBase[];
}

// ************ Receivable ***********

export interface ReceivableBase {
  customerName: string;
  date: string;
  invoiceNo: string;
  pendingAmount: number;
  type: string;
  _id: string;
}

export interface ReceivableApiResponse extends MessageStatus {
  data: ReceivableBase[];
}

// ************ Payable ***********

export interface PayableBase {
  billNo: string;
  date: string;
  pendingAmount: number;
  supplierName: string;
  _id: string;
}

export interface PayableApiResponse extends MessageStatus {
  data: PayableBase[];
}

// ************ Top Customers ***********

export interface TopCustomersBase {
  noOfBill: number;
  salesValue: number;
  customerId: ContactBase;
}

export interface TopCustomersApiResponse extends MessageStatus {
  data: TopCustomersBase[];
}

// ************ Category Wise Customers Count ***********

export interface CategoryWiseCustomersCountBase {
  category: string;
  count: number;
}

export interface CategoryWiseCustomersCountApiResponse extends MessageStatus {
  data: CategoryWiseCustomersCountBase[];
}

// ************ Category Sales ***********

export interface CategorySalesBase {
  categoryName: string;
  noOfBills: number;
  salesPercentage: number;
  totalProfit: number;
  totalSalesQty: number;
  totalSalesValue: number;
  _id: string;
}

export interface CategorySalesApiResponse extends MessageStatus {
  data: CategorySalesBase[];
}

// ************ Login Log ***********

export interface LoginLogBase extends CommonDataType {
  isActive: true;
  companyId: CompanyBase;
  branchId: BranchBase;
  userId: EmployeeBase;
  message: "Duo Fusion Logged In";
  ipAddress: "::1";
  systemDetails: "PostmanRuntime/7.51.1";
  eventType: "LOGIN";
}

export interface LoginLogDataResponse extends PageStatus {
  loginLog_data: LoginLogBase[];
}

export interface LoginLogApiResponse extends MessageStatus {
  data: LoginLogDataResponse;
}

// ************ Transactions ***********
export interface TransactionsBase {
  totalSales: number;
  totalInvoice: number;
  soldQty: number;
  totalCustomers: number;
  toReceive: number;
  totalSalesReturn: number;
  totalPurchase: number;
  totalBills: number;
  purchaseQty: number;
  totalSuppliers: number;
  toPay: number;
  totalPurchaseReturn: number;
  totalPaid: number;
  totalExpense: number;
  cashInHand: number;
  bankAccountsBalance: number;
  totalProducts: number;
  stockQty: number;
  stockValue: number;
  grossProfit: number;
  avgProfitMarginAmount: number;
  avgProfitMarginPercent: number;
  avgCartValue: number;
  avgBillsCount: number;
}

export interface TransactionsApiResponse extends MessageStatus {
  data: TransactionsBase;
}
