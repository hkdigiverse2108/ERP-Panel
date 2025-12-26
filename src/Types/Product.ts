import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface ProductBase extends CommonDataType {
  companyId: string;
  name: string;
  code: string;
  category: string;
  price: number;
  quantity: number;
  gst: number;
  description?: string;
}

export interface ProductDataResponse extends PageStatus {
  product_data: ProductBase[];
}

export interface ProductApiResponse extends MessageStatus {
  data: ProductDataResponse;
}
 