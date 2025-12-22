import Branch from "../Pages/Branch";

export const PAGE_TITLE = {
  DASHBOARD: "Dashboard",
  SETTINGS: {
    BASE: "Settings",
    GENERAL: "General Settings",
  },
  EMPLOYEE: {
    BASE: "Employee",
    LIST: "Employee List",
  },
  BRANCH: {
    BASE: "Branch",
  },
  CONTACT: {
    BASE: "Contact",
  },
  INVENTORY: {
    BASE: "inventory",
    STOCK: "stock",
    PRODUCT: "Product",
    // PRODUCT: {
    //   BASE: "inventory/product",
    ADDEDIT: "/inventory/product/add-edit/:id?",
    // },
  },
} as const;
