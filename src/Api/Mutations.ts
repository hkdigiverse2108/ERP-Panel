import { KEYS, URL_KEYS } from "../Constants";
import type { AddAdditionalChargesPayload, AddBankPayload, AddBankTransactionPayload, AddBillOfLiveProductPayload, AddCashControlPayload, AddConsumptionTypePayload, AddContactPayload, AddCouponPayload, AddCreditNotePayload, AddDebitNotePayload, AddDeliveryChallanPayload, AddDiscountPayload, AddEmployeePayload, AddEstimatePayload, AddExpensePayload, AddInvoicePayload, AddLoyaltyPayload, AddMaterialConsumptionPayload, AddPaymentTermsPayload, AddPosCashRegisterPayload, AddPosCreditNotePayload, AddPosPaymentPayload, AddPosProductOrderPayload, AddPrefixPayload, AddProductPayload, AddPurchaseDebitNotePayload, AddPurchaseOrderPayload, AddRecipePayload, AddReturnPosOrderPayload, AddRolesPayload, AddSalaryPayload, AddSalesCreditNotePayload, AddSalesOrderPayload, AddStockBulkAdjustmentPayload, AddStockPayload, AddStockTransferPayload, AddStockVerificationPayload, AddSupplierBillPayload, AddTaxPayload, AddTermsConditionPayload, ApproveStockTransferPayload, BulkAddProductResponse, CallRequestFormValues, ChangePasswordPayload, CompanyApiResponse, ConfirmReceiptStockTransferPayload, DispatchStockTransferPayload, EditAdditionalChargesPayload, EditBankPayload, EditBankTransactionPayload, EditBillOfLiveProductPayload, EditBranchReportConfigPayload, EditCompanyPayload, EditConsumptionTypePayload, EditContactPayload, EditCouponPayload, EditCreditNotePayload, EditDebitNotePayload, EditDeliveryChallanPayload, EditDiscountPayload, EditEmployeePayload, EditEstimatePayload, EditExpensePayload, EditInvoicePayload, EditLoyaltyPayload, EditLoyaltyPointPayload, EditMaterialConsumptionPayload, EditPaymentTermsPayload, EditPermissionPayload, EditPosCashRegisterPayload, EditPosCreditNotePayload, EditPosPaymentPayload, EditPosProductOrderPayload, EditPrefixPayload, EditProductPayload, EditPurchaseDebitNotePayload, EditPurchaseOrderPayload, EditRecipePayload, EditReturnPosOrderPayload, EditRolesPayload, EditSalaryPayload, EditSalesCreditNotePayload, EditSalesOrderPayload, EditStockTransferPayload, EditStockVerificationPayload, EditSupplierBillPayload, EditTaxPayload, EditTermsConditionPayload, EmployeeApiResponse, ForgotPasswordPayload, LoginPayload, LoginResponse, PosCreditNoteRedeemFormValues, PosCreditNoteRedeemResponse, PosCreditNoteRefundFormValues, PosCreditNoteRefundResponse, PosProductOrderDataResponse, ProductDetectApiResponse, RedeemLoyaltyApiResponse, RedeemLoyaltyPayload, RejectStockTransferPayload, ResendOtpPayload, ReturnPosOrderResponse, UpdatePasswordPayload, UploadResponse, VerifyCouponApiResponse, VerifyCouponPayload, VerifyDiscountPayload, VerifyOtpPayload } from "../Types";
import { Delete, Post, Put } from "./Methods";
import { useMutations } from "./ReactQuery";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),
  useChangePassword: () => useMutations<ChangePasswordPayload, void>([KEYS.AUTH.CHANGE_PASSWORD], (input) => Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input)),
  useForgotPassword: () => useMutations<ForgotPasswordPayload, void>([KEYS.AUTH.FORGOT_PASSWORD], (input) => Post(URL_KEYS.AUTH.FORGOT_PASSWORD, input, false)),
  useVerifyOtp: () => useMutations<VerifyOtpPayload, LoginResponse>([KEYS.AUTH.VERIFY_OTP], (input) => Post(URL_KEYS.AUTH.VERIFY_OTP, input, false)),
  useResendOtp: () => useMutations<ResendOtpPayload, void>([KEYS.AUTH.RESEND_OTP], (input) => Post(URL_KEYS.AUTH.RESEND_OTP, input, false)),
  useUpdatePassword: () => useMutations<UpdatePasswordPayload, void>([KEYS.AUTH.UPDATE_PASSWORD], (input) => Post(URL_KEYS.AUTH.UPDATE_PASSWORD, input, false)),

  // ************ Upload ***********
  useUpload: () => useMutations<FormData, UploadResponse>([KEYS.UPLOAD.ADD, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (input) => Post(URL_KEYS.UPLOAD.ADD, input)),
  useDeleteUpload: () => useMutations<{ fileUrl: string }, void>([KEYS.UPLOAD.DELETE, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (id) => Delete(`${URL_KEYS.UPLOAD.DELETE}`, id)),

  // ************ User ***********
  useEditUser: () => useMutations<EditEmployeePayload, EmployeeApiResponse>([KEYS.USER.EDIT, KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.EDIT, input)),

  // ************ Company ***********
  useEditCompany: () => useMutations<EditCompanyPayload, CompanyApiResponse>([KEYS.COMPANY.EDIT, KEYS.COMPANY.BASE], (input) => Put(URL_KEYS.COMPANY.EDIT, input)),

  // ************ Employee ***********
  useAddEmployee: () => useMutations<AddEmployeePayload, void>([KEYS.USERS.ADD, KEYS.USERS.BASE], (input) => Post(URL_KEYS.USERS.ADD, input)),
  useEditEmployee: () => useMutations<EditEmployeePayload, void>([KEYS.USERS.EDIT, KEYS.USERS.BASE], (input) => Put(URL_KEYS.USERS.EDIT, input)),
  useDeleteEmployee: () => useMutations<string, void>([KEYS.USERS.DELETE, KEYS.USERS.BASE], (id) => Delete(`${URL_KEYS.USERS.BASE}/${id}`)),

  // ************ Contact ***********
  useAddContact: () => useMutations<AddContactPayload, void>([KEYS.CONTACT.ADD, KEYS.CONTACT.BASE], (input) => Post(URL_KEYS.CONTACT.ADD, input)),
  useEditContact: () => useMutations<EditContactPayload, void>([KEYS.CONTACT.EDIT, KEYS.CONTACT.BASE], (input) => Put(URL_KEYS.CONTACT.EDIT, input)),
  useDeleteContact: () => useMutations<string, void>([KEYS.CONTACT.DELETE, KEYS.CONTACT.BASE], (id) => Delete(`${URL_KEYS.CONTACT.BASE}/${id}`)),
  useBulkAddContact: () => useMutations<FormData, BulkAddProductResponse>([KEYS.CONTACT.BULK_ADD, KEYS.CONTACT.BASE], (input) => Post(URL_KEYS.CONTACT.BULK_ADD, input)),

  // ************ Roles ***********
  useAddRoles: () => useMutations<AddRolesPayload, void>([KEYS.ROLES.ADD, KEYS.ROLES.BASE], (input) => Post(URL_KEYS.ROLES.ADD, input)),
  useEditRoles: () => useMutations<EditRolesPayload, void>([KEYS.ROLES.EDIT, KEYS.ROLES.BASE], (input) => Put(URL_KEYS.ROLES.EDIT, input)),
  useDeleteRoles: () => useMutations<string, void>([KEYS.ROLES.DELETE, KEYS.ROLES.BASE], (id) => Delete(`${URL_KEYS.ROLES.BASE}/${id}`)),

  // ************ product ***********
  useAddProduct: () => useMutations<AddProductPayload, void>([KEYS.PRODUCT.ADD, KEYS.PRODUCT.BASE], (input) => Post(URL_KEYS.PRODUCT.ADD, input)),
  useEditProduct: () => useMutations<EditProductPayload, void>([KEYS.PRODUCT.EDIT, KEYS.PRODUCT.BASE], (input) => Put(URL_KEYS.PRODUCT.EDIT, input)),
  useDeleteProduct: () => useMutations<string, void>([KEYS.PRODUCT.DELETE, KEYS.PRODUCT.BASE], (id) => Delete(`${URL_KEYS.PRODUCT.BASE}/${id}`)),
  useDetectProduct: () => useMutations<FormData, ProductDetectApiResponse>([KEYS.PRODUCT.DETECT, KEYS.PRODUCT.BASE], (input) => Post(URL_KEYS.PRODUCT.DETECT, input)),
  useBulkAddProduct: () => useMutations<FormData, BulkAddProductResponse>([KEYS.PRODUCT.BULK_ADD, KEYS.PRODUCT.BASE], (input) => Post(URL_KEYS.PRODUCT.BULK_ADD, input)),

  // ************ Stock ***********
  useAddStock: () => useMutations<AddStockPayload, void>([KEYS.STOCK.ADD, KEYS.STOCK.BASE], (input) => Post(URL_KEYS.STOCK.ADD, input)),
  useAddStockBulkAdjustment: () => useMutations<AddStockBulkAdjustmentPayload, void>([KEYS.STOCK.BULK_ADJUSTMENT, KEYS.STOCK.BASE, KEYS.PRODUCT.BASE], (input) => Put(URL_KEYS.STOCK.BULK_ADJUSTMENT, input)),

  // ************ Stock Verification ***********
  useAddStockVerification: () => useMutations<AddStockVerificationPayload, void>([KEYS.STOCK_VERIFICATION.ADD, KEYS.STOCK_VERIFICATION.BASE], (input) => Post(URL_KEYS.STOCK_VERIFICATION.ADD, input)),
  useEditStockVerification: () => useMutations<EditStockVerificationPayload, void>([KEYS.STOCK_VERIFICATION.EDIT, KEYS.STOCK_VERIFICATION.BASE], (input) => Put(URL_KEYS.STOCK_VERIFICATION.EDIT, input)),
  useDeleteStockVerification: () => useMutations<string, void>([KEYS.STOCK_VERIFICATION.DELETE, KEYS.STOCK_VERIFICATION.BASE], (id) => Delete(`${URL_KEYS.STOCK_VERIFICATION.BASE}/${id}`)),

  // ************ Call Request ***********
  useAddCallRequest: () => useMutations<CallRequestFormValues, void>([KEYS.CALL_REQUEST.ADD], (input) => Post(URL_KEYS.CALL_REQUEST.ADD, input)),

  //************** bank *****************/
  useAddBank: () => useMutations<AddBankPayload, void>([KEYS.BANK.ADD, KEYS.BANK.BASE], (input) => Post(URL_KEYS.BANK.ADD, input)),
  useEditBank: () => useMutations<EditBankPayload, void>([KEYS.BANK.EDIT, KEYS.BANK.BASE], (input) => Put(URL_KEYS.BANK.EDIT, input)),
  useDeleteBank: () => useMutations<string, void>([KEYS.BANK.DELETE, KEYS.BANK.BASE], (id) => Delete(`${URL_KEYS.BANK.BASE}/${id}`)),

  //************** payment **************** */
  // useAddPayment: () => useMutations<FormData, any>([KEYS.PAYMENT.ADD], (input) => Post(URL_KEYS.PAYMENT.ADD, input)),
  // useEditPayment: () => useMutations<FormData, any>([KEYS.PAYMENT.EDIT], (input) => Put(URL_KEYS.PAYMENT.EDIT, input)),
  // useDeletePayment: () => useMutations<{ id: string }, void>([KEYS.PAYMENT.DELETE], (id) => Delete(`${URL_KEYS.PAYMENT.BASE}/${id}`)),

  //************** recipe **************** */
  useAddRecipe: () => useMutations<AddRecipePayload, void>([KEYS.RECIPE.ADD, KEYS.RECIPE.BASE], (input) => Post(URL_KEYS.RECIPE.ADD, input)),
  useEditRecipe: () => useMutations<EditRecipePayload, void>([KEYS.RECIPE.EDIT, KEYS.RECIPE.BASE], (input) => Put(URL_KEYS.RECIPE.EDIT, input)),
  useDeleteRecipe: () => useMutations<string, void>([KEYS.RECIPE.DELETE, KEYS.RECIPE.BASE], (id) => Delete(`${URL_KEYS.RECIPE.BASE}/${id}`)),

  //************** bill of live product **************** */
  useAddBillOfLiveProduct: () => useMutations<AddBillOfLiveProductPayload, void>([KEYS.BILL_OF_LIVE_PRODUCT.ADD, KEYS.BILL_OF_LIVE_PRODUCT.BASE], (input) => Post(URL_KEYS.BILL_OF_LIVE_PRODUCT.ADD, input)),
  useEditBillOfLiveProduct: () => useMutations<EditBillOfLiveProductPayload, void>([KEYS.BILL_OF_LIVE_PRODUCT.EDIT, KEYS.BILL_OF_LIVE_PRODUCT.BASE], (input) => Put(URL_KEYS.BILL_OF_LIVE_PRODUCT.EDIT, input)),
  useDeleteBillOfLiveProduct: () => useMutations<string, void>([KEYS.BILL_OF_LIVE_PRODUCT.DELETE, KEYS.BILL_OF_LIVE_PRODUCT.BASE], (id) => Delete(`${URL_KEYS.BILL_OF_LIVE_PRODUCT.BASE}/${id}`)),

  //*************** Permission **************** */
  useEditUserPermission: () => useMutations<EditPermissionPayload, void>([KEYS.PERMISSION.EDIT, KEYS.PERMISSION.DETAILS], (input) => Put(URL_KEYS.PERMISSION.EDIT, input)),

  //************** supplier bill **************** *//
  useAddSupplierBill: () => useMutations<AddSupplierBillPayload, void>([KEYS.SUPPLIER_BILL.ADD, KEYS.SUPPLIER_BILL.BASE], (input) => Post(URL_KEYS.SUPPLIER_BILL.ADD, input)),
  useEditSupplierBill: () => useMutations<EditSupplierBillPayload, void>([KEYS.SUPPLIER_BILL.EDIT, KEYS.SUPPLIER_BILL.BASE], (input) => Put(URL_KEYS.SUPPLIER_BILL.EDIT, input)),
  useDeleteSupplierBill: () => useMutations<string, void>([KEYS.SUPPLIER_BILL.DELETE, KEYS.SUPPLIER_BILL.BASE], (id) => Delete(`${URL_KEYS.SUPPLIER_BILL.BASE}/${id}`)),

  //*************** Material Consumption **************** */
  useAddMaterialConsumption: () => useMutations<AddMaterialConsumptionPayload, void>([KEYS.MATERIAL_CONSUMPTION.ADD, KEYS.MATERIAL_CONSUMPTION.BASE], (input) => Post(URL_KEYS.MATERIAL_CONSUMPTION.ADD, input)),
  useEditMaterialConsumption: () => useMutations<EditMaterialConsumptionPayload, void>([KEYS.MATERIAL_CONSUMPTION.EDIT, KEYS.MATERIAL_CONSUMPTION.BASE], (input) => Put(URL_KEYS.MATERIAL_CONSUMPTION.EDIT, input)),
  useDeleteMaterialConsumption: () => useMutations<string, void>([KEYS.MATERIAL_CONSUMPTION.DELETE, KEYS.MATERIAL_CONSUMPTION.BASE], (id) => Delete(`${URL_KEYS.MATERIAL_CONSUMPTION.BASE}/${id}`)),

  //*************** POS **************** */
  useAddPosOrder: () => useMutations<AddPosProductOrderPayload, PosProductOrderDataResponse>([KEYS.POS.ADD, KEYS.POS.BASE, KEYS.POS.HOLD_ORDER, KEYS.POS_ORDER.BASE, KEYS.POS_CASH_REGISTER.DETAILS, KEYS.POS_ORDER.DROPDOWN, KEYS.POS_CREDIT_NOTE.DROPDOWN], (input) => Post(URL_KEYS.POS.ADD, input)),
  useEditPosOrder: () => useMutations<EditPosProductOrderPayload, PosProductOrderDataResponse>([KEYS.POS.EDIT, KEYS.POS.BASE, KEYS.POS.HOLD_ORDER, KEYS.POS_ORDER.BASE, KEYS.POS_ORDER.DROPDOWN], (input) => Put(URL_KEYS.POS.EDIT, input)),
  useDeletePosOrder: () => useMutations<string, void>([KEYS.POS.DELETE, KEYS.POS.BASE, KEYS.POS.HOLD_ORDER, KEYS.POS_ORDER.DROPDOWN], (id) => Delete(`${URL_KEYS.POS.BASE}/${id}`)),

  // ************ POS Payment ************
  useAddPosPayment: () => useMutations<AddPosPaymentPayload, void>([KEYS.POS_PAYMENT.ADD, KEYS.POS_PAYMENT.BASE, KEYS.POS_ORDER.DROPDOWN, KEYS.POS_CREDIT_NOTE.DROPDOWN, KEYS.SUPPLIER_BILL.DROPDOWN], (input) => Post(URL_KEYS.POS_PAYMENT.ADD, input)),
  useEditPosPayment: () => useMutations<EditPosPaymentPayload, void>([KEYS.POS_PAYMENT.EDIT, KEYS.POS_PAYMENT.BASE, KEYS.POS_ORDER.DROPDOWN, KEYS.POS_CREDIT_NOTE.DROPDOWN, KEYS.SUPPLIER_BILL.DROPDOWN], (input) => Put(URL_KEYS.POS_PAYMENT.EDIT, input)),
  useDeletePosPayment: () => useMutations<string, void>([KEYS.POS_PAYMENT.DELETE, KEYS.POS_PAYMENT.BASE, KEYS.POS_ORDER.DROPDOWN], (id) => Delete(`${URL_KEYS.POS_PAYMENT.BASE}/${id}`)),

  // ************ POS Cash Register ************
  useAddPosCashRegister: () => useMutations<AddPosCashRegisterPayload, void>([KEYS.POS_CASH_REGISTER.ADD, KEYS.POS_CASH_REGISTER.BASE, KEYS.POS_CASH_REGISTER.DETAILS], (input) => Post(URL_KEYS.POS_CASH_REGISTER.ADD, input)),
  useEditPosCashRegister: () => useMutations<EditPosCashRegisterPayload, void>([KEYS.POS_CASH_REGISTER.EDIT, KEYS.POS_CASH_REGISTER.BASE, KEYS.POS_CASH_REGISTER.DETAILS], (input) => Put(URL_KEYS.POS_CASH_REGISTER.EDIT, input)),
  useDeletePosCashRegister: () => useMutations<string, void>([KEYS.POS_CASH_REGISTER.DELETE, KEYS.POS_CASH_REGISTER.BASE], (id) => Delete(`${URL_KEYS.POS_CASH_REGISTER.BASE}/${id}`)),

  //*************** additional charges **************** */
  useAddAdditionalCharges: () => useMutations<AddAdditionalChargesPayload, void>([KEYS.ADDITIONAL_CHARGES.ADD, KEYS.ADDITIONAL_CHARGES.BASE], (input) => Post(URL_KEYS.ADDITIONAL_CHARGES.ADD, input)),
  useEditAdditionalCharges: () => useMutations<EditAdditionalChargesPayload, void>([KEYS.ADDITIONAL_CHARGES.EDIT, KEYS.ADDITIONAL_CHARGES.BASE], (input) => Put(URL_KEYS.ADDITIONAL_CHARGES.EDIT, input)),
  useDeleteAdditionalCharges: () => useMutations<string, void>([KEYS.ADDITIONAL_CHARGES.DELETE, KEYS.ADDITIONAL_CHARGES.BASE], (id) => Delete(`${URL_KEYS.ADDITIONAL_CHARGES.BASE}/${id}`)),

  //*************** Terms and Condition **************** */
  useAddTermsCondition: () => useMutations<AddTermsConditionPayload, void>([KEYS.TERMS_CONDITION.ADD, KEYS.TERMS_CONDITION.BASE], (input) => Post(URL_KEYS.TERMS_CONDITION.ADD, input)),
  useEditTermsCondition: () => useMutations<EditTermsConditionPayload, void>([KEYS.TERMS_CONDITION.EDIT, KEYS.TERMS_CONDITION.BASE], (input) => Put(URL_KEYS.TERMS_CONDITION.EDIT, input)),
  useDeleteTermsCondition: () => useMutations<string, void>([KEYS.TERMS_CONDITION.DELETE, KEYS.TERMS_CONDITION.BASE], (id) => Delete(`${URL_KEYS.TERMS_CONDITION.BASE}/${id}`)),

  //*************** Purchase Order **************** */
  useAddPurchaseOrder: () => useMutations<AddPurchaseOrderPayload, void>([KEYS.PURCHASE_ORDER.ADD, KEYS.PURCHASE_ORDER.BASE], (input) => Post(URL_KEYS.PURCHASE_ORDER.ADD, input)),
  useEditPurchaseOrder: () => useMutations<EditPurchaseOrderPayload, void>([KEYS.PURCHASE_ORDER.EDIT, KEYS.PURCHASE_ORDER.BASE], (input) => Put(URL_KEYS.PURCHASE_ORDER.EDIT, input)),
  useDeletePurchaseOrder: () => useMutations<string, void>([KEYS.PURCHASE_ORDER.DELETE, KEYS.PURCHASE_ORDER.BASE], (id) => Delete(`${URL_KEYS.PURCHASE_ORDER.BASE}/${id}`)),

  //*************** Coupon **************** */
  useAddCoupon: () => useMutations<AddCouponPayload, void>([KEYS.COUPON.ADD, KEYS.COUPON.BASE], (input) => Post(URL_KEYS.COUPON.ADD, input)),
  useEditCoupon: () => useMutations<EditCouponPayload, void>([KEYS.COUPON.EDIT, KEYS.COUPON.BASE], (input) => Put(URL_KEYS.COUPON.EDIT, input)),
  useDeleteCoupon: () => useMutations<string, void>([KEYS.COUPON.DELETE, KEYS.COUPON.BASE], (id) => Delete(`${URL_KEYS.COUPON.BASE}/${id}`)),
  useVerifyCoupon: () => useMutations<VerifyCouponPayload, VerifyCouponApiResponse>([KEYS.COUPON.VERIFY], (input) => Post(URL_KEYS.COUPON.VERIFY, input)),

  //*************** Discount **************** */
  useAddDiscount: () => useMutations<AddDiscountPayload, void>([KEYS.DISCOUNT.ADD, KEYS.DISCOUNT.BASE], (input) => Post(URL_KEYS.DISCOUNT.ADD, input)),
  useEditDiscount: () => useMutations<EditDiscountPayload, void>([KEYS.DISCOUNT.EDIT, KEYS.DISCOUNT.BASE], (input) => Put(URL_KEYS.DISCOUNT.EDIT, input)),
  useDeleteDiscount: () => useMutations<string, void>([KEYS.DISCOUNT.DELETE, KEYS.DISCOUNT.BASE], (id) => Delete(`${URL_KEYS.DISCOUNT.BASE}/${id}`)),
  useVerifyDiscount: () => useMutations<VerifyDiscountPayload, VerifyCouponApiResponse>([KEYS.DISCOUNT.VERIFY], (input) => Post(URL_KEYS.DISCOUNT.VERIFY, input)),

  //*************** Loyalty **************** */
  useAddLoyalty: () => useMutations<AddLoyaltyPayload, void>([KEYS.LOYALTY.ADD, KEYS.LOYALTY.BASE], (input) => Post(URL_KEYS.LOYALTY.ADD, input)),
  useEditLoyalty: () => useMutations<EditLoyaltyPayload, void>([KEYS.LOYALTY.EDIT, KEYS.LOYALTY.BASE], (input) => Put(URL_KEYS.LOYALTY.EDIT, input)),
  useDeleteLoyalty: () => useMutations<string, void>([KEYS.LOYALTY.DELETE, KEYS.LOYALTY.BASE], (id) => Delete(`${URL_KEYS.LOYALTY.BASE}/${id}`)),
  useAddLoyaltyPoint: () => useMutations<EditLoyaltyPointPayload, void>([KEYS.LOYALTY.POINTS_ADD, KEYS.LOYALTY.BASE], (input) => Post(URL_KEYS.LOYALTY.POINTS_ADD, input)),
  useRedeemLoyalty: () => useMutations<RedeemLoyaltyPayload, RedeemLoyaltyApiResponse>([KEYS.LOYALTY.REDEEM], (input) => Post(URL_KEYS.LOYALTY.REDEEM, input)),

  //*************** Cash Control *********
  useAddCashControl: () => useMutations<AddCashControlPayload, void>([KEYS.CASH_CONTROL.ADD, KEYS.CASH_CONTROL.BASE, KEYS.POS_CASH_REGISTER.DETAILS], (input) => Post(URL_KEYS.CASH_CONTROL.ADD, input)),

  //*************** POS Credit Note *********
  useAddPosCreditNote: () => useMutations<AddPosCreditNotePayload, void>([KEYS.POS_CREDIT_NOTE.ADD, KEYS.POS_CREDIT_NOTE.BASE], (input) => Post(URL_KEYS.POS_CREDIT_NOTE.ADD, input)),
  useEditPosCreditNote: () => useMutations<EditPosCreditNotePayload, void>([KEYS.POS_CREDIT_NOTE.EDIT, KEYS.POS_CREDIT_NOTE.BASE], (input) => Put(URL_KEYS.POS_CREDIT_NOTE.EDIT, input)),
  useDeletePosCreditNote: () => useMutations<string, void>([KEYS.POS_CREDIT_NOTE.DELETE, KEYS.POS_CREDIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.POS_CREDIT_NOTE.BASE}/${id}`)),
  useRefundCreditNote: () => useMutations<PosCreditNoteRefundFormValues, PosCreditNoteRefundResponse>([KEYS.POS_CREDIT_NOTE.REFUND, KEYS.POS_CREDIT_NOTE.BASE, KEYS.POS_ORDER.DROPDOWN, KEYS.POS_ORDER.BASE], (input) => Post(URL_KEYS.POS_CREDIT_NOTE.REFUND, input)),
  useRedeemCreditNote: () => useMutations<PosCreditNoteRedeemFormValues, PosCreditNoteRedeemResponse>([KEYS.POS_CREDIT_NOTE.REDEEM], (input) => Post(URL_KEYS.POS_CREDIT_NOTE.REDEEM, input)),

  //*************** Credit Note *********
  useAddCreditNote: () => useMutations<AddCreditNotePayload, void>([KEYS.CREDIT_NOTE.ADD, KEYS.CREDIT_NOTE.BASE], (input) => Post(URL_KEYS.CREDIT_NOTE.ADD, input)),
  useEditCreditNote: () => useMutations<EditCreditNotePayload, void>([KEYS.CREDIT_NOTE.EDIT, KEYS.CREDIT_NOTE.BASE], (input) => Put(URL_KEYS.CREDIT_NOTE.EDIT, input)),
  useDeleteCreditNote: () => useMutations<string, void>([KEYS.CREDIT_NOTE.DELETE, KEYS.CREDIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.CREDIT_NOTE.BASE}/${id}`)),

  //*************** Debit Note *********
  useAddDebitNote: () => useMutations<AddDebitNotePayload, void>([KEYS.DEBIT_NOTE.ADD, KEYS.DEBIT_NOTE.BASE], (input) => Post(URL_KEYS.DEBIT_NOTE.ADD, input)),
  useEditDebitNote: () => useMutations<EditDebitNotePayload, void>([KEYS.DEBIT_NOTE.EDIT, KEYS.DEBIT_NOTE.BASE], (input) => Put(URL_KEYS.DEBIT_NOTE.EDIT, input)),
  useDeleteDebitNote: () => useMutations<string, void>([KEYS.DEBIT_NOTE.DELETE, KEYS.DEBIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.DEBIT_NOTE.BASE}/${id}`)),

  //*************** POS Return Order *********
  useAddReturnPosOrder: () => useMutations<AddReturnPosOrderPayload, ReturnPosOrderResponse>([KEYS.RETURN_POS_ORDER.ADD, KEYS.RETURN_POS_ORDER.BASE, KEYS.POS_CREDIT_NOTE.BASE, KEYS.POS_ORDER.BASE, KEYS.POS_ORDER.DROPDOWN], (input) => Post(URL_KEYS.RETURN_POS_ORDER.ADD, input)),
  useEditReturnPosOrder: () => useMutations<EditReturnPosOrderPayload, ReturnPosOrderResponse>([KEYS.RETURN_POS_ORDER.EDIT, KEYS.RETURN_POS_ORDER.BASE, KEYS.POS_CREDIT_NOTE.BASE], (input) => Put(URL_KEYS.RETURN_POS_ORDER.EDIT, input)),
  useDeleteReturnPosOrder: () => useMutations<string, void>([KEYS.RETURN_POS_ORDER.DELETE, KEYS.RETURN_POS_ORDER.BASE, KEYS.POS_CREDIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.RETURN_POS_ORDER.BASE}/${id}`)),

  //*************** Expense *********
  useAddExpense: () => useMutations<AddExpensePayload, void>([KEYS.EXPENSE.ADD, KEYS.EXPENSE.BASE], (input) => Post(URL_KEYS.EXPENSE.ADD, input)),
  useEditExpense: () => useMutations<EditExpensePayload, void>([KEYS.EXPENSE.EDIT, KEYS.EXPENSE.BASE], (input) => Put(URL_KEYS.EXPENSE.EDIT, input)),
  useDeleteExpense: () => useMutations<string, void>([KEYS.EXPENSE.DELETE, KEYS.EXPENSE.BASE], (id) => Delete(`${URL_KEYS.EXPENSE.BASE}/${id}`)),

  //*************** Salary **************** */
  useAddSalary: () => useMutations<AddSalaryPayload, void>([KEYS.SALARY.ADD, KEYS.SALARY.BASE, KEYS.EXPENSE.BASE], (input) => Post(URL_KEYS.SALARY.ADD, input)),
  useEditSalary: () => useMutations<EditSalaryPayload, void>([KEYS.SALARY.EDIT, KEYS.SALARY.BASE, KEYS.EXPENSE.BASE], (input) => Put(URL_KEYS.SALARY.EDIT, input)),
  useDeleteSalary: () => useMutations<string, void>([KEYS.SALARY.DELETE, KEYS.SALARY.BASE, KEYS.EXPENSE.BASE], (id) => Delete(`${URL_KEYS.SALARY.BASE}/${id}`)),

  //************* bank transaction **************/
  useAddBankTransaction: () => useMutations<AddBankTransactionPayload, void>([KEYS.BANK_TRANSACTION.ADD, KEYS.BANK_TRANSACTION.BASE], (input) => Post(URL_KEYS.BANK_TRANSACTION.ADD, input)),
  useEditBankTransaction: () => useMutations<EditBankTransactionPayload, void>([KEYS.BANK_TRANSACTION.EDIT, KEYS.BANK_TRANSACTION.BASE], (input) => Put(URL_KEYS.BANK_TRANSACTION.EDIT, input)),
  useDeleteBankTransaction: () => useMutations<string, void>([KEYS.BANK_TRANSACTION.DELETE, KEYS.BANK_TRANSACTION.BASE], (id) => Delete(`${URL_KEYS.BANK_TRANSACTION.BASE}/${id}`)),
  // ************ Tax ***********
  useAddTax: () => useMutations<AddTaxPayload, void>([KEYS.TAX.ADD, KEYS.TAX.BASE], (input) => Post(URL_KEYS.TAX.ADD, input)),
  useEditTax: () => useMutations<EditTaxPayload, void>([KEYS.TAX.EDIT, KEYS.TAX.BASE], (input) => Put(URL_KEYS.TAX.EDIT, input)),
  useDeleteTax: () => useMutations<string, void>([KEYS.TAX.DELETE, KEYS.TAX.BASE], (id) => Delete(`${URL_KEYS.TAX.BASE}/${id}`)),

  //*************** Purchase Debit Note **************** */
  useAddPurchaseDebitNote: () => useMutations<AddPurchaseDebitNotePayload, void>([KEYS.PURCHASE_DEBIT_NOTE.ADD, KEYS.PURCHASE_DEBIT_NOTE.BASE], (input) => Post(URL_KEYS.PURCHASE_DEBIT_NOTE.ADD, input)),
  useEditPurchaseDebitNote: () => useMutations<EditPurchaseDebitNotePayload, void>([KEYS.PURCHASE_DEBIT_NOTE.EDIT, KEYS.PURCHASE_DEBIT_NOTE.BASE], (input) => Put(URL_KEYS.PURCHASE_DEBIT_NOTE.EDIT, input)),
  useDeletePurchaseDebitNote: () => useMutations<string, void>([KEYS.PURCHASE_DEBIT_NOTE.DELETE, KEYS.PURCHASE_DEBIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.PURCHASE_DEBIT_NOTE.BASE}/${id}`)),

  //*************** Estimate **************** */
  useAddEstimate: () => useMutations<AddEstimatePayload, void>([KEYS.ESTIMATE.ADD, KEYS.ESTIMATE.BASE], (input) => Post(URL_KEYS.ESTIMATE.ADD, input)),
  useEditEstimate: () => useMutations<EditEstimatePayload, void>([KEYS.ESTIMATE.EDIT, KEYS.ESTIMATE.BASE], (input) => Put(URL_KEYS.ESTIMATE.EDIT, input)),
  useDeleteEstimate: () => useMutations<string, void>([KEYS.ESTIMATE.DELETE, KEYS.ESTIMATE.BASE], (id) => Delete(`${URL_KEYS.ESTIMATE.BASE}/${id}`)),

  //*************** Sales Order **************** */

  useAddSalesOrder: () => useMutations<AddSalesOrderPayload, void>([KEYS.SALES_ORDER.ADD, KEYS.SALES_ORDER.BASE], (input) => Post(URL_KEYS.SALES_ORDER.ADD, input)),
  useEditSalesOrder: () => useMutations<EditSalesOrderPayload, void>([KEYS.SALES_ORDER.EDIT, KEYS.SALES_ORDER.BASE], (input) => Put(URL_KEYS.SALES_ORDER.EDIT, input)),
  useDeleteSalesOrder: () => useMutations<string, void>([KEYS.SALES_ORDER.DELETE, KEYS.SALES_ORDER.BASE], (id) => Delete(`${URL_KEYS.SALES_ORDER.BASE}/${id}`)),

  //*************** Invoice **************** */

  useAddInvoice: () => useMutations<AddInvoicePayload, void>([KEYS.INVOICE.ADD, KEYS.INVOICE.BASE], (input) => Post(URL_KEYS.INVOICE.ADD, input)),
  useEditInvoice: () => useMutations<EditInvoicePayload, void>([KEYS.INVOICE.EDIT, KEYS.INVOICE.BASE], (input) => Put(URL_KEYS.INVOICE.EDIT, input)),
  useDeleteInvoice: () => useMutations<string, void>([KEYS.INVOICE.DELETE, KEYS.INVOICE.BASE], (id) => Delete(`${URL_KEYS.INVOICE.BASE}/${id}`)),

  //*************** Delivery Challan **************** */

  useAddDeliveryChallan: () => useMutations<AddDeliveryChallanPayload, void>([KEYS.DELIVERY_CHALLAN.ADD, KEYS.DELIVERY_CHALLAN.BASE], (input) => Post(URL_KEYS.DELIVERY_CHALLAN.ADD, input)),
  useEditDeliveryChallan: () => useMutations<EditDeliveryChallanPayload, void>([KEYS.DELIVERY_CHALLAN.EDIT, KEYS.DELIVERY_CHALLAN.BASE], (input) => Put(URL_KEYS.DELIVERY_CHALLAN.EDIT, input)),
  useDeleteDeliveryChallan: () => useMutations<string, void>([KEYS.DELIVERY_CHALLAN.DELETE, KEYS.DELIVERY_CHALLAN.BASE], (id) => Delete(`${URL_KEYS.DELIVERY_CHALLAN.BASE}/${id}`)),

  //*************** Sales Credit Note **************** */
  useAddSalesCreditNote: () => useMutations<AddSalesCreditNotePayload, void>([KEYS.SALES_CREDIT_NOTE.ADD, KEYS.SALES_CREDIT_NOTE.BASE], (input) => Post(URL_KEYS.SALES_CREDIT_NOTE.ADD, input)),
  useEditSalesCreditNote: () => useMutations<EditSalesCreditNotePayload, void>([KEYS.SALES_CREDIT_NOTE.EDIT, KEYS.SALES_CREDIT_NOTE.BASE], (input) => Put(URL_KEYS.SALES_CREDIT_NOTE.EDIT, input)),
  useDeleteSalesCreditNote: () => useMutations<string, void>([KEYS.SALES_CREDIT_NOTE.DELETE, KEYS.SALES_CREDIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.SALES_CREDIT_NOTE.BASE}/${id}`)),

  //*************** Prefix **************** */
  useAddPrefix: () => useMutations<AddPrefixPayload, void>([KEYS.PREFIX.ADD, KEYS.PREFIX.BASE], (input) => Post(URL_KEYS.PREFIX.ADD, input)),
  useEditPrefix: () => useMutations<EditPrefixPayload, void>([KEYS.PREFIX.EDIT, KEYS.PREFIX.BASE], (input) => Put(URL_KEYS.PREFIX.EDIT, input)),
  useDeletePrefix: () => useMutations<string, void>([KEYS.PREFIX.DELETE, KEYS.PREFIX.BASE], (id) => Delete(`${URL_KEYS.PREFIX.BASE}/${id}`)),

  //*************** Payment Terms **************** */
  useAddPaymentTerms: () => useMutations<AddPaymentTermsPayload, void>([KEYS.PAYMENT_TERM.ADD, KEYS.PAYMENT_TERM.BASE], (input) => Post(URL_KEYS.PAYMENT_TERM.ADD, input)),
  useEditPaymentTerms: () => useMutations<EditPaymentTermsPayload, void>([KEYS.PAYMENT_TERM.EDIT, KEYS.PAYMENT_TERM.BASE], (input) => Put(URL_KEYS.PAYMENT_TERM.EDIT, input)),
  useDeletePaymentTerms: () => useMutations<string, void>([KEYS.PAYMENT_TERM.DELETE, KEYS.PAYMENT_TERM.BASE], (id) => Delete(`${URL_KEYS.PAYMENT_TERM.BASE}/${id}`)),

  //*************** Consumption Type **************** */
  useAddConsumptionType: () => useMutations<AddConsumptionTypePayload, void>([KEYS.CONSUMPTION_TYPE.ADD, KEYS.CONSUMPTION_TYPE.BASE], (input) => Post(URL_KEYS.CONSUMPTION_TYPE.ADD, input)),
  useEditConsumptionType: () => useMutations<EditConsumptionTypePayload, void>([KEYS.CONSUMPTION_TYPE.EDIT, KEYS.CONSUMPTION_TYPE.BASE], (input) => Put(URL_KEYS.CONSUMPTION_TYPE.EDIT, input)),
  useDeleteConsumptionType: () => useMutations<string, void>([KEYS.CONSUMPTION_TYPE.DELETE, KEYS.CONSUMPTION_TYPE.BASE], (id) => Delete(`${URL_KEYS.CONSUMPTION_TYPE.BASE}/${id}`)),

  //*************** Stock Transfer **************** */
  useAddStockTransfer: () => useMutations<AddStockTransferPayload, void>([KEYS.STOCK_TRANSFER.REQUEST, KEYS.STOCK_TRANSFER.BASE], (input) => Post(URL_KEYS.STOCK_TRANSFER.REQUEST, input)),
  useEditStockTransfer: () => useMutations<EditStockTransferPayload, void>([KEYS.STOCK_TRANSFER.EDIT, KEYS.STOCK_TRANSFER.BASE], (input) => Put(URL_KEYS.STOCK_TRANSFER.EDIT, input)),
  useDeleteStockTransfer: () => useMutations<string, void>([KEYS.STOCK_TRANSFER.DELETE, KEYS.STOCK_TRANSFER.BASE], (id) => Delete(`${URL_KEYS.STOCK_TRANSFER.BASE}/${id}`)),
  useApproveStockTransfer: () => useMutations<ApproveStockTransferPayload, void>([KEYS.STOCK_TRANSFER.APPROVE, KEYS.STOCK_TRANSFER.BASE], (input) => Post(URL_KEYS.STOCK_TRANSFER.APPROVE, input)),
  useRejectStockTransfer: () => useMutations<RejectStockTransferPayload, void>([KEYS.STOCK_TRANSFER.REJECT, KEYS.STOCK_TRANSFER.BASE], (input) => Post(URL_KEYS.STOCK_TRANSFER.REJECT, input)),
  useConfirmReceiptStockTransfer: () => useMutations<ConfirmReceiptStockTransferPayload, void>([KEYS.STOCK_TRANSFER.CONFIRM_RECEIPT, KEYS.STOCK_TRANSFER.BASE], (input) => Post(URL_KEYS.STOCK_TRANSFER.CONFIRM_RECEIPT, input)),
  useDispatchStockTransfer: () => useMutations<DispatchStockTransferPayload, void>([KEYS.STOCK_TRANSFER.DISPATCH, KEYS.STOCK_TRANSFER.BASE], (input) => Post(URL_KEYS.STOCK_TRANSFER.DISPATCH, input)),

  useReadNotification: () => useMutations<string, void>([KEYS.NOTIFICATION.READ, KEYS.NOTIFICATION.BASE], (id) => Put(`${URL_KEYS.NOTIFICATION.READ}/${id}`, undefined, true, false)),

  //*************** Branch **************** */
  useEditReportConfigBranch: () => useMutations<EditBranchReportConfigPayload, void>([KEYS.BRANCH.REPORT_FORMAT, KEYS.REPORT_FORMAT.BASE], (input) => Put(URL_KEYS.BRANCH.REPORT_FORMAT, input)),
};
