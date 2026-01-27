import type { CommonDataType, MessageStatus, PageStatus } from "./Common";


export interface StockVerificationItem {
  productId: string;
  landingCost: number;
  price: number;
  mrp: number;
  sellingPrice: number;
  systemQty: number;
  physicalQty: number;
  differenceQty: number;
  differenceAmount: number;
}

export interface StockVerificationRow extends StockVerificationItem {
  name: string;
}

export interface StockVerificationFormValues {
  items: StockVerificationItem[];
  totalProducts: number;
  totalPhysicalQty: number;
  differenceAmount: number;
  status: "pending" | "approved" | "rejected";
  remark?: string;
}

export type AddStockVerificationPayload = StockVerificationFormValues;

export type EditStockVerificationPayload = AddStockVerificationPayload & { StockVerificationId: string };

export type StockVerificationBase = StockVerificationFormValues & CommonDataType;

export interface StockVerificationDataResponse extends PageStatus {
  stockVerification_data: StockVerificationBase[];
}

export interface StockVerificationApiResponse extends MessageStatus {
  data: StockVerificationDataResponse;
}
