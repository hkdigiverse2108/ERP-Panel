import type { CommonDataType, MessageStatus } from "./Common";
import type { ContactBase } from "./Contacts";
import type { EmployeeBase } from "./Employee";
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
  posQty: number;
  discount: number;
  sellingPrice: number;
  mrp: number;
  sellingDiscount: number;
  additionalDiscount: number;
  unitCost: number;
  netAmount: number;
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
  salesManId: string;
  totalQty: number;
  totalMrp: number;
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
  isSelectProduct: string;
  PosProduct: PosProductType;
}

export interface PosProductOrderFormValues extends Omit<Partial<PosProductType>, "items"> {
  companyId?: string;
  orderNo?: string;
  items?: {
    productId?: string;
    qty?: number;
    mrp?: number;
    discountAmount?: number;
    additionalDiscountAmount?: number;
    unitCost?: number;
    netAmount?: number;
  }[];
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

export interface PosProductOrderBase extends Omit<PosProductOrderFormValues, "customerId" | "salesManId">, CommonDataType {
  customerId: ContactBase;
  salesManId: EmployeeBase;
}

export interface PosProductOrderApiResponse extends MessageStatus {
  data: PosProductOrderBase[];
}
