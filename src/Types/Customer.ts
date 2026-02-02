import type { PhoneNumberType } from "./Common";

export interface CustomerFormValues {
  name?: string;
  phoneNo?: PhoneNumberType;
  whatsappNo?: PhoneNumberType;
  dateOfBirth?: string;
  email?: string;
  address: {
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    pinCode?: string;
  };
}
