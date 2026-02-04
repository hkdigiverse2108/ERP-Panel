import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

/* ===================== COMMON SUB TYPES ===================== */

export interface AdditionalChargeDefaultValue {
  value?: number;
  type?: string;
}

/* ===================== FORM VALUES ===================== */

export interface AdditionalChargesFormValues {
  type?: string;
  name?: string;
  defaultValue?: AdditionalChargeDefaultValue;
  taxId?: string | null;
  accountGroupId?: string | null;
  hsnSac?: string;
  isActive?: boolean;
}

/* ===================== PAYLOADS ===================== */

export type AddAdditionalChargersPayload = AdditionalChargesFormValues;

export type EditAdditionalChargersPayload = AdditionalChargesFormValues & {
  additionalChargeId: string;
};

/* ===================== BASE MODEL ===================== */

export interface AdditionalChargesBase extends AdditionalChargesFormValues, CommonDataType {}

/* ===================== API RESPONSES ===================== */

export interface AdditionalChargesDataResponse extends PageStatus {
  additional_charge_data: AdditionalChargesBase[];
}

export interface AdditionalChargesApiResponse extends MessageStatus {
  data: AdditionalChargesDataResponse;
}

export interface AdditionalChargesDropdownApiResponse extends MessageStatus {
  data: AdditionalChargesBase[];
}
