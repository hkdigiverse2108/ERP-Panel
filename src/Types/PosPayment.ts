import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface PosPaymentFormValues {
  paymentNo?: string;
  voucherType?: string;
  paymentType?: string;
  partyId?: string;
  bankId?: string;
  posOrderId?: string;
  paymentMode?: string;
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  kasar?: number;
  amount?: number;
  isNonGST?: boolean;
  isActive?: boolean;
  companyId?: string;
  accountId?: string;
  remark?: string;
}

export type AddPosPaymentPayload = PosPaymentFormValues & {
  companyId?: string;
};

export type EditPosPaymentPayload = AddPosPaymentPayload & {
  paymentId: string;
};

/* ================= BASE MODEL ================= */
export type PosPaymentBase = PosPaymentFormValues & CommonDataType;

/* ================= API RESPONSES ================= */
export interface PosPaymentDataResponse extends PageStatus {
  posPayment_data: PosPaymentBase[];
}

export interface PosPaymentApiResponse extends MessageStatus {
  data: PosPaymentDataResponse;
}
