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
    ADD: "/user/add",
    ALL: "/user/all",
    ONE: (id: string) => `/user/${id}`,
    EDIT: "/user/edit",
    DELETE: "/user/delete/",
  },
  COMPANY: {
    ADD: "/company/add",
    ALL: "/company/all",
    ONE: (id: string) => `/company/${id}`,
    EDIT: "/company/edit",
  },
  EMPLOYEE: {
    BASE: "/user",
    ALL: "/user/all",
    ADD: "/user/add",
    EDIT: "/user/edit",
  },

  BRANCH: {
    BASE: "/branch",
    ALL: "/branch/all",
    ADD: "/branch/add",
    EDIT: "/branch/edit",
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
    ADD: "/product/add",
    ALL: "/product/all",
    ONE: (id: string) => `/product/${id}`,
    EDIT: "Product/edit",
  },

  STOCK: {
    BASE: "/stock",
    ALL: "/stock/all",
    ONE: (id: string) => `/stock/${id}`,
  },

  CALL_REQUEST: {
    BASE: "/call-request",
    ADD: "/call-request/add",
  },
  BANK: {
    BASE: "/bank",
    ADD: "/bank/add",
    EDIT: "/bank/edit",
  },
  PAYMENT: {
    BASE: "/payment",
    ADD: "/payment/add",
    EDIT: "/payment/edit",
    ALL: "/payment/all",
  },
} as const;
