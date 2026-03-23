import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface PaymentTermsFormValues {
  name?: string;
  percentage?: number;
  isActive?: boolean;
}

export type AddPaymentTermsPayload = PaymentTermsFormValues;

export type EditPaymentTermsPayload = AddPaymentTermsPayload & { paymentTermsId?: string };

export type PaymentTermsBase = PaymentTermsFormValues & CommonDataType & { companyId: CompanyBase };

export interface PaymentTermsDataResponse extends PageStatus {
  paymentTerms_data: PaymentTermsBase[];
}

export interface PaymentTermsApiResponse extends MessageStatus {
  data: PaymentTermsDataResponse;
}

export interface PaymentTermsDropdownApiResponse extends MessageStatus {
  data: PaymentTermsBase[];
}
