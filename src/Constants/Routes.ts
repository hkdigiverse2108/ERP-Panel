

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ACCESS_DENIED: "/access-denied",
  AUTH: {
    SIGNIN: "/auth/signin",
  },
  CONTACT: {
    BASE: "/contact",
    ADD_EDIT: "/edit/add",
  },
  USERS: {
    BASE: "/user",
    ADD_EDIT: "/user/add-edit",
    PERMISSION_ADD_EDIT: "/user/permission/add-edit",
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

  BILL_OF_Live_Product: {
    BASE: "/bill-of-live-product",
    ADD_EDIT: "/bill-of-live-product/add-edit",
  },

  PRODUCT_B2B_MAPPING: "/product-b2b-mapping",
  RECIPE: {
    BASE: "/recipe",
    ADD_EDIT: "/recipe/add-edit",
  },
  MATERIAL_CONSUMPTION: {
    BASE: "/material-consumption",
    ADD_EDIT: "/material-consumption/add-edit",
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
  SUPPLIER_BILL: {
    BASE: "/supplier-bill",
    ADD_EDIT: "/supplier-bill/add-edit",
  },
  ADDITIONAL_CHARGES: {
    BASE: "/additional-charge",
    ADD_EDIT: "/additional-charge/add-edit",
  },
  COUPON: {
    BASE: "/coupon",
    ADD_EDIT: "/coupon/add-edit",
  },
  PURCHASE_ORDER: {
    BASE: "/purchase-order",
    ADD_EDIT: "/purchase-order/add-edit",
  },

} as const;
