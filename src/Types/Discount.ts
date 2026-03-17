import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { PosProductOrderItem } from "./POS";

export interface BasicEntity {
  _id: string;
  name: string;
}

export interface BuyXGetY {
  buyQty: number;
  getQty: number;
  getProductIds: BasicEntity[];
  getDiscountType: string;
  getDiscountValue: number;
}

export interface ProductAtFixAmount {
  minimumAmount: number;
  freeProductIds: BasicEntity[];
  freeQty: number;
}
export interface RangeWiseRule {
  minQty: number;
  maxQty: number;
  discountType: string;
  discountValue: number;
}

export interface DiscountFormValues {
  isActive?: boolean;
  title?: string;
  discountCode?: string;
  autoApply?: boolean;
  excludeAlreadyDiscounted?: boolean;
  discountApplicable?: string;
  discountMode?: string;
  discountType?: string;
  discountValue?: number;
  buyXGetY?: BuyXGetY;
  productAtFixAmount?: ProductAtFixAmount;
  appliesTo?: string;
  applyToEntireSelection?: boolean;
  categoryIds?: BasicEntity[];
  subcategoryIds?: BasicEntity[];
  brandIds?: BasicEntity[];
  productIds?: BasicEntity[];
  excludedProductIds?: BasicEntity[];
  minimumRequirement?: string;
  minimumPurchaseAmount?: number;
  minimumQuantity?: number;
  usageLimitTotal?: number;
  usageLimitPerCustomer?: boolean;
  usedCount?: number;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  hasEndDate?: boolean;
  branchIds?: string[];
  status?: string;
  rangeWiseRules?: RangeWiseRule[];
  fixedPriceProducts?: unknown[];
  _submitAction?: string;
}

export type AddDiscountPayload = DiscountFormValues;

export type EditDiscountPayload = AddDiscountPayload & { discountId: string };

export interface DiscountBase extends DiscountFormValues, CommonDataType {
  companyId: string;
}

export interface DiscountDataResponse extends PageStatus {
  discount_data: DiscountBase[];
}

export interface DiscountApiResponse extends MessageStatus {
  data: DiscountDataResponse;
}

export interface DiscountDropdownApiResponse extends MessageStatus {
  data: DiscountBase[];
}

export interface VerifyDiscountPayload {
  discountId?: string;
  discountCode?: string;
  customerId?: string;
  totalAmount?: number;
  totalQty?: number;
  items?: (Partial<PosProductOrderItem> & { productId?: string })[];
}
