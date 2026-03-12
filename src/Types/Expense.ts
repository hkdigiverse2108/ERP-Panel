import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";

export interface ExpenseFormValues {
  amount?: number;
  image?: string;
  description?: string;
  partyId?: string;
  type?: string;
  total?: number;
  fromDate?: string;
  isActive?: boolean;
}

export type AddExpensePayload = ExpenseFormValues;

export type EditExpensePayload = AddExpensePayload & { paymentId: string };

/* ================= BASE MODEL ================= */
export type ExpenseBase = Omit<ExpenseFormValues, "partyId" | "companyId"> & CommonDataType & { partyId?: ContactBase; companyId?: CompanyBase };

/* ================= API RESPONSES ================= */
export interface ExpenseDataResponse extends PageStatus {
  Expense_data: ExpenseBase[];
}

export interface ExpenseApiResponse extends MessageStatus {
  data: ExpenseDataResponse;
}
