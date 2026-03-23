import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface PrefixFormValues {
  name?: string;
  percentage?: number;
  isActive?: boolean;
}

export type AddPrefixPayload = PrefixFormValues;

export type EditPrefixPayload = AddPrefixPayload & { prefixId?: string };

export type PrefixBase = PrefixFormValues & CommonDataType & { companyId: CompanyBase };

export interface PrefixDataResponse extends PageStatus {
  prefix_data: PrefixBase[];
}

export interface PrefixApiResponse extends MessageStatus {
  data: PrefixDataResponse;
}

export interface PrefixDropdownApiResponse extends MessageStatus {
  data: PrefixBase[];
}
