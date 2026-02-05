import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

/* ================= FORM VALUES ================= */

export interface AccountGroupFormValues {
  name?: string;
  percentage?: number | "";
  parentGroupId?: string | null;
  nature?: string | null;
  isActive?: boolean;
}

/* ================= PAYLOAD ================= */

export type AddAccountGroupPayload = AccountGroupFormValues;

export type EditAccountGroupPayload = AccountGroupFormValues & {
  accountGroupId: string;
};

/* ================= BASE MODEL ================= */

export interface AccountGroupBase extends Omit<AccountGroupFormValues, "parentGroupId">, CommonDataType {
  groupLevel?: number;

  parentGroupId?:
    | string
    | {
        _id: string;
        name?: string;
        parentGroupId?: string | null;
        nature?: string | null;
        groupLevel?: number;
      }
    | null;
}

/* ================= PAGINATION RESPONSE ================= */

export interface AccountGroupDataResponse extends PageStatus {
  accountGroup_data: AccountGroupBase[];
  totalData: number;
}

/* ================= API RESPONSES ================= */

export interface AccountGroupApiResponse extends MessageStatus {
  data: AccountGroupDataResponse;
}

export interface AccountGroupDropdownApiResponse extends MessageStatus {
  data: AccountGroupBase[];
}
