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
    ADD: "company/add",
    ALL: "company/all",
    ONE: (id: string) => `/company/${id}`,
    EDIT: "/company/edit",
   
  },
  EMPLOYEE: {
    BASE: "/employee",
    ADD: "/employee/add",
    ALL: "/employee/all",
    ONE: (id: string) => `/employee/${id}`,
    EDIT: "/employee/edit",
  },

  BRANCH: {
    BASE: "/branch",
    ADD: "/branch/add",
    ALL: "/branch/all",
    ONE: (id: string) => `/branch/${id}`,
    EDIT: "/branch/edit",
  },
} as const;
