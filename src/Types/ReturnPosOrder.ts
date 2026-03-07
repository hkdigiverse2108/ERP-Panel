import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { ContactBase } from "./Contacts";
import type { EmployeeBase } from "./Employee";
import type { AdditionalChargeType } from "./POS";
import type { PosOrderBase } from "./PosOrder";

export interface ReturnPosOrderFormValues {
  posOrderId?: string;
  customerId?: string;
  salesManId?: string;
  items?: {
    productId: string;
    qty?: number;
    mrp?: number;
    netAmount?: number;
  }[];
  total?: number;
  type?: string;
  reason?: string;
  refundViaCash?: number;
  refundViaBank?: number;
  bankAccountId?: string;
  refundDescription?: string;
  additionalCharges?: AdditionalChargeType[];
  roundOff?: number;
  flatDiscount?: number;
  discountAmount?: string;
}

export type AddReturnPosOrderPayload = ReturnPosOrderFormValues;

export type EditReturnPosOrderPayload = ReturnPosOrderFormValues & { creditNoteId?: string };

export interface ReturnPosOrderBase extends Omit<ReturnPosOrderFormValues, "customerId" | "salesManId" | "posOrderId">, CommonDataType {
  creditNoteNo: string;
  customerId: ContactBase;
  salesManId: EmployeeBase;
  posOrderId: PosOrderBase;
}

export interface ReturnPosOrderDataResponse extends PageStatus {
  returnPosOrder_data: ReturnPosOrderBase[];
}

export interface ReturnPosOrderApiResponse extends MessageStatus {
  data: ReturnPosOrderDataResponse;
}

export interface ReturnPosOrderDropdownApiResponse extends MessageStatus {
  data: ReturnPosOrderBase[];
}
