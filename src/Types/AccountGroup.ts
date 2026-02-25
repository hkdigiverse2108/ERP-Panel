import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

/* ================= FORM VALUES ================= */

export interface AccountGroupFormValues {
  name?: string;
  percentage?: number | "";
  parentGroupId?: string | null;
  nature?: string | null;
  isActive?: boolean;
}

/* ================= PAYLOADS ================= */

export type AddAccountGroupPayload = AccountGroupFormValues;

export type EditAccountGroupPayload = AddAccountGroupPayload & {
  accountGroupId?: string;
};

/* ================= BASE MODEL ================= */

export interface AccountGroupBase extends Omit<AccountGroupFormValues, "parentGroupId">, CommonDataType {
  groupLevel?: number;
  parentGroupId?: AccountGroupBase | null;
}

/* ================= PAGINATION RESPONSE ================= */

export interface AccountGroupDataResponse extends PageStatus {
  accountGroup_data: AccountGroupBase[];
  totalData: number;
}

/* ================= API RESPONSES ================= */

export interface AccountGroupTreeDataResponse {
  _id: string;
  name: string;
  children?: AccountGroupTreeDataResponse[];
}

export interface AccountGroupApiResponse extends MessageStatus {
  data: AccountGroupDataResponse;
}

export interface AccountGroupDropdownApiResponse extends MessageStatus {
  data: AccountGroupBase[];
}
