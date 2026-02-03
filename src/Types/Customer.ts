import type { PhoneNumberType } from "./Common";

export interface CustomerFormValues {
  firstName?: string;
  lastName?: string;
  phoneNo?: PhoneNumberType;
  whatsappNo?: PhoneNumberType;
  dateOfBirth?: string;
  email?: string;
  address: {
    addressLine1?: string;
    country?: string;
    state?: string;
    city?: string;
    pinCode?: string;
  };
  contactType?: string;
  customerType?: "retailer";
}
