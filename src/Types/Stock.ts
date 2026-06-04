import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface StockFormValues {
  productId?: string;
  variantId?: string | null;
  uomId?: string;
  purchaseTaxId?: string;
  isPurchaseTaxIncluding?: boolean;
  salesTaxId?: string;
  isSalesTaxIncluding?: boolean;
  purchasePrice?: number | null;
  landingCost?: number | null;
  mrp?: number | null;
  sellingDiscount?: number | null;
  sellingPrice?: number | null;
  sellingMargin?: number | null;
  qty?: number | null;
  isActive?: boolean;
  quickPick?: boolean;
  _submitAction?: string;
}

export type AddStockPayload = StockFormValues;

export type EditStockPayload = AddStockPayload & { stockId: string };

export type AddStockBulkAdjustmentPayload = {
  items: {
    qty: number | null;
    productId: string;
  }[];
  consumptionTypeId: string;
};

export type StockBase = StockFormValues & CommonDataType;

export interface StockDataResponse extends PageStatus {
  stock_data: StockBase[];
}

export interface StockApiResponse extends MessageStatus {
  data: StockDataResponse;
}
