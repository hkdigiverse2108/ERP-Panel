import type { AccountBase } from "./Account";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface JournalVoucherEntryBase {
  accountId: AccountBase | string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalVoucherBase extends CommonDataType {
  paymentNo: string;
  date: string;
  description?: string;
  entries: JournalVoucherEntryBase[];
  totalDebit: number;
  totalCredit: number;
  status: "draft" | "posted";
}

export interface JournalVoucherDataResponse extends PageStatus {
  journalVoucher_data: JournalVoucherBase[];
}

export interface JournalVoucherApiResponse extends MessageStatus {
  data: JournalVoucherDataResponse;
}

export interface JournalVoucherDropdownApiResponse extends MessageStatus {
  data: JournalVoucherBase[];
}

export interface AddJournalVoucherPayload {
  date: string;
  description?: string;
  entries: {
    accountId: string;
    debit: number;
    credit: number;
    description?: string;
  }[];
  totalDebit: number;
  totalCredit: number;
  status: "draft" | "posted";
}

export interface EditJournalVoucherPayload extends Partial<AddJournalVoucherPayload> {
  journalVoucherId: string;
}

export interface JournalVoucherFormValues {
  date: string;
  description?: string;
  entries: {
    accountId: string;
    debit: number | "";
    credit: number | "";
    description?: string;
  }[];
  totalDebit?: number;
  totalCredit?: number;
  status: "draft" | "posted";
  _submitAction?: "save" | "saveAndNew";
}
