import type { AdditionalChargeItem, AddressApi, CommonDataType, MessageStatus, PageStatus, ShippingDetails, TransactionSummary } from "./Common";
import type { ContactBase } from "./Contacts";
import type { DeliveryChallanBase } from "./DeliveryChallan";
import type { EmployeeBase } from "./Employee";
import type { ProductBase } from "./Product";
import type { SalesOrderBase } from "./SalesOrder";
import type { TaxBase } from "./Tax";

export interface InvoiceItem {
  productId: string | ProductBase;
  qty: number;
  freeQty: number;
  mrp?: number;
  price: number;
  discount1: number;
  discountType?: "percentage" | "flat";
  discountAmount?: number;
  uomId?: string | null;
  unit?: string | null;
  taxId?: string | TaxBase | null;
  tax?: number; // Tax amount for API
  taxAmount?: number; // Internal usage/response
  taxableAmount: number;
  totalAmount: number;
  _id?: string;
}

export interface InvoiceBase extends CommonDataType {
  invoiceNo: string;
  date: string;
  dueDate: string;
  customerId: string | ContactBase;
  salesOrderIds?: string[];
  deliveryChallanIds?: string[];
  placeOfSupply?: string;
  billingAddress?: string | AddressApi;
  shippingAddress?: string | AddressApi;
  paymentTerms?: string;
  createdFrom?: string;
  taxType?: string;
  reverseCharge?: boolean;
  shippingDetails?: ShippingDetails;
  items: InvoiceItem[];
  transactionSummary: TransactionSummary;
  additionalCharges?: AdditionalChargeItem[];
  paidAmount: number;
  balanceAmount: number;
  payType?: string;
  paymentStatus: "paid" | "unpaid" | "partial";
  salesManId?: string | EmployeeBase;
  termsAndConditionIds?: string[];
  notes?: string;
  status: string;
}

export interface InvoiceFormValues extends Omit<InvoiceBase, keyof CommonDataType | "invoiceNo" | "customerId" | "salesManId" | "items" | "billingAddress" | "shippingAddress" | "reverseCharge"> {
  invoiceNo?: string;
  customerId: string;
  salesManId?: string;
  items: InvoiceItem[];
  billingAddress?: string;
  shippingAddress?: string;
  selectedSalesOrderId?: string | SalesOrderBase;
  selectedDeliveryChallanId?: string | DeliveryChallanBase;
  reverseCharge?: string;
  _submitAction?: string;
}

export type AddInvoicePayload = InvoiceFormValues;
export type EditInvoicePayload = Partial<AddInvoicePayload> & {
  invoiceId: string;
  isActive?: boolean;
};

export interface InvoiceDataResponse extends PageStatus {
  invoice_data: InvoiceBase[];
  summary: {
    allInvoices: number;
    cancelled: number;
    deliveryChallanCreated: number;
    invoiced: number;
    paidAmount: number;
    totalSales: number;
    unpaidAmount: number;
  };
}

export interface InvoiceApiResponse extends MessageStatus {
  data: InvoiceDataResponse;
}

export interface SingleInvoiceApiResponse extends MessageStatus {
  data: InvoiceBase;
}

export interface InvoiceDropdownApiResponse extends MessageStatus {
  data: InvoiceBase[];
}
