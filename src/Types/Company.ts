import type { CommonDataType, MessageStatus } from "./Common";

export interface CompanyFormValues {
  GSTIdentificationNumber: string;
  GSTRegistrationType: string;
  PanNo: string;
  accountHolderName: string;
  address: string;
  allowRoundOff: boolean;
  authorizedSignature: string;
  bankAccountNumber: string;
  bankIFSC: string;
  bankName: string;
  branch: string;
  city: string;
  contactName: string;
  corporateIdentificationNumber: string;
  country: string;
  customerCareNumber: string;
  decimalPoint: string;
  defaultFinancialYear: string;
  displayName: string;
  email: string;
  employees: [];
  enableFeedbackModule: string;
  financialMonthInterval: string;
  financialYear: string;
  importerExporterCode: string;
  isActive: boolean;
  letterOfUndertaking: string;
  logo: string;
  name: string;
  outletSize: string;
  ownerNo: string;
  phoneNumber: string;
  pinCode: string;
  printDateFormat: string;
  reportFormatLogo: string;
  roles: [];
  state: string;
  supportEmail: string;
  taxDeductionAndCollectionAccountNumber: string;
  timeZone: string;
  upiId: string;
  userIds: [];
  userName: string;
  waterMark: string;
  webSite: string;
}

export type AddCompanyPayload = CompanyFormValues & { companyId?: string };

export type EditCompanyPayload = AddCompanyPayload & { CompanyId: string };

export type CompanyBase = CompanyFormValues & CommonDataType;

export interface CompanyApiResponse extends MessageStatus {
  data: CompanyBase;
}
