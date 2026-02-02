import type { ProductBase } from "./Product";

export interface WeightScaleFormValues {
  baudRate?: string;
  dataBits?: string;
  stopBits?: string;
  parity?: string;
  flowControl?: string;
  precision?: string;
}

export interface PosProductDataModal extends Omit<ProductBase, "sellingPrice" | "mrp"> {
  sellingQty: number;
  discount: number;
  sellingPrice: number;
  mrp: number;
}
export interface PosSliceState {
  isMultiplePay: boolean;
  productDataModal: PosProductDataModal[];
}
