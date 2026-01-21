export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  AUTH: {
    SIGNIN: "/auth/signin",
  },
  CONTACT: {
    BASE: "/contact",
    ADD_EDIT: "/edit/add",
  },
  EMPLOYEE: {
    BASE: "/employee",
    ADD_EDIT: "/employee/add-edit",
  },

  PRODUCT: {
    BASE: "/product",
    ADD_EDIT: "/product/add-edit",
    ITEM_ADD_EDIT: "/product/item/add-edit",
  },
  STOCK: {
    BASE: "/stock",
    ADD_EDIT: "/stock/add-edit",
  },
  CATEGORY_BRAND: "/category-brand",
  DEPARTMENT: "/department",
  BILL_OF_MATERIALS: {
    BASE: "/bill-of-materials",
  },
  PRODUCT_B2B_MAPPING: "/product-b2b-mapping",
  RECIPE: {
    BASE: "/recipe",
    ADD_EDIT: "/recipe/add-edit",
  },
  MATERIAL_CONSUMPTION: {
    BASE: "/material-consumption",
  },
  STOCK_VERIFICATION: {
    BASE: "/stock-verification",
    ADD_EDIT: "/stock-verification/add-edit",
  },
  MATERIAL_CREATION: {
    BASE: "/material-creation",
  },

  SETTINGS: {
    GENERAL: "/setting/general",
  },
  COMPANY: {
    EDIT: "/company/edit",
  },
  USER: {
    EDIT: "/user/edit",
  },
  BANK: {
    BASE: "/bank",
    ADD_EDIT: "/bank/add-edit",
  },
  TRANSACTION: {
    BASE: "/transaction",
    ADD_EDIT: "/transaction/add-edit",
  },
  PAYMENT: {
    BASE: "/payment",
    ADD_EDIT: "/payment/add-edit",
  },
  POS: {
    BASE: "/pos",
    NEW: "/pos/new",
  },
  BILLOFMATERIALS: {
    BASE: "/bill-of-materials",
    ADD_EDIT: "/bill-of-materials/add-edit",
  },
} as const;
