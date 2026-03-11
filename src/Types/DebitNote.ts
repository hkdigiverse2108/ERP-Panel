import type { AccountBase } from "./Account";
import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";

export interface DebitNoteFormValues {
  type?: string;
  bankAccountId?: string;
  date?: string;
  amount?: string;
  phoneNo?: PhoneNumberType;
  description?: string;
  isActive?: boolean;
  file?: string | File | null;
  _submitAction?: string;
}

export type AddDebitNotePayload = DebitNoteFormValues;

export type EditDebitNotePayload = DebitNoteFormValues & { debitNoteId: string };

export interface DebitNoteBase extends Omit<DebitNoteFormValues, "fromAccountId" | "toAccountId">, CommonDataType {
  fromAccountId: AccountBase;
  toAccountId: AccountBase;
}

export interface DebitNoteDataResponse extends PageStatus {
  debitNote_data: DebitNoteBase[];
}

export interface DebitNoteApiResponse extends MessageStatus {
  data: DebitNoteDataResponse;
}

export interface DebitNoteDropdownApiResponse extends MessageStatus {
  data: DebitNoteBase[];
}
