import type { BankBase } from "./Bank";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";
import type { PosOrderBase } from "./PosOrder";

export interface PosPaymentFormValues {
  voucherType?: string;
  paymentType?: string;
  partyId?: string;
  bankId?: string;
  posOrderId?: string;
  posCreditNoteId?: string;
  purchaseBillId?: string;
  paymentMode?: string;
  date?: string | Date | null;
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  kasar?: number;
  amount?: number;
  isNonGST?: boolean;
  isActive?: boolean;
  companyId?: string;
  remark?: string;
  status?: string;
  _submitAction?: string;
  posCashRegisterId?: string;
  discountAmount?: number;
  taxId?: string;
  //Expense
  fromDate?: string;
  image?: string;
  docType?: string;
}

export type AddPosPaymentPayload = PosPaymentFormValues & {
  companyId?: string;
};

export type EditPosPaymentPayload = AddPosPaymentPayload & {
  posPaymentId: string;
};

/* ================= BASE MODEL ================= */
export type PosPaymentBase = Omit<PosPaymentFormValues, "partyId" | "bankId" | "posOrderId" | "companyId"> &
  CommonDataType & {
    paymentNo?: string;
    partyId?: ContactBase;
    bankId?: BankBase;
    posOrderId?: PosOrderBase;
    companyId?: CompanyBase;
  };

/* ================= API RESPONSES ================= */
export interface PosPaymentDataResponse extends PageStatus {
  posPayment_data: PosPaymentBase[];
}

export interface PosPaymentApiResponse extends MessageStatus {
  data: PosPaymentDataResponse;
}

export interface PosPendingPaymentDropdownApiResponse extends MessageStatus {
  data: {
    _id: string;
    balanceAmount: number;
    customerId: string;
    docNo: string;
    docType: string;
    name: string;
    paidAmount: number;
  }[];
}
export interface PosPendingCreditDropdownApiResponse extends MessageStatus {
  data: {
    balanceAmount: number;
    customerId: string;
    docNo: string;
    docType: string;
    name: string;
    totalAmount: number;
    _id: string;
  }[];
}
