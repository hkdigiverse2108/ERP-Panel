
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
  },

  STOCK: {
    BASE: "/stock",
  },
  CATEGORY_BRAND: "/category-brand",
  DEPARTMENT: "/department",
  BILL_OF_MATERIALS: {
    BASE: "/bill-of-materials",
  },
  PRODUCT_B2B_MAPPING: "/product-b2b-mapping",
  RECIPE: {
    BASE: "/recipe",
  },
  MATERIAL_CONSUMPTION: {
    BASE: "/material-consumption",
  },
  STOCK_VERIFICATION: {
    BASE: "/stock-verification",
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
  BRANCH: {
    BASE: "/branch",
    EDIT: "/branch/add-edit",
  },



} as const;
