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
    ROOT: ["employee"],
    ALL: ["employee", "all"],
    DETAILS: (id: string) => ["employee", "detail", id],
    ADD: ["employee", "add"],
    EDIT: ["employee", "edit"],
    DELETE: ["employee", "delete"], // mutation
  },
};
