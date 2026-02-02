import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { ProductBase } from "./Product";
import type { ContactBase } from "./Contacts";

/* ===================== SUPPLIER ===================== */

export type Supplier = ContactBase;
/* ===================== PRODUCT ===================== */

export interface SupplierBillProductItem {
  productId?: string | ProductBase;
  qty?: number;
  freeQty?: number;
  mrp?: number;
  sellingPrice?: number;
  landingCost?: number;
  margin?: number;
  discount1?: number;
  discount2?: number;
  taxAmount?: number;
  total?: number;
}

export interface SupplierBillProductDetails {
  item?: SupplierBillProductItem[];
  totalQty?: number;
  totalTax?: number;
  total?: number;
}

/* ===================== RETURN ===================== */

export interface SupplierBillReturnProductItem {
  productId?: string | ProductBase;
  qty?: number;
  discount1?: number;
  discount2?: number;
  tax?: number;
  landingCost?: number;
  total?: number;
}

export interface SupplierBillReturnProductSummary {
  grossAmount?: number;
  taxAmount?: number;
  roundOff?: number;
  netAmount?: number;
}

export interface SupplierBillReturnProductDetails {
  item?: SupplierBillReturnProductItem[];
  totalQty?: number;
  total?: number;
  summary?: SupplierBillReturnProductSummary;
}

/* ===================== ADDITIONAL ===================== */

export interface AdditionalChargeItem {
  chargeId?: {
    _id: string;
    name?: string;
    type?: string;
  };
  value?: number;
  taxRate?: number;
  total?: number;
}

export interface AdditionalChargeDetails {
  item?: AdditionalChargeItem[];
  total?: number;
}

/* ===================== SUMMARY ===================== */

export interface SupplierBillSummary {
  flatDiscount?: number;
  grossAmount?: number;
  itemDiscount?: number;
  itemTax?: number;
  additionalChargeAmount?: number;
  additionalChargeTax?: number;
  billDiscount?: number;
  roundOff?: number;
  netAmount?: number;
}

/* ===================== FORM ===================== */

export interface SupplierBillFormValues {
  supplierId: string;

  supplierBillNo?: string;
  referenceBillNo?: string;
  supplierBillDate: string | Date;

  paymentTerm?: string;
  dueDate?: string | Date;

  reverseCharge?: boolean;
  shippingDate?: string | Date;

  taxType?: string;
  invoiceAmount?: string;

  productDetails?: SupplierBillProductDetails;
  returnProductDetails?: SupplierBillReturnProductDetails;
  additionalCharges?: AdditionalChargeDetails;

  termsAndConditionIds?: string[];

  notes?: string;

  summary?: SupplierBillSummary;

  paidAmount?: number;
  balanceAmount?: number;

  paymentStatus?: "paid" | "unpaid" | "partial";
  status?: "active" | "cancelled";

  companyId?: string;
  isActive?: boolean;

  _submitAction?: string;
}

/* ===================== API ===================== */

export interface SupplierBillBase extends CommonDataType {
  supplierId?: Supplier;

  supplierBillNo?: string;
  referenceBillNo?: string;
  supplierBillDate?: string;

  purchaseOrderId?: string | null;
  paymentTerm?: string;
  dueDate?: string;

  reverseCharge?: boolean;
  shippingDate?: string;

  taxType?: string;
  invoiceAmount?: string;

  productDetails?: SupplierBillProductDetails;
  returnProductDetails?: SupplierBillReturnProductDetails;
  additionalCharges?: AdditionalChargeDetails;

  termsAndConditionIds?: {
    _id: string;
    termsCondition?: string;
  }[];

  notes?: string;

  summary?: SupplierBillSummary;

  paidAmount?: number;
  balanceAmount?: number;

  paymentStatus?: "paid" | "unpaid" | "partial";
  status?: "active" | "cancelled";

  companyId?: {
    _id: string;
    name?: string;
  };

  isActive?: boolean;
}

export type AddSupplierBillPayload = SupplierBillFormValues;

export type EditSupplierBillPayload = Partial<SupplierBillFormValues> & {
  supplierBillId: string;
};

export interface SupplierBillDataResponse extends PageStatus {
  supplierBill_data: SupplierBillBase[];
  totalData: number;
}

export interface SupplierBillApiResponse extends MessageStatus {
  data: SupplierBillDataResponse;
}
