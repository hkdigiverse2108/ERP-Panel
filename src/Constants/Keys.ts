// export const KEYS = {
//   AUTH: {
//     SIGNIN: "admin-signin",
//   },
//   UPLOAD: {
//     ADD: "upload",
//     DELETE: "upload",
//     ALL_IMAGE: "upload-images",
//     ALL_PDF: "upload-pdf",
//   },
//   USER: {
//     ADD: "add-user",
//     EDIT: "edit-user",
//   },
// };

export const KEYS = {
  AUTH: {
    SIGNIN: ["auth", "signin"], // mutation
  },

  UPLOAD: {
    ROOT: ["upload"],
    ALL_IMAGE: ["upload", "image"],
    ALL_PDF: ["upload", "pdf"],
    ADD: ["upload", "add"], // mutation
    DELETE: ["upload", "delete"], // mutation
  },

  USER: {
    ROOT: ["user"],
    ALL: ["user", "all"],
    DETAILS: (id: string) => ["user", "detail", id],
    ADD: ["user", "add"], // mutation
    EDIT: ["user", "edit"], // mutation
    DELETE: ["user", "delete"], // mutation
  },

  COMPANY: {
    ROOT: ["company"],
    ALL: ["company", "all"],
    DETAILS: (id: string) => ["company", "detail", id],
    EDIT: ["user", "edit"],
  },

  EMPLOYEE: {
    BASE: "employee",
    ADD: "employee-add",
    EDIT: "employee-edit",
    DELETE: "employee-delete",
  },

  BRANCH: {
    BASE: "branch",
    ADD: "branch-add",
    EDIT: "branch-edit",
    DELETE: "branch-delete",
  },
  
  ROLES: {
    BASE: "role",
    ADD: "role-add",
    EDIT: "role-edit",
    DELETE: "role-delete",
  },

  ANNOUNCEMENT: {
    BASE: "announcement",
  },

  PRODUCT: {
    BASE: "product",
    ROOT: ["product"],
    ALL: ["product", "all"],
    DETAILS: (id: string) => ["product", "detail", id],
    ADD: ["product", "add"],
    EDIT: ["product", "edit"],
    DELETE: ["product", "delete"], // mutation
  },
  STOCK: {
    ROOT: ["stock"],
    ALL: ["stock", "all"],
    DETAILS: (id: string) => ["stock", "detail", id],
  },
  CALL_REQUEST: {
    ROOT: ["call-request"],
    ADD: "call-request",
  },
  BANK: {
    BASE :["bank"],
    ALL: ["bank", "all"],
    ADD: ["bank", "add"],
    EDIT: ["bank", "edit"],
    DELETE: ["bank", "delete"],
  },
  PAYMENT: {
    BASE: ["payment"],
    ADD: ["payment", "add"],
    EDIT: ["payment", "edit"],
    DELETE: ["payment", "delete"],
  },
};
