import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { TaxBase } from "./Tax";

/* ===================== FORM VALUES ===================== */
export interface AdditionalChargesFormValues {
  type?: string;
  name?: string;
  defaultValue?: number;
  taxId?: string | null;
  hsnSac?: string;
  isActive?: boolean;
  isTaxIncluding?: boolean;
}

/* ===================== PAYLOADS ===================== */

export type AddAdditionalChargesPayload = AdditionalChargesFormValues;

export type EditAdditionalChargesPayload = AddAdditionalChargesPayload & { additionalChargeId?: string };

/* ===================== BASE MODEL ===================== */

export interface AdditionalChargesBase extends Omit<AdditionalChargesFormValues, "taxId">, CommonDataType {
  taxId?: TaxBase;
}

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
