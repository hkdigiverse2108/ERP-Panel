import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { AdditionalChargeRow, ProductRow } from "./SupplierBill";

export interface TaxFormValues {
  name?: string;
  percentage?: number | "";
  isActive?: boolean;
}

export type AddTaxPayload = TaxFormValues;

export type EditTaxPayload = AddTaxPayload & { taxId?: string };

export type TaxBase = TaxFormValues & CommonDataType;

export interface TaxDataResponse extends PageStatus {
  tax_data: TaxBase[];
}

export interface TaxApiResponse extends MessageStatus {
  data: TaxDataResponse;
}

export interface TaxDropdownApiResponse extends MessageStatus {
  data: TaxBase[];
}
export interface TaxDetailsProps {
  rows: ProductRow[];
  additionalChargeRows: AdditionalChargeRow[];
  flatDiscount: string | number;
  roundOffAmount: string | number;
}
