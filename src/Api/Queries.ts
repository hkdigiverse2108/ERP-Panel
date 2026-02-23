import { KEYS, URL_KEYS } from "../Constants";
import type { AccountApiResponse, AccountDropdownApiResponse, AccountGroupDropdownApiResponse, AdditionalChargesApiResponse, AdditionalChargesDropdownApiResponse, AnnouncementApiResponse, AppQueryOptions, BankApiResponse, BankDropdownApiResponse, BillOfLiveProductApiResponse, BranchApiResponse, BranchDropdownApiResponse, BrandApiResponse, BrandDropdownApiResponse, CashControlApiResponse, CategoryApiResponse, CategoryDropdownApiResponse, CompanyApiResponse, ContactApiResponse, ContactDropdownApiResponse, CountryApiResponse, CouponApiResponse, CouponDropdownApiResponse, EmployeeApiResponse, LoyaltyApiResponse, LoyaltyDropdownApiResponse, LoyaltyPointsApiResponse, MaterialConsumptionApiResponse, Params, PermissionChildApiResponse, PermissionDetailsApiResponse, PosCustomerDetailApiResponse, PosOrderApiResponse, PosOrderDropdownApiResponse, PosPaymentApiResponse, PosProductOrderApiResponse, ProductApiResponse, ProductDropDownApiResponse, ProductSingleApiResponse, PurchaseOrderApiResponse, PurchaseOrderDropdownApiResponse, RecipeApiResponse, RecipeDropdownApiResponse, RolesApiResponse, RolesDropdownApiResponse, SingleEmployeeApiResponse, StockApiResponse, StockVerificationApiResponse, SupplierBillApiResponse, TaxApiResponse, TaxDropdownApiResponse, TermsConditionApiResponse, UomDropdownApiResponse, UploadResponse } from "../Types";
import type { PosCashRegisterApiResponse, PosCashRegisterDetailsApiResponse, PosCashRegisterDropdownApiResponse } from "../Types/PosCashRegister";
import { useFinancialYearsFilter } from "../Utils/Hooks";
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
  // useGetEmployee: (params?: Params) => useQueries<EmployeeApiResponse>([KEYS.USERS.BASE, params], () => Get(URL_KEYS.USERS.ALL, useFinancialYearsFilter(params))),
  useGetEmployee: (params?: Params) => {
    const filteredParams = useFinancialYearsFilter(params);

    return useQueries<EmployeeApiResponse>([KEYS.USERS.BASE, filteredParams], () => Get(URL_KEYS.USERS.ALL, filteredParams));
  },
  // ************ Contact ***********
  useGetContact: (params?: Params) => useQueries<ContactApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.ALL, params)),
  useGetContactDropdown: (params?: Params, enabled?: boolean) => useQueries<ContactDropdownApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.DROPDOWN, params), { enabled: enabled }),

  // ************ Branch ***********
  useGetBranch: (params?: Params, enabled?: boolean) => useQueries<BranchApiResponse>([KEYS.BRANCH.BASE, params], () => Get(URL_KEYS.BRANCH.ALL, params), { enabled: enabled }),
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
  useGetTaxDropdown: (params?: Params, enabled?: boolean) => useQueries<TaxDropdownApiResponse>([KEYS.TAX.BASE, params], () => Get(URL_KEYS.TAX.DROPDOWN, params), { enabled: enabled }),

  // ************ Roles ***********
  useGetRoles: (params?: Params) => useQueries<RolesApiResponse>([KEYS.ROLES.BASE, params], () => Get(URL_KEYS.ROLES.ALL, params)),
  useGetRolesDropdown: (params?: Params) => useQueries<RolesDropdownApiResponse>([KEYS.ROLES.BASE, params], () => Get(URL_KEYS.ROLES.DROPDOWN, params)),

  // ************ Announcement ***********
  useGetAnnouncement: () => useQueries<AnnouncementApiResponse>([KEYS.ANNOUNCEMENT.BASE], () => Get(URL_KEYS.ANNOUNCEMENT.ALL)),

  //***************product**************** */
  useGetProduct: (params?: Params) => useQueries<ProductApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.ALL, params)),
  useGetProductDropdown: (params?: Params, enabled?: boolean) => useQueries<ProductDropDownApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.DROPDOWN, params), { enabled: enabled }),
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
  useGetBillOfLiveProduct: (params?: Params) => useQueries<BillOfLiveProductApiResponse>([KEYS.BILL_OF_LIVE_PRODUCT.BASE, params], () => Get(URL_KEYS.BILL_OF_LIVE_PRODUCT.ALL, params)),

  //*************** Permission **************** */
  useGetPermissionDetails: (params?: Params, enabled?: boolean) => useQueries<PermissionDetailsApiResponse>([KEYS.PERMISSION.DETAILS, params], () => Get(URL_KEYS.PERMISSION.DETAILS, params), { enabled: enabled }),
  useGetPermissionChildDetails: (params?: Params, enabled?: boolean) => useQueries<PermissionChildApiResponse>([KEYS.PERMISSION.DETAILS, params], () => Get(URL_KEYS.PERMISSION.CHILD, params), { enabled: enabled }),

  //************ Supplier Bill ********/
  useGetSupplierBillDetails: (params?: Params) => useQueries<SupplierBillApiResponse>([KEYS.SUPPLIER_BILL.BASE, params], () => Get(URL_KEYS.SUPPLIER_BILL.ALL, params)),

  //*************** Material Consumption **************** */
  useGetMaterialConsumption: (params?: Params) => useQueries<MaterialConsumptionApiResponse>([KEYS.MATERIAL_CONSUMPTION.BASE, params], () => Get(URL_KEYS.MATERIAL_CONSUMPTION.ALL, params)),

  //*************** POS **************** */
  useGetPosHoldOrder: (params?: Params, enabled?: boolean) => useQueries<PosProductOrderApiResponse>([KEYS.POS.HOLD_ORDER, KEYS.POS.BASE, params], () => Get(URL_KEYS.POS.HOLD_ORDER, params), { enabled: enabled }),

  //*************** POS Order **************** */
  useGetPosOrder: (params?: Params, enabled?: boolean) => useQueries<PosOrderApiResponse>([KEYS.POS_ORDER.BASE, params], () => Get(URL_KEYS.POS_ORDER.ALL, params), { enabled: enabled }),
  useGetPosOrderDropdown: (params?: Params, enabled?: boolean) => useQueries<PosOrderDropdownApiResponse>([KEYS.POS_ORDER.DROPDOWN, params], () => Get(URL_KEYS.POS_ORDER.DROPDOWN, params), { enabled: enabled }),

  //*************** POS Customer Detail **************** */
  useGetPosCustomerDetail: (id?: string, enabled?: boolean) => useQueries<PosCustomerDetailApiResponse>([KEYS.POS.CUSTOMER_DETAIL, id], () => Get(`${URL_KEYS.POS.CUSTOMER_DETAIL}/${id}`), { enabled: enabled }),

  //*************** POS Payment **************** */
  useGetPosPayment: (params?: Params, enabled?: boolean) => useQueries<PosPaymentApiResponse>([KEYS.POS_PAYMENT.BASE, params], () => Get(URL_KEYS.POS_PAYMENT.ALL, params), { enabled: enabled }),

  //*************** POS Cash Register **************** */
  useGetPosCashRegister: (params?: Params, enabled?: boolean) => useQueries<PosCashRegisterApiResponse>([KEYS.POS_CASH_REGISTER.BASE, params], () => Get(URL_KEYS.POS_CASH_REGISTER.ALL, params), { enabled: enabled }),
  useGetPosCashRegisterDropdown: (params?: Params, enabled?: boolean) => useQueries<PosCashRegisterDropdownApiResponse>([KEYS.POS_CASH_REGISTER.BASE, params], () => Get(URL_KEYS.POS_CASH_REGISTER.DROPDOWN, params), { enabled: enabled }),
  useGetPosCashRegisterDetails: (params?: Params, enabled?: boolean) => useQueries<PosCashRegisterDetailsApiResponse>([KEYS.POS_CASH_REGISTER.DETAILS, params], () => Get(URL_KEYS.POS_CASH_REGISTER.DETAILS, params), { enabled: enabled }),

  //*************** Additional Chargers **************** */
  useGetAdditionalCharges: (params?: Params) => useQueries<AdditionalChargesApiResponse>([KEYS.ADDITIONAL_CHARGES.BASE, params], () => Get(URL_KEYS.ADDITIONAL_CHARGES.ALL, params)),
  useGetAdditionalChargeDropdown: (params?: Params, enabled?: boolean) => useQueries<AdditionalChargesDropdownApiResponse>([KEYS.ADDITIONAL_CHARGES.BASE, params], () => Get(URL_KEYS.ADDITIONAL_CHARGES.DROPDOWN, params), { enabled: enabled }),

  //*************** Account **************** */
  useGetAccount: (params?: Params) => useQueries<AccountApiResponse>([KEYS.ACCOUNT.BASE, params], () => Get(URL_KEYS.ACCOUNT.ALL, params)),
  useGetAccountDropdown: (params?: Params, enabled?: boolean) => useQueries<AccountDropdownApiResponse>([KEYS.ACCOUNT.BASE, params], () => Get(URL_KEYS.ACCOUNT.DROPDOWN, params), { enabled: enabled }),

  // ************ Account Group ***********
  useGetAccountGroupDropdown: (params?: Params, enabled?: boolean) => useQueries<AccountGroupDropdownApiResponse>([KEYS.ACCOUNT_GROUP.BASE, params], () => Get(URL_KEYS.ACCOUNT_GROUP.DROPDOWN, params), { enabled: enabled }),

  //*************** Terms and Conditions **************** */
  useGetTermsCondition: (params?: Params, enabled?: boolean) => useQueries<TermsConditionApiResponse>([KEYS.TERMS_CONDITION.BASE, params], () => Get(URL_KEYS.TERMS_CONDITION.ALL, params), { enabled: enabled }),

  //*************** Purchase Order *********
  useGetPurchaseOrder: (params?: Params) => useQueries<PurchaseOrderApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], () => Get(URL_KEYS.PURCHASE_ORDER.ALL, params)),
  useGetPurchaseOrderDropdown: (params?: Params) => useQueries<PurchaseOrderDropdownApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], () => Get(URL_KEYS.PURCHASE_ORDER.DROPDOWN, params)),

  //*************** Coupon *********
  useGetCoupon: (params?: Params) => useQueries<CouponApiResponse>([KEYS.COUPON.BASE, params], () => Get(URL_KEYS.COUPON.ALL, params)),
  useGetCouponDropdown: (params?: Params, enabled?: boolean) => useQueries<CouponDropdownApiResponse>([KEYS.COUPON.BASE, params], () => Get(URL_KEYS.COUPON.DROPDOWN, params), { enabled: enabled }),

  //*************** Loyalty *********
  useGetLoyalty: (params?: Params) => useQueries<LoyaltyApiResponse>([KEYS.LOYALTY.BASE, params], () => Get(URL_KEYS.LOYALTY.ALL, params)),
  useGetLoyaltyDropdown: (params?: Params, enabled?: boolean) => useQueries<LoyaltyDropdownApiResponse>([KEYS.LOYALTY.BASE, params], () => Get(URL_KEYS.LOYALTY.DROPDOWN, params), { enabled: enabled }),
  useGetLoyaltyPoints: (params?: Params, enabled?: boolean) => useQueries<LoyaltyPointsApiResponse>([KEYS.LOYALTY.BASE, params], () => Get(URL_KEYS.LOYALTY.POINTS, params), { enabled: enabled }),

  //*************** Cash Control *********
  useGetCashControl: (params?: Params, enabled?: boolean) => useQueries<CashControlApiResponse>([KEYS.CASH_CONTROL.BASE, params], () => Get(URL_KEYS.CASH_CONTROL.ALL, params), { enabled: enabled }),
};
