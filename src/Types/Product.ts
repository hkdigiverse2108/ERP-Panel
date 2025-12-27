import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface ProductFormValues {
  _id: string;
  name?: string;
  code?: string;
  category?: string;
  price?: number;
  quantity?: number;
  gst?: number;
  description?: string;
  isActive?: boolean;
  _submitAction?: string;
   companyId?: string;
}


export type AddProductPayload = ProductFormValues;

export type EditProductPayload = AddProductPayload & {productId: string};

export type ProductBase = ProductFormValues & CommonDataType;

export interface ProductDataResponse extends PageStatus {
  product_data: ProductBase[];
}

export interface ProductApiResponse extends MessageStatus {
  data: ProductDataResponse;
}
