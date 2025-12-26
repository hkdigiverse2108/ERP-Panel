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
    BASE: "/employee",
    ALL: "/employee/all",
    ADD: "/employee/add",
    EDIT: "/employee/edit",
  },

  BRANCH: {
    BASE: "/branch",
    ALL: "/branch/all",
    ADD: "/branch/add",
    EDIT: "/branch/edit",
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
    ALL: "/bank/all",
  },
  PAYMENT: {
  BASE: "/payment",
  ADD: "/payment/add",
  EDIT: "/payment/edit",
  ALL: "/payment/all",
},


} as const;
