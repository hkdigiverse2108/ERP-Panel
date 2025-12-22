import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface Address {
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
}

export interface BankDetails {
  bankName: string;
  branch: string;
  accountNumber: string;
  bankHolderName: string;
  swiftCode?: string;
}

export interface EmployeeBase extends CommonDataType {
  name: string;
  username: string;
  mobileNo: string;
  email: string;
  panNumber: string;
  role: string;

  address: Address;
  bankDetails: BankDetails;

  wages: number;
  commission: number;
  extraWages: number;
  target: number;

  isActive: boolean;
  status: "ACTIVE" | "INACTIVE";

  companyId: string;
}

export interface EmployeeDataResponse extends PageStatus {
  employee_data: EmployeeBase[];
}

export interface EmployeeApiResponse extends MessageStatus {
  data: EmployeeDataResponse;
}
