import { KEYS, URL_KEYS } from "../Constants";
import type { AnnouncementApiResponse, AppQueryOptions, BankApiResponse, BankDropdownApiResponse, BranchApiResponse, BranchDropdownApiResponse, BrandApiResponse, BrandDropdownApiResponse, CategoryApiResponse, CategoryDropdownApiResponse, CompanyApiResponse, ContactApiResponse, ContactDropdownApiResponse, CountryApiResponse, EmployeeApiResponse, MaterialConsumptionApiResponse, Params, PermissionChildApiResponse, PermissionDetailsApiResponse, PosHoldOrderApiResponse, ProductApiResponse, ProductDropDownApiResponse, ProductSingleApiResponse, RecipeApiResponse, RecipeDropdownApiResponse, RolesApiResponse, RolesDropdownApiResponse, SingleEmployeeApiResponse, StockApiResponse, StockVerificationApiResponse, TaxApiResponse, TaxDropdownApiResponse, UomDropdownApiResponse, UploadResponse } from "../Types";
import type { BillOfLiveProductApiResponse } from "../Types/BillOfMaterials";
import type { SupplierBillApiResponse } from "../Types/SupplierBill";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";

export const Queries = {
  // ************ Upload ***********
  useGetUploadImage: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_IMAGE], () => Get(URL_KEYS.UPLOAD.ALL_IMAGE), options),
  useGetUploadPdf: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_PDF], () => Get(URL_KEYS.UPLOAD.ALL_PDF), options),

  // ************ User ***********
  useGetSingleUser: (id?: string) => useQueries<SingleEmployeeApiResponse>([KEYS.USER.BASE], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id }),
  useGetUserDropdown: (params?: Params, enabled?: boolean) => useQueries<SingleEmployeeApiResponse>([KEYS.USER.DROPDOWN, params], () => Get(URL_KEYS.USER.DROPDOWN, params), { enabled: enabled }),

  // ************ Company ***********
  useGetSingleCompany: (id?: string) => useQueries<CompanyApiResponse>([KEYS.COMPANY.BASE, id], () => Get(`${URL_KEYS.COMPANY.BASE}/${id}`), { enabled: !!id }),

  // ************ Employee ***********
  useGetEmployee: (params?: Params) => useQueries<EmployeeApiResponse>([KEYS.USERS.BASE, params], () => Get(URL_KEYS.USERS.ALL, params)),

  // ************ Contact ***********
  useGetContact: (params?: Params) => useQueries<ContactApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.ALL, params)),
  useGetContactDropdown: (params?: Params, enabled?: boolean) => useQueries<ContactDropdownApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.DROPDOWN, params), { enabled: enabled }),

  // ************ Branch ***********
  useGetBranch: (params?: Params,  enabled?: boolean) => useQueries<BranchApiResponse>([KEYS.BRANCH.BASE, params], () => Get(URL_KEYS.BRANCH.ALL, params), { enabled: enabled }),
  useGetBranchDropdown: (params?: Params) => useQueries<BranchDropdownApiResponse>([KEYS.BRANCH.BASE, params], () => Get(URL_KEYS.BRANCH.DROPDOWN, params)),

  // ************ Brand ***********
  useGetBrand: (params?: Params) => useQueries<BrandApiResponse>([KEYS.BRAND.BASE, params], () => Get(URL_KEYS.BRAND.ALL, params)),
  useGetBrandDropdown: (params?: Params, enabled?: boolean) => useQueries<BrandDropdownApiResponse>([KEYS.BRAND.BASE, params], () => Get(URL_KEYS.BRAND.DROPDOWN, params), { enabled: enabled }),

  // ************ Category ***********
  useGetCategory: (params?: Params) => useQueries<CategoryApiResponse>([KEYS.CATEGORY.BASE, params], () => Get(URL_KEYS.CATEGORY.ALL, params)),
  useGetCategoryDropdown: (params?: Params, enabled?: boolean) => useQueries<CategoryDropdownApiResponse>([KEYS.CATEGORY.BASE, params], () => Get(URL_KEYS.CATEGORY.DROPDOWN, params), { enabled: enabled }),

  // ************ Uom ***********
  useGetUomDropdown: (params?: Params) => useQueries<UomDropdownApiResponse>([KEYS.UOM.BASE, params], () => Get(URL_KEYS.UOM.DROPDOWN, params)),

  // ************ Tax ***********
  useGetTax: (params?: Params) => useQueries<TaxApiResponse>([KEYS.TAX.BASE, params], () => Get(URL_KEYS.TAX.ALL, params)),
  useGetTaxDropdown: (params?: Params) => useQueries<TaxDropdownApiResponse>([KEYS.TAX.BASE, params], () => Get(URL_KEYS.TAX.DROPDOWN, params)),

  // ************ Roles ***********
  useGetRoles: (params?: Params) => useQueries<RolesApiResponse>([KEYS.ROLES.BASE, params], () => Get(URL_KEYS.ROLES.ALL, params)),
  useGetRolesDropdown: (params?: Params) => useQueries<RolesDropdownApiResponse>([KEYS.ROLES.BASE, params], () => Get(URL_KEYS.ROLES.DROPDOWN, params)),

  // ************ Announcement ***********
  useGetAnnouncement: () => useQueries<AnnouncementApiResponse>([KEYS.ANNOUNCEMENT.BASE], () => Get(URL_KEYS.ANNOUNCEMENT.ALL)),

  //***************product**************** */
  useGetProduct: (params?: Params) => useQueries<ProductApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.ALL, params)),
  useGetProductDropdown: (params?: Params , enabled?: boolean) => useQueries<ProductDropDownApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.DROPDOWN, params), { enabled: enabled }),
  useGetProductById: (id?: string) => useQueries<ProductSingleApiResponse>([KEYS.PRODUCT.BASE, id], () => Get(`${URL_KEYS.PRODUCT.BASE}/${id}`), { enabled: !!id }),
 
  //************ bank ********/
  useGetBank: (params?: Params) => useQueries<BankApiResponse>([KEYS.BANK.BASE, params], () => Get(URL_KEYS.BANK.ALL, params)),
  useGetBankDropdown: (params?: Params, enabled?: boolean) => useQueries<BankDropdownApiResponse>([KEYS.BANK.BASE, params], () => Get(URL_KEYS.BANK.DROPDOWN, params), { enabled: enabled }),

  //************ recipe ********/
  useGetRecipe: (params?: Params) => useQueries<RecipeApiResponse>([KEYS.RECIPE.BASE, params], () => Get(URL_KEYS.RECIPE.ALL, params)),
  useGetRecipeDropdown: (params?: Params, enabled?: boolean) => useQueries<RecipeDropdownApiResponse>([KEYS.RECIPE.BASE, params], () => Get(URL_KEYS.RECIPE.DROPDOWN, params), { enabled: enabled }),

  //*************** stock **************** */
  useGetStock: (params?: Params) => useQueries<StockApiResponse>([KEYS.STOCK.BASE, params], () => Get(URL_KEYS.STOCK.ALL, params)),

  //*************** stock verification **************** */
  useGetStockVerification: (params?: Params) => useQueries<StockVerificationApiResponse>([KEYS.STOCK_VERIFICATION.BASE, params], () => Get(URL_KEYS.STOCK_VERIFICATION.ALL, params)),

  //*************** Location **************** */
  useGetCountryLocation: () => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE], () => Get(URL_KEYS.LOCATION.COUNTRY)),
  useGetStateLocation: (id?: string) => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE, id], () => Get(`${URL_KEYS.LOCATION.STATE}/${id}`), { enabled: !!id }),
  useGetCityLocation: (id?: string) => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE, id], () => Get(`${URL_KEYS.LOCATION.CITY}/${id}`), { enabled: !!id }),

  //************ bill of materials ********/
  useGetBillOfLiveProduct: (params?: Params) => useQueries<BillOfLiveProductApiResponse>([KEYS.BILL_OF_Live_Product.BASE, params], () => Get(URL_KEYS.BILL_OF_Live_Product.ALL, params)),

  //*************** Permission **************** */
  useGetPermissionDetails: (params?: Params, enabled?: boolean) => useQueries<PermissionDetailsApiResponse>([KEYS.PERMISSION.DETAILS, params], () => Get(URL_KEYS.PERMISSION.DETAILS, params), { enabled: enabled }),
  useGetPermissionChildDetails: (params?: Params, enabled?: boolean) => useQueries<PermissionChildApiResponse>([KEYS.PERMISSION.DETAILS, params], () => Get(URL_KEYS.PERMISSION.CHILD, params), { enabled: enabled }),

  //************ Supplier Bill ********/
  useGetSupplierBillDetails: (params?: Params) => useQueries<SupplierBillApiResponse>([KEYS.SUPPLIER_BILL.BASE, params], () => Get(URL_KEYS.SUPPLIER_BILL.ALL, params)),

  //*************** Material Consumption **************** */
  useGetMaterialConsumption: (params?: Params) => useQueries<MaterialConsumptionApiResponse>([KEYS.MATERIAL_CONSUMPTION.BASE, params], () => Get(URL_KEYS.MATERIAL_CONSUMPTION.ALL, params)),

  //*************** POS **************** */
  useGetPosHoldOrder: (params?: Params, enabled?: boolean) => useQueries<PosHoldOrderApiResponse>([KEYS.POS.BASE, params], () => Get(URL_KEYS.POS.HOLD_ORDER, params), { enabled: enabled }),
};
