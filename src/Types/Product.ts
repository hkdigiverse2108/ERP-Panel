import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface ProductFormValues {
  variants: any;
  _id?: string;
  _submitAction?: string;
  companyId?: string;
  

  itemCode?: string;
  name?: string;
  printName?: string;
  slug?: string;
  productType?: string;
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  subBrandId?: string;
  departmentId?: string;
  uomId?: string;
  purchaseTaxId?: string;
  salesTaxId?: string;
  isPurchaseTaxInclusive?: boolean;
  isSalesTaxInclusive?: boolean;
  cessPercentage?: number;
  mrp?: number;
  sellingPrice?: number;
  purchasePrice?: number;
  landingCost?: number;
  
  hsnCode?: string;
  expiryDays?: string;
  expiryType?: string;
  shortDescription?: string;
  description?: string;
  netWeight?: string;
  nutritionInfo?: string;
  ingredients?: string;
  image?: string;
  
  manageBatch?: boolean;
  hasExpiry?: boolean;
  status?: string;
  
 
  code?: string;
  category?: string;
  price?: number;
  quantity?: number;
  gst?: number;
  isActive?: boolean;
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
