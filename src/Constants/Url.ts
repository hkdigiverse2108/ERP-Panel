export const URL_KEYS = {
  AUTH: {
    SIGNIN: "/auth/login",
  },
  UPLOAD: {
    ADD: "/upload",
    DELETE: "/upload",
    ALL_IMAGE: "/upload/images",
    ALL_PDF: "/upload/pdf",
  },
  USER: {
    BASE: "/user",
    EDIT: "/user/edit",
  },
  COMPANY: {
    BASE: "/company",
    ALL: "/company/all",
    ADD: "/company/add",
    EDIT: "/company/edit",
  },
  EMPLOYEE: {
    BASE: "/user",
    ALL: "/user/all",
    ADD: "/user/add",
    EDIT: "/user/edit",
  },
  CONTACT: {
    BASE: "/contacts",
    ALL: "/contacts/all",
    ADD: "/contacts/add",
    EDIT: "/contacts/edit",
  },

  BRANCH: {
    BASE: "/branch",
    ALL: "/branch/all",
    ADD: "/branch/add",
    EDIT: "/branch/edit",
  },
  BRAND: {
    BASE: "/brand",
    DROPDOWN: "/brand/dropdown",
    ALL: "/brand/all",
    ADD: "/brand/add",
    EDIT: "/brand/edit",
  },
  CATEGORY: {
    BASE: "/category",
    DROPDOWN: "/category/dropdown",
    ALL: "/category/all",
    ADD: "/category/add",
    EDIT: "/category/edit",
  },
  TAX: {
    BASE: "/tax",
    DROPDOWN: "/tax/dropdown",
    ALL: "/tax/all",
  },
  UOM: {
    BASE: "/uom",
    ALL: "/uom/all",
    DROPDOWN: "/uom/dropdown",
  },
  ROLES: {
    BASE: "/role",
    ALL: "/role/all",
    ADD: "/role/add",
    EDIT: "/role/edit",
  },

  ANNOUNCEMENT: {
    ALL: "/announcement/all",
  },

  PRODUCT: {
    BASE: "/product",
    DROPDOWN: "/product/dropdown",
    ADD: "/product/add",
    ALL: "/product/all",
    EDIT: "/product/edit",
  },

  STOCK: {
    BASE: "/stock",
    ALL: "/stock/all",
    ADD: "/stock/add",
    BULK_ADJUSTMENT: "/stock/bulk-adjustment",
  },

  STOCK_VERIFICATION: {
    BASE: "/stock-verification",
    ALL: "/stock-verification/all",
    ADD: "/stock-verification/add",
    EDIT: "/stock-verification/edit",
  },

  CALL_REQUEST: {
    BASE: "/call-request",
    ADD: "/call-request/add",
  },
  BANK: {
    BASE: "/bank",
    ADD: "/bank/add",
    EDIT: "/bank/edit",
    ALL: "/bank/all",
  },
  PAYMENT: {
    BASE: "/payment",
    ADD: "/payment/add",
    EDIT: "/payment/edit",
    ALL: "/payment/all",
  },
  RECIPE: {
    BASE: "/recipe",
    ADD: "/recipe/add",
    EDIT: "/recipe/edit",
    ALL: "/recipe/all",
  },
  LOCATION: {
    BASE: "/location",
    ALL: "/location/all",
    COUNTRY: "/location/country",
    STATE: "/location/state",
    CITY: "/location/city",
  },
} as const;
