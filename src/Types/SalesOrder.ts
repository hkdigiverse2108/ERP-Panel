import type { AdditionalChargeItem, CommonDataType, MessageStatus, PageStatus, ShippingDetails, TransactionSummary } from "./Common";
import type { Address, ContactBase } from "./Contacts";
import type { ProductBase } from "./Product";
import type { TaxBase } from "./Tax";
import type { TermsConditionBase } from "./TermsAndCondition";
import type { UomBase } from "./Uom";

export interface SalesOrderItem {
  productId: string | ProductBase;
  qty: number;
  freeQty: number;
  uomId: string | UomBase;
  price: number;
  discount1: number;
  // discount2: number;
  taxId: string | TaxBase;
  taxableAmount: number;
  totalAmount: number;
  unit?: string;
  tax?: number;
}

export interface SalesOrderFormValues {
  date?: string;
  dueDate?: string;
  customerId?: string;
  placeOfSupply?: string;
  billingAddress?: string;
  shippingAddress?: string;
  paymentTermsId?: string;
  taxType?: string;
  reverseCharge?: boolean | string;
  // sez?: string;
  termsAndConditionIds?: string[];
  items?: SalesOrderItem[];
  additionalCharges?: AdditionalChargeItem[];
  shippingDetails?: ShippingDetails;
  transactionSummary?: TransactionSummary;
  isActive?: boolean;
  status?: string;
  salesManId?: string;
  selectedEstimateId?: string;
  estimateNo?: string;
  notes?: string;
  _submitAction?: string;
}

export type AddSalesOrderPayload = SalesOrderFormValues;

export type EditSalesOrderPayload = SalesOrderFormValues & { salesOrderId?: string };

export interface SalesOrderBase extends Omit<SalesOrderFormValues, "customerId" | "termsAndConditionIds" | "additionalCharges" | "billingAddress" | "shippingAddress">, CommonDataType {
  salesOrderNo: string;
  estimateNo: string;
  customerId: ContactBase;
  termsAndConditionIds: TermsConditionBase[];
  additionalCharges: AdditionalChargeItem[];
  billingAddress: Address;
  shippingAddress: Address;
  status?: string;
}

export interface SalesOrderDataResponse extends PageStatus {
  salesOrder_data: SalesOrderBase[];
  summary: {
    allSalesOrders: number;
    cancelled: number;
    deliveryChallanCreated: number;
    invoiceCreated: number;
    pending: number;
  };
}

export interface SalesOrderApiResponse extends MessageStatus {
  data: SalesOrderDataResponse;
}

export interface SalesOrderDropdownApiResponse extends MessageStatus {
  data: SalesOrderBase[];
}

/* ===================== NEW UI TYPES ===================== */

export interface SalesOrderDetailsProps {
  customerOptions: { label: string; value: string }[];
  selectedCustomer?: ContactBase | null;
  isEditing: boolean;
  companyOptions: { label: string; value: string }[];
  isCompanyLoading: boolean;
  isCustomerDisabled?: boolean;
}

export interface SalesOrderTabsProps {
  selectedTermIds: string[];
  onTermsChange: (ids: string[]) => void;
}
