import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { PosProductDataModal } from "./POS";

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

export interface VerifyCouponPayload {
  couponId: string;
  totalAmount: number;
  customerId: string;
}
export interface VerifyCouponDataResponse {
  discountApplicable: string;
  discountCode: string;
  discountId: string;
  qualifyingItemCount: number;
  title: string;
  couponId: string;
  discountAmount: number;
  discountMode: string;
  finalAmount: number;
  freeProducts: PosProductDataModal[];
  name: string;
  redeemValue: number;
  redemptionType: string;
}

export interface VerifyCouponApiResponse extends MessageStatus {
  data: VerifyCouponDataResponse;
}
