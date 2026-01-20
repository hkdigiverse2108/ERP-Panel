import type { BankBase } from "./Bank";
import type { AddressApi, AddressBase, CommonDataType, MessageStatus, PhoneNumberType } from "./Common";

export interface CompanyFormValues {
  name?: string;
  displayName?: string;
  contactName?: string;
  email?: string;
  supportEmail?: string;
  phoneNo?: PhoneNumberType;
  ownerNo?: PhoneNumberType;
  customerCareNumber?: string;

  address?: AddressBase;

  bankId?: string;

  upiId?: string;
  bankName?: string;
  bankIFSC?: string;
  branchName?: string;
  accountHolderName?: string;
  bankAccountNumber?: string;

  userName?: string;
  GSTRegistrationType?: string;
  GSTIdentificationNumber?: string;
  PanNo?: string;
  webSite?: string;
  financialYear?: string;
  corporateIdentificationNumber?: string;
  letterOfUndertaking?: string;
  importerExporterCode?: string;
  outletSize?: string;
  fssaiNo?: string;
  taxDeductionAndCollectionAccountNumber?: string;
  printDateFormat?: string;
  decimalPoint?: string;
  currency?: string;

  enableFeedbackModule?: boolean;
  allowRoundOff?: boolean;
  logo?: string;
  waterMark?: string;
  reportFormatLogo?: string;
  authorizedSignature?: string;
}

export type EditCompanyPayload = CompanyFormValues & { companyId: string };

export interface CompanyBase extends Omit<CompanyFormValues, "address" | "bankId">, CommonDataType {
  address: AddressApi;
  bankId?: BankBase;
}

export interface CompanyApiResponse extends MessageStatus {
  data: CompanyBase;
}
