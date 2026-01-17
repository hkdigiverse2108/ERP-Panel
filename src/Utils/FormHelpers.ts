export const RemoveEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (typeof value === "object" && !Array.isArray(value)) {
      const cleaned = RemoveEmptyFields(value);
      if (Object.keys(cleaned).length > 0) {
        result[key as keyof T] = cleaned as T[keyof T];
      }
      return;
    }

    result[key as keyof T] = value;
  });

  return result;
};

export const GetChangedFields = <T extends Record<string, any>>(newVal: T, oldVal: Partial<T> = {}): Partial<T> => {
  const changed: Partial<T> = {};

  (Object.keys(newVal) as (keyof T)[]).forEach((key) => {
    const newValue = newVal[key];
    const oldValue = oldVal[key];

    // ❌ Object / Array skip
    //  if (typeof newValue === "object" && newValue !== null) return;

    // ❌ Object skip (arrays are handled)
    if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) return;

    const isEmpty = (v: any) => v === "" || v === null || v === undefined;

    // ❌ both old & new empty → ignore
    if (isEmpty(newValue) && isEmpty(oldValue)) return;

    // ✅ changed OR cleared value
    if (newValue !== oldValue) {
      changed[key] = newValue;
    }
  });

  return changed;
};

// ============ CONTACT HELPERS ============

import type { ContactBase } from "../Types/Contacts";

export const transformContactData = (contact: ContactBase) => {
  const address = contact?.addressDetails?.at(0);
  return {
    ...contact,
    id: contact?._id,
    // Bank
    bankName: contact?.bankDetails?.name,
    ifscCode: contact?.bankDetails?.ifscCode,
    branchName: contact?.bankDetails?.branch,
    accountNumber: contact?.bankDetails?.accountNumber,
    // Address
    addressLine1: address?.addressLine1,
    addressLine2: address?.addressLine2,
    city: address?.city,
    state: address?.state,
    country: address?.country,
    pinCode: address?.pinCode,
    // GST
    gstIn: address?.gstIn,
    gstType: address?.gstType,
  };
};

export const filterContactByType = (contact: any, contactType: string): boolean => {
  switch (contactType) {
    case "transporter":
      return Boolean(contact.transporterId);
    case "supplier":
      return Boolean(contact.tanNo);
    case "customer":
      return !contact.transporterId && !contact.tanNo;
    default:
      return true;
  }
};

// export const GetChangedFields = <T extends Record<string, any>>(newVal: T, oldVal?: Partial<T>): Partial<T> => {
//   const changed: Partial<T> = {};

//   (Object.keys(newVal) as (keyof T)[]).forEach((key) => {
//     const newValue = newVal[key];
//     const oldValue = oldVal?.[key];

//     if (newValue === undefined) return;

//     if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) {
//       const nested = GetChangedFields(newValue as Record<string, any>, (oldValue as Record<string, any>) ?? {});

//       if (Object.keys(nested).length > 0) {
//         changed[key] = nested as T[keyof T];
//       }
//       return;
//     }

//     if (newValue !== oldValue) {
//       changed[key] = newValue;
//     }
//   });

//   return changed;
// };
