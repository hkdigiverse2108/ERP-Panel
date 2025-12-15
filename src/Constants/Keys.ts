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
    LIST_IMAGE: ["upload", "image"],
    LIST_PDF: ["upload", "pdf"],
    ADD: ["upload", "add"], // mutation
    DELETE: ["upload", "delete"], // mutation
  },

  USER: {
    ROOT: ["user"],
    LIST: ["user", "list"],
    DETAIL: (id: string) => ["user", "detail", id],
    ADD: ["user", "add"], // mutation
    EDIT: ["user", "edit"], // mutation
    DELETE: ["user", "delete"], // mutation
  },
};
