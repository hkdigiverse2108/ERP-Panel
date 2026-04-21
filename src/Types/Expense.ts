import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { ContactBase } from "./Contacts";
import type { EmployeeBase } from "./Employee";
import type { SalaryBase } from "./Salary";


export interface ExpenseFormValues {
  partyId?: string;
  bankId?: string;
  posOrderId?: string;
  fromDate?: string | Date | null;
  amount?: number;
  isActive?: boolean;
  description?: string;
  status?: string;
  _submitAction?: string;
  type?: string;
  image?: string | File | null;
  isSalary?: boolean;
}

export type AddExpensePayload = ExpenseFormValues & {
  companyId?: string;
};

export type EditExpensePayload = AddExpensePayload & {
  expenseId: string;
};

/* ================= BASE MODEL ================= */
export type ExpenseBase = Omit<ExpenseFormValues, "partyId" | "total"> &
  CommonDataType & {
    partyId?: ContactBase | EmployeeBase;
    total?: SalaryBase;
  };

/* ================= API RESPONSES ================= */
export interface ExpenseDataResponse extends PageStatus {
  expense_data: ExpenseBase[];
}

export interface ExpenseApiResponse extends MessageStatus {
  data: ExpenseDataResponse;
}
