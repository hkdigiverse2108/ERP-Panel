import type { MessageStatus } from "./Common";

/* ===================== BASE MODEL ===================== */

export interface TermsConditionBase {
  _id: string;
  termsCondition?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

/* ===================== FORM / ADD PAYLOAD ===================== */

export interface AddTermsConditionPayload {
  termsCondition?: string;
  isDefault?: boolean;
}

export type TermsConditionFormValues = AddTermsConditionPayload;

/* ===================== EDIT PAYLOAD ===================== */

export interface EditTermsConditionPayload extends AddTermsConditionPayload {
  termsConditionId?: string;
  isActive?: boolean;
}
export interface TermsAndConditionModalProps {
  onSave: (payload: TermsConditionBase) => void;
}
export interface FormValues {
  termsCondition: string;
}

/* ===================== MODAL PROPS ===================== */

export interface TermsAndConditionModalProps {
  onSave: (term: TermsConditionBase) => void;
}

/* ===================== API RESPONSES ===================== */

export interface TermsConditionDataResponse {
  terms_condition_data: TermsConditionBase[];
}

export interface TermsConditionApiResponse extends MessageStatus {
  data: TermsConditionDataResponse;
}

export interface TermsConditionDropdownApiResponse extends MessageStatus {
  data: TermsConditionBase[];
}
