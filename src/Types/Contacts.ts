import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";

export interface ContactFormValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: PhoneNumberType;
  whatsappNo?: PhoneNumberType;
  panNo?: string;
  customerCategory?: string;
  paymentMode?: string;
  paymentTerms?: string;
  openingBalance?: string;
  customerType?: string;
  vendorType?: string;
  addressDetails?: addressDetails;
  isActive?: boolean;
  _submitAction?: "save" | "saveAndNew";
}
export interface addressDetails {
  gstType?: string;
  gstIn?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactNo?: PhoneNumberType;
  contactEmail?: string;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  tanNo?: string;
  companyName?: string;
}
export type AddContactPayload = ContactFormValues & { companyId?: string };

export type EditContactPayload = AddContactPayload & { contactId?: string };

export interface ContactBase extends Omit<ContactFormValues, "parentContactId">, CommonDataType {
  parentContactId?: ContactBase;
}

export interface ContactDataResponse extends PageStatus {
  contact_data: ContactBase[];
}

export interface ContactApiResponse extends MessageStatus {
  data: ContactDataResponse;
}

