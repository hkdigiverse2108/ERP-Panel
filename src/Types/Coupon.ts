import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface CouponFormValues {
  couponPrice?: number;
  endDate?: string;
  expiryDays?: number;
  isActive?: boolean;
  name?: string;
  redeemValue?: number;
  redemptionType?: string;
  singleTimeUse?: boolean;
  startDate?: string;
  status?: string;
  usageLimit?: number;
  usedCount?: number;
  _submitAction?: string;
}

export type AddCouponPayload = CouponFormValues;

export type EditCouponPayload = AddCouponPayload & { couponId: string };

export interface CouponBase extends CouponFormValues, CommonDataType {
  companyId: string;
}

export interface CouponDataResponse extends PageStatus {
  coupon_data: CouponBase[];
}

export interface CouponApiResponse extends MessageStatus {
  data: CouponDataResponse;
}

export interface CouponDropdownApiResponse extends MessageStatus {
  data: CouponBase[];
}
