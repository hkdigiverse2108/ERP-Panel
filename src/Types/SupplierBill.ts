import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { ContactBase } from "./Contacts";
import type { ProductBase } from "./Product";

export interface DiscountValue {
  value?: number;
  type?: "percentage" | "flat" | "PERCENTAGE" | "AMOUNT";
}

export interface SupplierBillProductItem {
  productId?: string | ProductBase;
  qty?: number;
  freeQty?: number;
  unitCost?: number;
  mrp?: number;
  sellingPrice?: number;
  discount1?: DiscountValue;
  discount2?: DiscountValue;
  taxableAmount?: number;
  taxAmount?: number;
  total?: number;
}

export interface SupplierBillReturnProductItem {
  productId?: string | ProductBase;
  batchNo?: string;
  qty?: number;
  unit?: string;
  unitCost?: number;
  discount1?: DiscountValue;
  discount2?: DiscountValue;
  taxableAmount?: number;
  total?: number;
}

export interface AdditionalCharge {
  chargeId?: {
    _id: string;
    name?: string;
    type?: string;
  };
  value?: number;
  taxRate?: number;
  total?: number;
}

export interface SupplierBillSummary {
  flatDiscount?: DiscountValue;
  grossAmount?: number;
  itemDiscount?: number;
  taxableAmount?: number;
  itemTax?: number;
  additionalChargeAmount?: number;
  additionalChargeTax?: number;
  billDiscount?: number;
  roundOff?: number;
  netAmount?: number;
}

export interface SupplierBillFormValues {
  supplierId: string;
  supplierBillNo?: string;
  referenceBillNo?: string;
  supplierBillDate: string | Date;
  taxType: string;
  purchaseOrderId?: string | null;
  paymentTerm?: string;
  dueDate?: string | Date;
  reverseCharge?: boolean;
  shippingDate?: string | Date;
  invoiceAmount?: string;
  productDetails?: SupplierBillProductItem[];
  returnProductDetails?: SupplierBillReturnProductItem[];
  additionalCharges?: AdditionalCharge[];
  termsAndConditionId?: string;
  notes?: string;
  summary?: SupplierBillSummary;
  paidAmount?: number;
  companyId?: string;
  isActive?: boolean;
}

export interface SupplierBillBase extends CommonDataType {
  supplierId?: ContactBase;
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
  productDetails?: SupplierBillProductItem[];
  returnProductDetails?: SupplierBillReturnProductItem[];
  additionalCharges?: AdditionalCharge[];
  termsAndConditionId?: {
    _id: string;
    termsCondition?: string;
  };
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
