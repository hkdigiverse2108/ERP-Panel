
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  AUTH: {
    SIGNIN: "/auth/signin",
  },
  CONTACT: {
    BASE: "/contact",
  },
  EMPLOYEE: {
    BASE: "/employee",
    LIST: "/employee/list",
    EDIT:"/employee/edit/:id", 
    ADD_EDIT:"/employee/add-edit",
  },
  INVENTORY: {
    STOCK: "/stock",
     PRODUCT: {
     BASE: "inventory/product",
     ADDEDIT:"/inventory/product/add-edit/:id?",
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
  },
  SETTINGS: {
    GENERAL: "/setting/general",
  },
  COMPANY: {
    EDIT: "/company/edit",
  }, 
 BRANCH:{
  BASE :"/branch",
  EDIT :"/branch/edit",
 },
  
  
  
 } as const;
