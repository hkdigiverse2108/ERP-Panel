export const PAGE_TITLE = {
  DASHBOARD: "Dashboard",
  SETTINGS: {
    BASE: "Settings",
    GENERAL: "General Settings",
  },
  EMPLOYEE: {
    BASE: "Employee",
    LIST: "Employee List",
    ADD: "Add Employee",
    EDIT: "Edit Employee",
  },
  BRANCH: {
    BASE: "Branch",
    ADD: "Add Branch",
    EDIT: "Edit Branch",
  },
  CONTACT: {
    BASE: "Contact",
  },
  INVENTORY: {
    BASE: "inventory",
    STOCK: "stock",
    // PRODUCT: "Product",
    PRODUCT: {
      BASE: "product",
      ADDEDIT: "inventory/product/add-edit/:id?",
    },
  },
  BANK: {
    BASE: "Bank",
    BANK: {
      BASE: "Bank",
      ADDEDIT: "Bank/add-edit",
    },
  },
  TRANSACTION: {
    BASE: "Transaction",
  },
} as const;
