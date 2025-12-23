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
  branch?: string;
  accountNumber?: string;
  bankHolderName?: string;
  swiftCode?: string;
  IFSCCode?: string;
}

export interface EmployeeFormValues {
  name?: string;
  username?: string;
  phoneNo?: string;
  email?: string;
  panNumber?: string;
  role?: string;
  address?: Address;
  bankDetails?: BankDetails;
  wages?: number;
  commission?: number;
  extraWages?: number;
  target?: number;
  isActive?: boolean;
}

export type AddEmployeePayload = EmployeeFormValues & { companyId: string };

export type EditEmployeePayload = AddEmployeePayload & { employeeId: string };

export type EmployeeBase = Omit<EmployeeFormValues, "isActive"> & CommonDataType;

export interface EmployeeDataResponse extends PageStatus {
  employee_data: EmployeeBase[];
}

export interface EmployeeApiResponse extends MessageStatus {
  data: EmployeeDataResponse;
}
