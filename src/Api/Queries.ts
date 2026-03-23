import { KEYS, URL_KEYS } from "../Constants";
import type { AdditionalChargesApiResponse, AdditionalChargesDropdownApiResponse, AdminSettingApiResponse, AnnouncementApiResponse, AppQueryOptions, BankApiResponse, BankDropdownApiResponse, BankTransactionApiResponse, BankTransactionDropdownApiResponse, BestSellingProductsApiResponse, BillOfLiveProductApiResponse, BranchApiResponse, BranchDropdownApiResponse, BrandApiResponse, BrandDropdownApiResponse, CashControlApiResponse, CategoryApiResponse, CategoryDropdownApiResponse, CategorySalesApiResponse, CategoryWiseCustomersCountApiResponse, CompanyApiResponse, ConsumptionTypeApiResponse, ConsumptionTypeDropdownApiResponse, ContactApiResponse, ContactDropdownApiResponse, CountryApiResponse, CouponApiResponse, CouponDropdownApiResponse, CreditNoteApiResponse, DebitNoteApiResponse, DeliveryChallanApiResponse, DeliveryChallanDropdownApiResponse, DiscountApiResponse, DiscountDropdownApiResponse, EmployeeApiResponse, EstimateApiResponse, EstimateDropdownApiResponse, ExpenseApiResponse, InvoiceApiResponse, InvoiceDropdownApiResponse, LeastSellingProductsApiResponse, LoginLogApiResponse, LoyaltyApiResponse, LoyaltyDropdownApiResponse, LoyaltyPointsApiResponse, MaterialConsumptionApiResponse, Params, PayableApiResponse, PaymentTermsApiResponse, PaymentTermsDropdownApiResponse, PermissionChildApiResponse, PermissionDetailsApiResponse, PosCashRegisterApiResponse, PosCashRegisterDetailsApiResponse, PosCashRegisterDropdownApiResponse, PosCreditNoteApiResponse, PosCreditNoteRedeemDropdownApiResponse, PosCustomerDetailApiResponse, PosOrderApiResponse, PosOrderByIdResponse, PosOrderDropdownApiResponse, PosPaymentApiResponse, PosProductOrderApiResponse, PrefixApiResponse, PrefixDropdownApiResponse, ProductApiResponse, ProductDropDownApiResponse, ProductSingleApiResponse, PurchaseDebitNoteApiResponse, PurchaseDebitNoteDropdownApiResponse, PurchaseOrderApiResponse, PurchaseOrderDropdownApiResponse, ReceivableApiResponse, RecipeApiResponse, RecipeDropdownApiResponse, ReturnPosOrderApiResponse, ReturnPosOrderByIdResponse, RolesApiResponse, RolesDropdownApiResponse, SalaryApiResponse, SalesAndPurchaseApiResponse, SalesCreditNoteApiResponse, SalesCreditNoteDropdownApiResponse, SalesOrderApiResponse, SalesOrderDropdownApiResponse, SingleDeliveryChallanApiResponse, SingleEmployeeApiResponse, SingleInvoiceApiResponse, SinglePurchaseDebitNoteApiResponse, SingleSalesCreditNoteApiResponse, StockApiResponse, StockVerificationApiResponse, SupplierBillApiResponse, TaxApiResponse, TaxDropdownApiResponse, TermsConditionApiResponse, TopCouponsApiResponse, TopCustomersApiResponse, TopExpensesApiResponse, TransactionGraphApiResponse, TransactionsApiResponse, UomDropdownApiResponse, UploadResponse } from "../Types";
import { useFinancialYearsFilter } from "../Utils/Hooks";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";

const useBaseQuery = <T>(key: unknown[], url: string, params?: Params, enabled: boolean = true) => {
  const finalParams = useFinancialYearsFilter(params);
  return useQueries<T>(key, () => Get(url, finalParams), { enabled });
};

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
  useGetEmployee: (params?: Params) => useBaseQuery<EmployeeApiResponse>([KEYS.USERS.BASE, params], URL_KEYS.USERS.ALL, params),

  // ************ Contact ***********
  useGetContact: (params?: Params, enabled?: boolean) => useBaseQuery<ContactApiResponse>([KEYS.CONTACT.BASE, params], URL_KEYS.CONTACT.ALL, params, enabled),
  useGetContactDropdown: (params?: Params, enabled?: boolean) => useQueries<ContactDropdownApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.DROPDOWN, params), { enabled: enabled }),

  // ************ Branch ***********
  useGetBranch: (params?: Params, enabled?: boolean) => useBaseQuery<BranchApiResponse>([KEYS.BRANCH.BASE, params], URL_KEYS.BRANCH.ALL, params, enabled),
  useGetBranchDropdown: (params?: Params) => useQueries<BranchDropdownApiResponse>([KEYS.BRANCH.BASE, params], () => Get(URL_KEYS.BRANCH.DROPDOWN, params)),

  // ************ Brand ***********
  useGetBrand: (params?: Params) => useBaseQuery<BrandApiResponse>([KEYS.BRAND.BASE, params], URL_KEYS.BRAND.ALL, params),
  useGetBrandDropdown: (params?: Params, enabled?: boolean) => useQueries<BrandDropdownApiResponse>([KEYS.BRAND.BASE, params], () => Get(URL_KEYS.BRAND.DROPDOWN, params), { enabled: enabled }),

  // ************ Category ***********
  useGetCategory: (params?: Params) => useBaseQuery<CategoryApiResponse>([KEYS.CATEGORY.BASE, params], URL_KEYS.CATEGORY.ALL, params),
  useGetCategoryDropdown: (params?: Params, enabled?: boolean) => useQueries<CategoryDropdownApiResponse>([KEYS.CATEGORY.BASE, params], () => Get(URL_KEYS.CATEGORY.DROPDOWN, params), { enabled: enabled }),

  // ************ Uom ***********
  useGetUomDropdown: (params?: Params) => useQueries<UomDropdownApiResponse>([KEYS.UOM.BASE, params], () => Get(URL_KEYS.UOM.DROPDOWN, params)),

  // ************ Tax ***********
  useGetTax: (params?: Params) => useBaseQuery<TaxApiResponse>([KEYS.TAX.BASE, params], URL_KEYS.TAX.ALL, params),
  useGetTaxDropdown: (params?: Params, enabled?: boolean) => useQueries<TaxDropdownApiResponse>([KEYS.TAX.BASE, params], () => Get(URL_KEYS.TAX.DROPDOWN, params), { enabled: enabled }),

  // ************ Roles ***********
  useGetRoles: (params?: Params) => useBaseQuery<RolesApiResponse>([KEYS.ROLES.BASE, params], URL_KEYS.ROLES.ALL, params),
  useGetRolesDropdown: (params?: Params) => useQueries<RolesDropdownApiResponse>([KEYS.ROLES.BASE, params], () => Get(URL_KEYS.ROLES.DROPDOWN, params)),

  // ************ Announcement ***********
  useGetAnnouncement: () => useBaseQuery<AnnouncementApiResponse>([KEYS.ANNOUNCEMENT.BASE], URL_KEYS.ANNOUNCEMENT.ALL),

  //***************product**************** */
  useGetProduct: (params?: Params, enabled?: boolean) => useBaseQuery<ProductApiResponse>([KEYS.PRODUCT.BASE, params], URL_KEYS.PRODUCT.ALL, params, enabled),
  useGetProductDropdown: (params?: Params, enabled?: boolean) => useQueries<ProductDropDownApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.DROPDOWN, params), { enabled: enabled }),
  useGetProductById: (id?: string) => useQueries<ProductSingleApiResponse>([KEYS.PRODUCT.BASE, id], () => Get(`${URL_KEYS.PRODUCT.BASE}/${id}`), { enabled: !!id, staleTime: 0, refetchOnWindowFocus: true, retry: 1 }),

  //************ bank ********/
  useGetBank: (params?: Params, enabled?: boolean) => useBaseQuery<BankApiResponse>([KEYS.BANK.BASE, params], URL_KEYS.BANK.ALL, params, enabled),
  useGetBankDropdown: (params?: Params, enabled?: boolean) => useQueries<BankDropdownApiResponse>([KEYS.BANK.BASE, params], () => Get(URL_KEYS.BANK.DROPDOWN, params), { enabled: enabled }),

  // ************ Expense *********** */
  useGetExpense: (params?: Params, enabled?: boolean) => useQueries<ExpenseApiResponse>([KEYS.EXPENSE.BASE, params], () => Get(URL_KEYS.EXPENSE.ALL, params), { enabled: enabled }),

  //*************** Salary *************** */
  useGetSalary: (params?: Params, enabled?: boolean) => useQueries<SalaryApiResponse>([KEYS.SALARY.BASE, params], () => Get(URL_KEYS.SALARY.ALL, params), { enabled: enabled }),

  //***************bank transaction**************** */
  useGetBankTransaction: (params?: Params, enabled?: boolean) => useQueries<BankTransactionApiResponse>([KEYS.BANK_TRANSACTION.BASE, params], () => Get(URL_KEYS.BANK_TRANSACTION.ALL, params), { enabled: enabled }),
  useGetBankTransactionDropdown: (params?: Params, enabled?: boolean) => useQueries<BankTransactionDropdownApiResponse>([KEYS.BANK_TRANSACTION.BASE, params], () => Get(URL_KEYS.BANK_TRANSACTION.DROPDOWN, params), { enabled: enabled }),

  //************ recipe ********/
  useGetRecipe: (params?: Params, enabled?: boolean) => useBaseQuery<RecipeApiResponse>([KEYS.RECIPE.BASE, params], URL_KEYS.RECIPE.ALL, params, enabled),
  useGetRecipeDropdown: (params?: Params, enabled?: boolean) => useQueries<RecipeDropdownApiResponse>([KEYS.RECIPE.BASE, params], () => Get(URL_KEYS.RECIPE.DROPDOWN, params), { enabled: enabled }),

  //*************** stock **************** */
  useGetStock: (params?: Params, enabled?: boolean) => useBaseQuery<StockApiResponse>([KEYS.STOCK.BASE, params], URL_KEYS.STOCK.ALL, params, enabled),

  //*************** stock verification **************** */
  useGetStockVerification: (params?: Params, enabled?: boolean) => useBaseQuery<StockVerificationApiResponse>([KEYS.STOCK_VERIFICATION.BASE, params], URL_KEYS.STOCK_VERIFICATION.ALL, params, enabled),

  //*************** Location **************** */
  useGetCountryLocation: () => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE], () => Get(URL_KEYS.LOCATION.COUNTRY)),
  useGetStateLocation: (id?: string) => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE, id], () => Get(`${URL_KEYS.LOCATION.STATE}/${id}`), { enabled: !!id }),
  useGetCityLocation: (id?: string) => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE, id], () => Get(`${URL_KEYS.LOCATION.CITY}/${id}`), { enabled: !!id }),

  //************ bill of materials ********/
  useGetBillOfLiveProduct: (params?: Params, enabled?: boolean) => useBaseQuery<BillOfLiveProductApiResponse>([KEYS.BILL_OF_LIVE_PRODUCT.BASE, params], URL_KEYS.BILL_OF_LIVE_PRODUCT.ALL, params, enabled),

  //*************** Permission **************** */
  useGetPermissionDetails: (params?: Params, enabled?: boolean) => useQueries<PermissionDetailsApiResponse>([KEYS.PERMISSION.DETAILS, params], () => Get(URL_KEYS.PERMISSION.DETAILS, params), { enabled: enabled }),
  useGetPermissionChildDetails: (params?: Params, enabled?: boolean) => useQueries<PermissionChildApiResponse>([KEYS.PERMISSION.DETAILS, params], () => Get(URL_KEYS.PERMISSION.CHILD, params), { enabled: enabled }),

  //************ Supplier Bill ********/
  useGetSupplierBillDetails: (params?: Params, enabled?: boolean) => useBaseQuery<SupplierBillApiResponse>([KEYS.SUPPLIER_BILL.BASE, params], URL_KEYS.SUPPLIER_BILL.ALL, params, enabled),

  //*************** Material Consumption **************** */
  useGetMaterialConsumption: (params?: Params, enabled?: boolean) => useBaseQuery<MaterialConsumptionApiResponse>([KEYS.MATERIAL_CONSUMPTION.BASE, params], URL_KEYS.MATERIAL_CONSUMPTION.ALL, params, enabled),

  //*************** POS **************** */
  useGetPosHoldOrder: (params?: Params, enabled?: boolean) => useQueries<PosProductOrderApiResponse>([KEYS.POS.HOLD_ORDER, KEYS.POS.BASE, params], () => Get(URL_KEYS.POS.HOLD_ORDER, params), { enabled: enabled }),

  //*************** POS Order **************** */
  useGetPosOrder: (params?: Params, enabled?: boolean) => useBaseQuery<PosOrderApiResponse>([KEYS.POS_ORDER.BASE, params], URL_KEYS.POS_ORDER.ALL, params, enabled),
  useGetPosOrderById: (id?: string, enabled?: boolean) => useQueries<PosOrderByIdResponse>([KEYS.POS_ORDER.BY_ID, id], () => Get(`${URL_KEYS.POS_ORDER.BASE}/${id}`), { enabled: enabled, staleTime: 0, refetchOnWindowFocus: false, retry: 1 }),
  useGetLastPosOrder: (params?: Params, enabled?: boolean) => useQueries<PosOrderApiResponse>([KEYS.POS_ORDER.BASE, params], () => Get(URL_KEYS.POS_ORDER.ALL, params), { enabled: enabled }),
  useGetPosOrderDropdown: (params?: Params, enabled?: boolean) => useQueries<PosOrderDropdownApiResponse>([KEYS.POS_ORDER.DROPDOWN, KEYS.POS_ORDER.BASE, params], () => Get(URL_KEYS.POS_ORDER.DROPDOWN, params), { enabled: enabled }),

  //*************** POS Customer Detail **************** */
  useGetPosCustomerDetail: (id?: string, enabled?: boolean) => useQueries<PosCustomerDetailApiResponse>([KEYS.POS.CUSTOMER_DETAIL, id], () => Get(`${URL_KEYS.POS.CUSTOMER_DETAIL}/${id}`), { enabled: enabled }),

  //*************** POS Payment **************** */
  useGetPosPayment: (params?: Params, enabled?: boolean) => useBaseQuery<PosPaymentApiResponse>([KEYS.POS_PAYMENT.BASE, params], URL_KEYS.POS_PAYMENT.ALL, params, enabled),

  //*************** POS Cash Register **************** */
  useGetPosCashRegister: (params?: Params, enabled?: boolean) => useBaseQuery<PosCashRegisterApiResponse>([KEYS.POS_CASH_REGISTER.BASE, params], URL_KEYS.POS_CASH_REGISTER.ALL, params, enabled),
  useGetPosCashRegisterDropdown: (params?: Params, enabled?: boolean) => useQueries<PosCashRegisterDropdownApiResponse>([KEYS.POS_CASH_REGISTER.BASE, params], () => Get(URL_KEYS.POS_CASH_REGISTER.DROPDOWN, params), { enabled: enabled }),
  useGetPosCashRegisterDetails: (params?: Params) => useQueries<PosCashRegisterDetailsApiResponse>([KEYS.POS_CASH_REGISTER.DETAILS, params], () => Get(URL_KEYS.POS_CASH_REGISTER.DETAILS, params)),

  //*************** Additional Chargers **************** */
  useGetAdditionalCharges: (params?: Params) => useBaseQuery<AdditionalChargesApiResponse>([KEYS.ADDITIONAL_CHARGES.BASE, params], URL_KEYS.ADDITIONAL_CHARGES.ALL, params),
  useGetAdditionalChargesDropdown: (params?: Params, enabled?: boolean) => useQueries<AdditionalChargesDropdownApiResponse>([KEYS.ADDITIONAL_CHARGES.BASE, params], () => Get(URL_KEYS.ADDITIONAL_CHARGES.DROPDOWN, params), { enabled: enabled }),

  //*************** Terms and Conditions **************** */
  useGetTermsCondition: (params?: Params, enabled?: boolean) => useBaseQuery<TermsConditionApiResponse>([KEYS.TERMS_CONDITION.BASE, params], URL_KEYS.TERMS_CONDITION.ALL, params, enabled),

  //*************** Purchase Order *********
  useGetPurchaseOrder: (params?: Params, enabled?: boolean) => useBaseQuery<PurchaseOrderApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], URL_KEYS.PURCHASE_ORDER.ALL, params, enabled),
  useGetPurchaseOrderDropdown: (params?: Params) => useQueries<PurchaseOrderDropdownApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], () => Get(URL_KEYS.PURCHASE_ORDER.DROPDOWN, params)),

  //*************** Coupon *********
  useGetCoupon: (params?: Params) => useBaseQuery<CouponApiResponse>([KEYS.COUPON.BASE, params], URL_KEYS.COUPON.ALL, params),
  useGetCouponDropdown: (params?: Params, enabled?: boolean) => useQueries<CouponDropdownApiResponse>([KEYS.COUPON.BASE, params], () => Get(URL_KEYS.COUPON.DROPDOWN, params), { enabled: enabled }),

  //*************** Discount *********
  useGetDiscount: (params?: Params) => useBaseQuery<DiscountApiResponse>([KEYS.DISCOUNT.BASE, params], URL_KEYS.DISCOUNT.ALL, params),
  useGetDiscountDropdown: (params?: Params, enabled?: boolean) => useQueries<DiscountDropdownApiResponse>([KEYS.DISCOUNT.BASE, params], () => Get(URL_KEYS.DISCOUNT.DROPDOWN, params), { enabled: enabled }),

  //*************** Loyalty *********
  useGetLoyalty: (params?: Params) => useBaseQuery<LoyaltyApiResponse>([KEYS.LOYALTY.BASE, params], URL_KEYS.LOYALTY.ALL, params),
  useGetLoyaltyDropdown: (params?: Params, enabled?: boolean) => useQueries<LoyaltyDropdownApiResponse>([KEYS.LOYALTY.BASE, params], () => Get(URL_KEYS.LOYALTY.DROPDOWN, params), { enabled: enabled }),
  useGetLoyaltyPoints: (params?: Params, enabled?: boolean) => useQueries<LoyaltyPointsApiResponse>([KEYS.LOYALTY.BASE, params], () => Get(URL_KEYS.LOYALTY.POINTS, params), { enabled: enabled }),

  //*************** Cash Control *********
  useGetCashControl: (params?: Params, enabled?: boolean) => useBaseQuery<CashControlApiResponse>([KEYS.CASH_CONTROL.BASE, params], URL_KEYS.CASH_CONTROL.ALL, params, enabled),

  //*************** Admin Setting *********
  useGetAdminSetting: (params?: Params) => useQueries<AdminSettingApiResponse>([KEYS.ADMIN_SETTING.ALL, params], () => Get(URL_KEYS.ADMIN_SETTING.ALL, params)),

  //*************** Pos Credit Note *********
  useGetPosCreditNote: (params?: Params, enabled?: boolean) => useBaseQuery<PosCreditNoteApiResponse>([KEYS.POS_CREDIT_NOTE.BASE, params], URL_KEYS.POS_CREDIT_NOTE.ALL, params, enabled),
  useGetPosCreditNoteRedeemDropdown: (params?: Params, enabled?: boolean) => useQueries<PosCreditNoteRedeemDropdownApiResponse>([KEYS.POS_CREDIT_NOTE.DROPDOWN, KEYS.POS_CREDIT_NOTE.BASE, params], () => Get(URL_KEYS.POS_CREDIT_NOTE.REDEEM_DROPDOWN, params), { enabled: enabled }),

  //*************** Credit Note *********
  useGetCreditNote: (params?: Params, enabled?: boolean) => useBaseQuery<CreditNoteApiResponse>([KEYS.CREDIT_NOTE.BASE, params], URL_KEYS.CREDIT_NOTE.ALL, params, enabled),

  //*************** Debit Note *********
  useGetDebitNote: (params?: Params, enabled?: boolean) => useBaseQuery<DebitNoteApiResponse>([KEYS.DEBIT_NOTE.BASE, params], URL_KEYS.DEBIT_NOTE.ALL, params, enabled),

  //*************** Return POS Order *********
  useGetReturnPosOrder: (params?: Params, enabled?: boolean) => useBaseQuery<ReturnPosOrderApiResponse>([KEYS.RETURN_POS_ORDER.BASE, params], URL_KEYS.RETURN_POS_ORDER.ALL, params, enabled),
  useGetReturnPosOrderById: (id?: string, enabled?: boolean) => useQueries<ReturnPosOrderByIdResponse>([KEYS.RETURN_POS_ORDER.BASE, id], () => Get(`${URL_KEYS.RETURN_POS_ORDER.BASE}/${id}`), { enabled: enabled, staleTime: 0, refetchOnWindowFocus: false, retry: 1 }),

  //*************** Dashboard *********
  useGetDashboardSalesAndPurchaseGraph: (params?: Params) => useQueries<SalesAndPurchaseApiResponse>([KEYS.DASHBOARD.SALES_AND_PURCHASE_GRAPH, params], () => Get(URL_KEYS.DASHBOARD.SALES_AND_PURCHASE_GRAPH, params)),
  useGetDashboardTransactionGraph: (params?: Params) => useQueries<TransactionGraphApiResponse>([KEYS.DASHBOARD.TRANSACTION_GRAPH, params], () => Get(URL_KEYS.DASHBOARD.TRANSACTION_GRAPH, params)),
  useGetDashboardBestSellingProducts: (params?: Params) => useQueries<BestSellingProductsApiResponse>([KEYS.DASHBOARD.BEST_SELLING_PRODUCTS, params], () => Get(URL_KEYS.DASHBOARD.BEST_SELLING_PRODUCTS, params)),
  useGetDashboardLeastSellingProducts: (params?: Params) => useQueries<LeastSellingProductsApiResponse>([KEYS.DASHBOARD.LEAST_SELLING_PRODUCTS, params], () => Get(URL_KEYS.DASHBOARD.LEAST_SELLING_PRODUCTS, params)),
  useGetDashboardTopExpenses: (params?: Params) => useQueries<TopExpensesApiResponse>([KEYS.DASHBOARD.TOP_EXPENSES, params], () => Get(URL_KEYS.DASHBOARD.TOP_EXPENSES, params)),
  useGetDashboardTopCoupons: (params?: Params) => useQueries<TopCouponsApiResponse>([KEYS.DASHBOARD.TOP_COUPONS, params], () => Get(URL_KEYS.DASHBOARD.TOP_COUPONS, params)),
  useGetDashboardReceivable: (params?: Params) => useQueries<ReceivableApiResponse>([KEYS.DASHBOARD.RECEIVABLE, params], () => Get(URL_KEYS.DASHBOARD.RECEIVABLE, params)),
  useGetDashboardPayable: (params?: Params) => useQueries<PayableApiResponse>([KEYS.DASHBOARD.PAYABLE, params], () => Get(URL_KEYS.DASHBOARD.PAYABLE, params)),
  useGetDashboardTopCustomers: (params?: Params) => useQueries<TopCustomersApiResponse>([KEYS.DASHBOARD.TOP_CUSTOMERS, params], () => Get(URL_KEYS.DASHBOARD.TOP_CUSTOMERS, params)),
  useGetDashboardCategoryWiseCustomersCount: (params?: Params) => useQueries<CategoryWiseCustomersCountApiResponse>([KEYS.DASHBOARD.CATEGORY_WISE_CUSTOMERS_COUNT, params], () => Get(URL_KEYS.DASHBOARD.CATEGORY_WISE_CUSTOMERS_COUNT, params)),
  useGetDashboardCategorySales: (params?: Params) => useQueries<CategorySalesApiResponse>([KEYS.DASHBOARD.CATEGORY_SALES, params], () => Get(URL_KEYS.DASHBOARD.CATEGORY_SALES, params)),
  useGetDashboardLoginLog: (params?: Params) => useQueries<LoginLogApiResponse>([KEYS.DASHBOARD.LOGIN_LOG, params], () => Get(URL_KEYS.DASHBOARD.LOGIN_LOG, params)),
  useGetDashboardTransaction: (params?: Params) => useQueries<TransactionsApiResponse>([KEYS.DASHBOARD.TRANSACTION, params], () => Get(URL_KEYS.DASHBOARD.TRANSACTION, params)),

  
  //*************** Purchase Debit Note **************** */
  useGetPurchaseDebitNote: (params?: Params, enabled?: boolean) => useQueries<PurchaseDebitNoteApiResponse>([KEYS.PURCHASE_DEBIT_NOTE.BASE, params], () => Get(URL_KEYS.PURCHASE_DEBIT_NOTE.ALL, params), { enabled: enabled }),
  useGetSinglePurchaseDebitNote: (id?: string) => useQueries<SinglePurchaseDebitNoteApiResponse>([KEYS.PURCHASE_DEBIT_NOTE.BASE, id], () => Get(`${URL_KEYS.PURCHASE_DEBIT_NOTE.BASE}/${id}`), { enabled: !!id }),
  useGetPurchaseDebitNoteDropdown: (params?: Params, enabled?: boolean) => useQueries<PurchaseDebitNoteDropdownApiResponse>([KEYS.PURCHASE_DEBIT_NOTE.DROPDOWN, params], () => Get(URL_KEYS.PURCHASE_DEBIT_NOTE.DROPDOWN, params), { enabled: enabled }),


    //*************** Estimate **************** */
  useGetEstimate: (params?: Params, enabled?: boolean) => useQueries<EstimateApiResponse>([KEYS.ESTIMATE.BASE, params], () => Get(URL_KEYS.ESTIMATE.ALL, params), { enabled: enabled }),
  useGetEstimateDropdown: (params?: Params, enabled?: boolean) => useQueries<EstimateDropdownApiResponse>([KEYS.ESTIMATE.BASE, params], () => Get(URL_KEYS.ESTIMATE.DROPDOWN, params), { enabled: enabled }),

  //*************** Sales Order **************** */
  useGetSalesOrder: (params?: Params, enabled?: boolean) => useQueries<SalesOrderApiResponse>([KEYS.SALES_ORDER.BASE, params], () => Get(URL_KEYS.SALES_ORDER.ALL, params), { enabled: enabled }),
  useGetSalesOrderDropdown: (params?: Params, enabled?: boolean) => useQueries<SalesOrderDropdownApiResponse>([KEYS.SALES_ORDER.BASE, params], () => Get(URL_KEYS.SALES_ORDER.DROPDOWN, params), { enabled: enabled }),

  //*************** Invoice **************** */
  useGetInvoice: (params?: Params, enabled?: boolean) => useQueries<InvoiceApiResponse>([KEYS.INVOICE.BASE, params], () => Get(URL_KEYS.INVOICE.ALL, params), { enabled: enabled }),
  useGetSingleInvoice: (id?: string) => useQueries<SingleInvoiceApiResponse>([KEYS.INVOICE.BASE, id], () => Get(`${URL_KEYS.INVOICE.BASE}/${id}`), { enabled: !!id }),
  useGetInvoiceDropdown: (params?: Params, enabled?: boolean) => useQueries<InvoiceDropdownApiResponse>([KEYS.INVOICE.DROPDOWN, params], () => Get(URL_KEYS.INVOICE.DROPDOWN, params), { enabled: enabled }),
  
  //*************** Delivery Challan **************** */
  useGetDeliveryChallan: (params?: Params, enabled?: boolean) => useQueries<DeliveryChallanApiResponse>([KEYS.DELIVERY_CHALLAN.BASE, params], () => Get(URL_KEYS.DELIVERY_CHALLAN.ALL, params), { enabled: enabled }),
  useGetSingleDeliveryChallan: (id?: string) => useQueries<SingleDeliveryChallanApiResponse>([KEYS.DELIVERY_CHALLAN.BASE, id], () => Get(`${URL_KEYS.DELIVERY_CHALLAN.BASE}/${id}`), { enabled: !!id }),
  useGetDeliveryChallanDropdown: (params?: Params, enabled?: boolean) => useQueries<DeliveryChallanDropdownApiResponse>([KEYS.DELIVERY_CHALLAN.DROPDOWN, params], () => Get(URL_KEYS.DELIVERY_CHALLAN.DROPDOWN, params), { enabled: enabled }),
 
  //*************** Sales Credit Note **************** */
  useGetSalesCreditNote: (params?: Params, enabled?: boolean) => useQueries<SalesCreditNoteApiResponse>([KEYS.SALES_CREDIT_NOTE.BASE, params], () => Get(URL_KEYS.SALES_CREDIT_NOTE.ALL, params), { enabled: enabled }),
  useGetSingleSalesCreditNote: (id?: string) => useQueries<SingleSalesCreditNoteApiResponse>([KEYS.SALES_CREDIT_NOTE.BASE, id], () => Get(`${URL_KEYS.SALES_CREDIT_NOTE.BASE}/${id}`), { enabled: !!id }),
  useGetSalesCreditNoteDropdown: (params?: Params, enabled?: boolean) => useQueries<SalesCreditNoteDropdownApiResponse>([KEYS.SALES_CREDIT_NOTE.DROPDOWN, params], () => Get(URL_KEYS.SALES_CREDIT_NOTE.DROPDOWN, params), { enabled: enabled }),

  //*************** Prefix **************** */
  useGetPrefix: (params?: Params, enabled?: boolean) => useQueries<PrefixApiResponse>([KEYS.PREFIX.BASE, params], () => Get(URL_KEYS.PREFIX.ALL, params), { enabled: enabled }),
  useGetPrefixDropdown: (params?: Params, enabled?: boolean) => useQueries<PrefixDropdownApiResponse>([KEYS.PREFIX.BASE, params], () => Get(URL_KEYS.PREFIX.DROPDOWN, params), { enabled: enabled }),

  //*************** Payment Terms **************** */
  useGetPaymentTerms: (params?: Params, enabled?: boolean) => useQueries<PaymentTermsApiResponse>([KEYS.PAYMENT_TERMS.BASE, params], () => Get(URL_KEYS.PAYMENT_TERMS.ALL, params), { enabled: enabled }),
  useGetPaymentTermsDropdown: (params?: Params, enabled?: boolean) => useQueries<PaymentTermsDropdownApiResponse>([KEYS.PAYMENT_TERMS.BASE, params], () => Get(URL_KEYS.PAYMENT_TERMS.DROPDOWN, params), { enabled: enabled }),

  //*************** Consumption Type **************** */
  useGetConsumptionType: (params?: Params, enabled?: boolean) => useQueries<ConsumptionTypeApiResponse>([KEYS.CONSUMPTION_TYPE.BASE, params], () => Get(URL_KEYS.CONSUMPTION_TYPE.ALL, params), { enabled: enabled }),
  useGetConsumptionTypeDropdown: (params?: Params, enabled?: boolean) => useQueries<ConsumptionTypeDropdownApiResponse>([KEYS.CONSUMPTION_TYPE.BASE, params], () => Get(URL_KEYS.CONSUMPTION_TYPE.DROPDOWN, params), { enabled: enabled }),
};

