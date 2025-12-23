import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface Address {
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
}

export interface BankDetails {
  bankName?: string;
  branchName?: string;
  accountNumber?: string;
  bankHolderName?: string;
  swiftCode?: string;
  IFSCCode?: string;
}

export interface EmployeeFormValues {
  name?: string;
  username?: string;
  designation?: string;
  phoneNo?: string;
  email?: string;
  branchId?: string;
  panNumber?: string;
  role?: string;
  address?: Address;
  bankDetails?: BankDetails;
  wages?: number;
  commission?: number;
  extraWages?: number;
  target?: number;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddEmployeePayload = EmployeeFormValues & { companyId: string };

export type EditEmployeePayload = AddEmployeePayload & { employeeId: string };

export type EmployeeBase = EmployeeFormValues & CommonDataType;

export interface EmployeeDataResponse extends PageStatus {
  employee_data: EmployeeBase[];
}

export interface EmployeeApiResponse extends MessageStatus {
  data: EmployeeDataResponse;
}
