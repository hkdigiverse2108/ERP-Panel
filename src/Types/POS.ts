import type { CommonDataType, MessageStatus } from "./Common";
import type { ContactBase } from "./Contacts";
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

export interface AdditionalChargeType {
  chargeId: string;
  value: number;
  taxId: string;
  accountGroupId: string;
  totalAmount: number;
}

export interface AdditionalChargeRowType extends Omit<AdditionalChargeType, "chargeId" | "taxId" | "accountGroupId"> {
  chargeId: string[];
  taxId: string[];
  accountGroupId: string[];
}

interface PosProductType {
  items: PosProductDataModal[];
  customerId: string;
  orderType: string;
  salesmanId: string;
  totalQty: number;
  totalMep: number;
  totalTaxAmount: number;
  totalDiscount: number;
  totalAdditionalCharge: number;
  flatDiscountAmount: number;
  additionalCharges: AdditionalChargeType[];
  roundOff: number;
  remark: string;
  totalAmount: number;
}

export interface PosSliceState {
  isMultiplePay: boolean;
  productDataModal: PosProductDataModal[];
  PosProduct: PosProductType;
}

export interface PosProductOrderFormValues {
  companyId?: string;
  orderNo?: string;
  customerId?: ContactBase;
  orderType?: string;
  items?: [
    {
      productId: string;
      qty: number;
      mrp: number;
      discountAmount: number;
      additionalDiscountAmount: number;
      unitCost: number;
      netAmount: number;
    },
  ];
  remark?: string;
  totalQty?: number;
  totalMrp?: number;
  totalTaxAmount?: number;
  totalAdditionalCharge?: number;
  totalDiscount?: number;
  flatDiscountAmount?: number;
  roundOff?: number;
  totalAmount?: number;
  additionalCharges?: AdditionalChargeType[];
  paymentMethod?: null;
  paymentStatus?: string;
  status?: string;
  holdDate?: string;
  isActive?: boolean;
}

export type AddPosProductOrderPayload = PosProductOrderFormValues;

export type EditPosProductOrderPayload = AddPosProductOrderPayload & {
  PosProductOrderId: string;
};

export type PosProductOrderBase = PosProductOrderFormValues & CommonDataType;

export interface PosProductOrderApiResponse extends MessageStatus {
  data: PosProductOrderBase[];
}
