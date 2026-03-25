import type { AdditionalChargeItem, CommonDataType, MessageStatus, PageStatus, SelectOptionType } from "./Common";
import type { ProductBase } from "./Product";
import type { TermsConditionBase } from "./TermsAndCondition";
import type { Supplier } from "./PurchaseOrder";
import type { UomBase } from "./Uom";
import type { TaxBase } from "./Tax";

/* ===================== SUPPLIER ===================== */

// export type Supplier = ContactBase;

/* ===================== PRODUCT (FORM) ===================== */

export interface SupplierBillProductItem {
  productId?: ProductBase | string;
  _prevProductId?: string;
  qty?: number;
  freeQty?: number;
  mrp?: number;
  uomId?: string | UomBase;
  unit?: string;
  sellingPrice?: number;
  unitCost?: number;
  discount1?: number;
  taxable?: number;
  taxableAmount?: number;
  taxId?: string | TaxBase;
  tax?: number | string;
  taxAmount?: number;
  landingCost?: number;
  margin?: number;
  total?: number;
}
export interface SupplierBillProductDetails {
  item?: SupplierBillProductItem[];
  totalQty?: number;
  totalTax?: number;
  total?: number;
}

/* ===================== RETURN PRODUCT ===================== */

export interface SupplierBillReturnProductItem {
  productId?: ProductBase | string;
  _prevProductId?: string;
  qty?: number;
  uomId?: string | UomBase;
  unit?: string;
  unitCost?: number;
  discount1?: number;
  taxable?: number;
  taxableAmount?: number;
  taxId?: string | TaxBase;
  tax?: number | string;
  taxAmount?: number;
  landingCost?: number;
  margin?: number;
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

/* ===================== SUMMARY ===================== */

export interface SupplierBillSummary {
  flatDiscount?: number;
  grossAmount?: number;
  itemDiscount?: number;
  taxableAmount?: number;
  itemTax?: number;
  discountAmount?: number;
  taxAmount?: number;
  additionalChargeAmount?: number;
  additionalChargeTax?: number;
  billDiscount?: number;
  roundOff?: number;
  netAmount?: number;
  taxSummary?: {
    name: string;
    rate: number;
    amount: number;
  }[];
}

/* ===================== FORM VALUES ===================== */

export interface SupplierBillFormValues {
  supplierId: string;
  supplierBillNo?: string;
  referenceBillNo?: string;
  supplierBillDate: string | Date;
  placeOfSupply?: string;
  gstIn?: string;
  billingAddress?: string;
  paymentTermsId?: string;
  dueDate?: string | Date;
  reverseCharge?: boolean | string;
  shippingDate?: string | Date;
  taxType?: string;
  invoiceAmount?: string;
  productDetails?: SupplierBillProductItem[];
  returnProductDetails?: SupplierBillReturnProductDetails;
  additionalCharges?: AdditionalChargeItem[];
  termsAndConditionIds?: string[];
  notes?: string;
  summary?: SupplierBillSummary;
  billAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;
  paymentStatus?: "paid" | "unpaid" | "partial";
  status?: "active" | "cancelled";
  isActive?: boolean;
  _submitAction?: string;
}
/* ===================== UI ROW TYPES ===================== */

export interface ProductRow {
  productId: string;
  itemCode: string;
  qty: string | number;
  freeQty: string | number;
  uomId: string;
  unit: string;
  unitCost: string | number;
  mrp: string | number;
  sellingPrice: string | number;
  disc1: string | number;
  disc2: string | number;
  taxableAmount: string | number;
  taxId: string;
  itemTax: string | number;
  landingCost: string | number;
  margin: string | number;
  totalAmount: string | number;
  mfgDate: string;
  expiryDate: string;
  taxRate?: number | string;
  taxName?: string;
}

export interface AdditionalChargeRow {
  chargeId: string;
  amount: string;
  taxId: string;
  taxAmount: string;
  totalAmount: string;
}

export interface AdditionalChargesSectionProps {
  show: boolean;
  onToggle: (value: boolean) => void;
  rows: AdditionalChargeRow[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof AdditionalChargeRow, value: string | number | string[]) => void;
  taxOptions: SelectOptionType[];
  isTaxLoading: boolean;
  flatDiscount: string | number;
  onFlatDiscountChange: (value: string | number) => void;
  summary: SupplierBillSummary;
  isAdditionalChargeLoading: boolean;
  additionalChargeOptions: SelectOptionType[];
  roundOffAmount: string | number;
  onRoundOffAmountChange: (value: string | number) => void;
}

/* ===================== COMPONENT PROPS ===================== */

export interface SupplierBillDetailsProps {
  supplierOptions: SelectOptionType[];
  selectedSupplier: Supplier | null;
  isEditing: boolean;
}

/* ===================== API BASE ===================== */

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
  productDetails?: {
    item?: (Omit<SupplierBillProductItem, "productId"> & {
      productId?: ProductBase;
    })[];
    totalQty?: number;
    totalTax?: number;
    total?: number;
  };

  returnProductDetails?: SupplierBillReturnProductDetails;

  additionalCharges?: {
    item?: (Omit<AdditionalChargeItem, "chargeId"> & {
      chargeId?: {
        _id: string;
        name?: string;
        type?: string;
      };
    })[];
    total?: number;
  };

  termsAndConditionIds?: TermsConditionBase[];

  notes?: string;

  summary?: SupplierBillSummary;

  paidAmount?: number;
  balanceAmount?: number;

  paymentStatus?: "paid" | "unpaid" | "partial";
  status?: "active" | "cancelled";

  isActive?: boolean;
}

/* ===================== PAYLOADS ===================== */

export type AddSupplierBillPayload = SupplierBillFormValues;

export type EditSupplierBillPayload = Partial<SupplierBillFormValues> & {
  supplierBillId: string;
};

/* ===================== API RESPONSES ===================== */
export interface SupplierBillDataResponse extends PageStatus {
  supplierBill_data: SupplierBillBase[];
  totalData: number;
  summary: {
    paidAmount: number;
    totalPurchase: number;
    unpaidAmount: number;
  };
}

export interface SupplierBillApiResponse extends MessageStatus {
  data: SupplierBillDataResponse;
}
export interface SupplierBillTabsProps {
  tabValue: number;
  setTabValue: (value: number) => void;
  rows: ProductRow[];
  handleAdd: () => void;
  handleCut: (index: number) => void;
  handleRowChange: (index: number, field: keyof ProductRow, value: string | number | string[]) => void;
  productOptions: SelectOptionType[];
  isProductLoading: boolean;
  termsList: TermsConditionBase[];
  handleDeleteTerm: (index: number) => void;
  returnRows: ProductRow[];
  handleAddReturn: () => void;
  handleCutReturn: (index: number) => void;
  handleReturnRowChange: (index: number, field: keyof ProductRow, value: string | number | string[]) => void;
  returnRoundOffAmount: string | number;
  onReturnRoundOffAmountChange: (value: string | number) => void;
}

export interface ExtendedSupplierBillTabsProps extends Omit<SupplierBillTabsProps, "termsList" | "handleDeleteTerm"> {
  selectedTermIds: string[];
  onTermsChange: (ids: string[]) => void;
}
