import type { ProductBase } from "./Product";

export interface WeightScaleFormValues {
  baudRate?: string;
  dataBits?: string;
  stopBits?: string;
  parity?: string;
  flowControl?: string;
  precision?: string;
}

export interface PosProductDataModal extends Omit<ProductBase, "sellingPrice" | "mrp" | "sellingDiscount"> {
  sellingQty: number;
  discount: number;
  sellingPrice: number;
  mrp: number;
  sellingDiscount: number;
}

interface PosProductType {
  product: PosProductDataModal[];
  customerId: string;
  salesmanId: string;
  totalQty: number;
  totalMep: number;
  totalTaxAmount: number;
  totalCharges: number;
  totalDiscount: number;
  totalFlatDiscount: number;
  totalRoundOFF: number;
  remarks: string;
  totalAmount: number;
}

export interface PosSliceState {
  isMultiplePay: boolean;
  productDataModal: PosProductDataModal[];
  PosProduct: PosProductType;
}
