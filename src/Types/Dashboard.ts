import type { MessageStatus } from "./Common";
import type { ContactBase } from "./Contacts";

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

export interface TransactionBase {
  bank: number;
  card: number;
  cash: number;
  cheque: number;
  date: string;
  other: number;
  upi: number;
}

export interface TransactionApiResponse extends MessageStatus {
  data: TransactionBase[];
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
