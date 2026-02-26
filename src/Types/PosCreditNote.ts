import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";

export interface PosCreditNoteFormValues {
  creditsRemaining: number;
  creditsUsed: number;
  isActive: true;
  returnPosOrderId: { _id: string; returnOrderNo: string };
  status: string;
  totalAmount: number;
}

export interface PosCreditNoteRefundFormValues {
  posCreditNoteId?: string;
  refundViaCash?: number;
  refundViaBank?: number;
  bankAccountId?: string;
  refundDescription?: string;
}
export interface PosCreditNoteRedeemFormValues {
  code?: string;
  type?: string;
  customerId?: string;
}
export interface PosCreditNoteRedeemResponse extends MessageStatus {
  data: {
    code: string;
    date: string;
    id: string;
    redeemableAmount: number;
    type: string;
  };
}

export type AddPosCreditNotePayload = PosCreditNoteFormValues;

export type EditPosCreditNotePayload = PosCreditNoteFormValues & { creditNoteId?: string };

export interface PosCreditNoteBase extends PosCreditNoteFormValues, CommonDataType {
  creditNoteNo: string;
  companyId: CompanyBase;
  customerId: ContactBase;
}

export interface PosCreditNoteDataResponse extends PageStatus {
  posCreditNote_data: PosCreditNoteBase[];
}

export interface PosCreditNoteApiResponse extends MessageStatus {
  data: PosCreditNoteDataResponse;
}

export interface PosCreditNoteRedeemDropdownApiResponse extends MessageStatus {
  data: { customerId: string; id: string; no: string }[];
}
