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
  tanNo?: string;
  openingBalance?: {
    creditBalance?: string;
    debitBalance?: string;
  };
  customerType?: string;
  vendorType?: string;
  addressDetails?: AddressDetailsArray;
  isActive?: boolean;
  loyaltyPoints?: number;
  dob?: string;
  anniversaryDate?: string;
  telephoneNo?: string;
  remarks?: string;
  supplierType?: string;
  bankDetails?: bankDetails;
  transporterId?: string;
  companyName?: string;
  _submitAction?: "save" | "saveAndNew";
}
export interface AddressDetails {
  gstType: string;
  gstIn: string;
  contactFirstName: string;
  contactLastName: string;
  contactNo: PhoneNumberType;
  contactEmail: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;

  contactCompanyName: string;
}

export type AddressDetailsArray = AddressDetails[];

export interface bankDetails {
  ifscCode?: string;
  name?: string;
  branch?: string;
  accountNumber?: string;
}

export type AddContactPayload = ContactFormValues;

export type EditContactPayload = AddContactPayload & { contactId: string };

export interface ContactBase extends Omit<ContactFormValues, "parentContactId">, CommonDataType {
  parentContactId?: ContactBase;
}

export interface ContactDataResponse extends PageStatus {
  contact_data: ContactBase[];
}

export interface ContactApiResponse extends MessageStatus {
  data: ContactDataResponse;
}
