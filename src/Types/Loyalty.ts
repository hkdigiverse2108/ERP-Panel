import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";

export interface LoyaltyFormValues {
  campaignExpiryDate?: string;
  campaignLaunchDate?: string;
  description?: string;
  discountValue?: number;
  isActive?: boolean;
  minimumPurchaseAmount?: number;
  name?: string;
  redemptionPoints?: number;
  type?: string;
  usageLimit?: number;
  usedCount?: number;
  singleTimeUse?: boolean;
  _submitAction?: string;
}

export type AddLoyaltyPayload = LoyaltyFormValues;

export type EditLoyaltyPayload = AddLoyaltyPayload & { loyaltyId: string };

export interface LoyaltyBase extends LoyaltyFormValues, CommonDataType {
  companyId: CompanyBase;
  customerIds: ContactBase[];
}

export interface LoyaltyDataResponse extends PageStatus {
  loyalty_data: LoyaltyBase[];
}

export interface LoyaltyApiResponse extends MessageStatus {
  data: LoyaltyDataResponse;
}

export interface LoyaltyDropdownApiResponse extends MessageStatus {
  data: LoyaltyBase[];
}

export interface LoyaltyPointFormValues {
  amount?: string;
  branchId?: string;
  companyId?: CompanyBase;
  points?: string;
}

export type EditLoyaltyPointPayload = LoyaltyPointFormValues & { loyaltyPointId?: string };

export type LoyaltyPointsBase = LoyaltyPointFormValues & CommonDataType;

export interface LoyaltyPointsApiResponse extends MessageStatus {
  data: LoyaltyPointsBase;
}

export interface RedeemLoyaltyPayload {
  loyaltyId: string;
  totalAmount: number;
  customerId: string;
}
export interface RedeemLoyaltyDataResponse {
  discountValue: number;
  loyaltyId: string;
  name: string;
  type: string;
}

export interface RedeemLoyaltyApiResponse extends MessageStatus {
  data: RedeemLoyaltyDataResponse;
}
