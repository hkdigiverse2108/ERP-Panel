import type { AccountBase } from "./Account";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface CreditNoteFormValues {
  voucherNumber?: string;
  date?: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount?: string;
  description?: string;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddCreditNotePayload = CreditNoteFormValues;

export type EditCreditNotePayload = CreditNoteFormValues & { creditNoteId: string };

export interface CreditNoteBase extends Omit<CreditNoteFormValues, "fromAccountId" | "toAccountId">, CommonDataType {
  fromAccountId: AccountBase;
  toAccountId: AccountBase;
}

export interface CreditNoteDataResponse extends PageStatus {
  creditNote_data: CreditNoteBase[];
}

export interface CreditNoteApiResponse extends MessageStatus {
  data: CreditNoteDataResponse;
}

export interface CreditNoteDropdownApiResponse extends MessageStatus {
  data: CreditNoteBase[];
}
