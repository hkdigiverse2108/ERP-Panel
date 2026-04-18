const CommonSalesImportDemo = "/assets/files/SalesImportDemo.xlsx";

export const DEMO_FILE_URL = {
  PRODUCT: "/assets/files/ProductImportDemo.xlsx",
  CONTACT: "/assets/files/ContactImportDemo.xlsx",
  PURCHASE_ORDER: "/assets/files/PurchaseOrderImportDemo.xlsx",
  SUPPLIER_BILL: "/assets/files/SupplierBillImportDemo.xlsx",
  ESTIMATE: CommonSalesImportDemo,
  SALES_ORDER: CommonSalesImportDemo,
  INVOICE: CommonSalesImportDemo,
  DELIVERY_CHALLAN: CommonSalesImportDemo,
} as const;

export type DemoFileKey = keyof typeof DEMO_FILE_URL;
