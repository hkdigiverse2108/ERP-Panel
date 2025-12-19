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
  IFSCCode?: string;
  swiftCode?: string;
}

export interface EmployeeBase {
  name: string;
  username: string;
  mobileNo: string;
  email: string;
  panNumber: string;
  role: string;

  address: Address;
  bankDetails: BankDetails;

  wages: number | "";
  commission: number | "";
  extraWages: number | "";
  target: number | "";
  isActive: boolean;
}

export interface AddEmployeePayload extends EmployeeBase {
  companyId: string;
}

export interface EditEmployeePayload extends Partial<EmployeeBase> {
  companyId: string;
  employeeId: string;
}

export interface EmployeeResponse extends EmployeeBase {
  _id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeFormValues = EmployeeBase;