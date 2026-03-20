import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { EmployeeBase } from "./Employee";

export interface SalaryFormValues {
  amount?: number;
  image?: string | File | null;
  description?: string;
  partyId?: string;
  type?: string;
  incentive?: number;
  fromDate?: string | Date | null;
  toDate?: string | Date | null;
  total?: number | null;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddSalaryPayload = SalaryFormValues;

export type EditSalaryPayload = AddSalaryPayload & { salaryId?: string };
export type SalaryBase = Omit<SalaryFormValues, "partyId" > &
  CommonDataType & {
    partyId?: EmployeeBase;
  };

export interface SalaryDataResponse extends PageStatus {
  salary_data: SalaryBase[];
}

export interface SalaryApiResponse extends MessageStatus {
  data: SalaryDataResponse;
}

export interface SalaryDropdownApiResponse extends MessageStatus {
  data: SalaryBase[];
}
