import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";

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
  fullName?: string;
  username?: string;
  designation?: string;
  phoneNo?: PhoneNumberType;
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
  companyId?: string 
}

export type AddEmployeePayload = EmployeeFormValues;

export type EditEmployeePayload = AddEmployeePayload & { userId: string };

export type EmployeeBase = EmployeeFormValues & CommonDataType;

export interface EmployeeDataResponse extends PageStatus {
  user_data: EmployeeBase[];
}

export interface EmployeeApiResponse extends MessageStatus {
  data: EmployeeDataResponse;
}
