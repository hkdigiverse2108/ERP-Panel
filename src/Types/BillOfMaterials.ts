import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

/* ---------------- INGREDIENT ---------------- */

export interface Ingredient {
  productId: string;
  batch?: string;
  availableQty?: number;
  useQty: number;
}

/* ---------------- PRODUCT DETAILS ---------------- */

export interface BillOfLiveProductDetail {
  productId: string;
  qty: number;

  purchasePrice?: number;
  landingCost?: number;
  mrp?: number;
  sellingPrice?: number;

  mfgDate?: string;
  expiryDays?: number;
  expiryDate?: string;

  batchNo?: string;

  ingredients?: Ingredient[];
}

/* ---------------- FORM VALUES ---------------- */

export interface BillOfLiveProductFormValues {
  date?: string;
  number?: string;

  recipeId?: string[];

  allowReverseCalculation?: boolean;

  productDetails?: BillOfLiveProductDetail[];
  isActive?: boolean;
  _submitAction?: string;
}

/* ---------------- PAYLOADS ---------------- */

export type AddBillOfLiveProductPayload = BillOfLiveProductFormValues & {
  companyId?: string;
};

export type EditBillOfLiveProductPayload = BillOfLiveProductFormValues & {
  billOfLiveProductId: string;
};

/* ---------------- BASE ---------------- */

export interface BillOfLiveProductBase extends BillOfLiveProductFormValues, CommonDataType {}

/* ---------------- API RESPONSE ---------------- */

export interface BillOfLiveProductDataResponse extends PageStatus {
  billOfLiveProduct_data: BillOfLiveProductBase[];
}

export interface BillOfLiveProductApiResponse extends MessageStatus {
  data: BillOfLiveProductDataResponse;
}
