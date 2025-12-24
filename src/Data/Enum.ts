export const PRODUCT_TYPE = ["finished", "raw_material", "semi_finished", "service", "non_inventory"] as const;

export const RECIPE_TYPE = ["assemble", "unassemble"] as const;

export const PRODUCT_STATUS = ["active", "inactive"] as const;
export const ACCOUNT_TYPE = ["bank", "cash", "other"] as const;
export const ACCOUNT_NATURE = ["assets", "liabilities", "income", "expenses"] as const;
export const CONTACT_TYPE = ["customer", "supplier", "transporter", "both"] as const;
export const CUSTOMER_TYPE = ["retailer", "wholesaler", "merchant", "other"] as const;
export const SUPPLIER_TYPE = ["manufacturer", "stockiest", "trader", "other"] as const;
export const CONTACT_STATUS = ["active", "inactive"] as const;
export const COUPON_DISCOUNT_TYPE = ["percentage", "flat"] as const;
export const COUPON_STATUS = ["active", "inactive"] as const;
export const DISCOUNT_TYPE = ["percentage", "flat"] as const;
export const DISCOUNT_STATUS = ["active", "inactive"] as const;
export const EMPLOYEE_STATUS = ["active", "inactive"] as const;
export const INVOICE_PAYMENT_STATUS = ["paid", "unpaid", "partial"] as const;
export const LOYALTY_STATUS = ["active", "inactive"] as const;
export const LOYALTY_TYPE = ["points", "cashback"] as const;
export const PRODUCT_EXPIRY_TYPE = ["MFG", "expiry"] as const;
export const SUPPLIER_PAYMENT_STATUS = ["paid", "unpaid", "partial"] as const;
export const VOUCHAR_TYPE = ["journal", "payment", "receipt", "expense", "contra"] as const;

export const PRODUCT_TYPE_OPTIONS = [
  { label: "Finished", value: "finished" },
  { label: "Raw Material", value: "raw_material" },
  { label: "Semi Finished", value: "semi_finished" },
  { label: "Service", value: "service" },
  { label: "Non Inventory", value: "non_inventory" },
];

export const CATEGORY_OPTIONS = [{ label: "Flour", value: "679a1c2f8f4de1a01234abcd" }];
export const SUB_CATEGORY_OPTIONS = [{ label: "Whole Wheat", value: "679a1c3d8f4e1a001234abce" }];

export const BRAND_OPTIONS = [{ label: "Organic Brand", value: "679a1c4e8f4e1a001234abcf" }];

export const SUB_BRAND_OPTIONS = [{ label: "Premium", value: "679a1c5f8f4e1a001234abd0" }];
export const DEPARTMENT_OPTIONS = [{ label: "Grocery", value: "679a1c6f8f4e1a001234abd1" }];

export const UOM_OPTIONS = [{ label: "KG", value: "679a1c7f8f4e1a001234abd2" }];

export const TAX_OPTIONS = [
  { label: "GST 5%", value: "679a1c8f8f4e1a001234abd3" },
  { label: "GST 12%", value: "679a1c9f8f4e1a001234abd4" },
];
