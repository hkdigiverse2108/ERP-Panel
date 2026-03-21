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

  BILL_OF_LIVE_PRODUCT: {
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
    CHANGE_PASSWORD: "/setting/change-password",
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
  BANK_TRANSACTION: {
    BASE: "/bank-transaction",
    ADD_EDIT: "/bank-transaction/add-edit",
  },
  PAYMENT: {
    BASE: "/payment",
    ADD_EDIT: "/payment/add-edit",
  },
  RECEIPT: {
    BASE: "/receipt",
    ADD_EDIT: "/receipt/add-edit",
  },
  EXPENSE: {
    BASE: "/expense",
    ADD_EDIT: "/expense/add-edit",
  },
  SALARY: {
    BASE: "/salary",
    ADD_EDIT: "/salary/add-edit",
  },
  POS: {
    BASE: "/pos",
    NEW: "/pos/new",
    ORDER_LIST: "/pos/order-list",
    CREDIT_NOTE: "/pos/credit-note",
    SALES_REGISTER: "/pos/sales-register",
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
  LOYALTY: {
    BASE: "/loyalty",
    ADD_EDIT: "/loyalty/add-edit",
  },
  DISCOUNT: {
    BASE: "/discount",
    ADD_EDIT: "/discount/add-edit",
  },
  PURCHASE_ORDER: {
    BASE: "/purchase-order",
    ADD_EDIT: "/purchase-order/add-edit",
  },
  PURCHASE_DEBIT_NOTE: {
    BASE: "/purchase-debit-note",
    ADD_EDIT: "/purchase-debit-note/add-edit",
  },
  ACCOUNTING: {
    CREDIT_NOTE: {
      BASE: "/accounting/credit-note",
      ADD_EDIT: "/accounting/credit-note/add-edit",
    },
    DEBIT_NOTE: {
      BASE: "/accounting/debit-note",
      ADD_EDIT: "/accounting/debit-note/add-edit",
    },
  },
  SALES_REGISTER: {
    BASE: "/sales-register",
    EDIT: "/sales-register/edit",
  },

  ESTIMATE: {
    BASE: "/estimate",
    ADD_EDIT: "/estimate/add-edit",
  },

  SALES_ORDER: {
    BASE: "/sales-order",
    ADD_EDIT: "/sales-order/add-edit",
  },

  INVOICE: {
    BASE: "/invoice",
    ADD_EDIT: "/invoice/add-edit",
  },
  DELIVERY_CHALLAN: {
    BASE: "/delivery-challan",
    ADD_EDIT: "/delivery-challan/add-edit",
  },
  SALES_CREDIT_NOTE: {
    BASE: "/sales-credit-note",
    ADD_EDIT: "/sales-credit-note/add-edit",
  },
} as const;
