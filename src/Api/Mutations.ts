import { KEYS, URL_KEYS } from "../Constants";
import type { AddAdditionalChargesPayload, AddBankPayload, AddBillOfLiveProductPayload, AddCashControlPayload, AddContactPayload, AddCouponPayload, AddEmployeePayload, AddLoyaltyPayload, AddMaterialConsumptionPayload, AddPosPaymentPayload, AddPosProductOrderPayload, AddProductPayload, AddPurchaseOrderPayload, AddRecipePayload, AddRolesPayload, AddStockBulkAdjustmentPayload, AddStockPayload, AddStockVerificationPayload, AddSupplierBillPayload, AddTermsConditionPayload, CallRequestFormValues, CompanyApiResponse, EditAdditionalChargesPayload, EditBankPayload, EditBillOfLiveProductPayload, EditCompanyPayload, EditContactPayload, EditCouponPayload, EditEmployeePayload, EditLoyaltyPayload, EditLoyaltyPointPayload, EditMaterialConsumptionPayload, EditPermissionPayload, EditPosPaymentPayload, EditPosProductOrderPayload, EditProductPayload, EditPurchaseOrderPayload, EditRecipePayload, EditRolesPayload, EditStockVerificationPayload, EditSupplierBillPayload, EditTermsConditionPayload, EmployeeApiResponse, LoginPayload, LoginResponse, RedeemLoyaltyApiResponse, RedeemLoyaltyPayload, UploadResponse, VerifyCouponApiResponse, VerifyCouponPayload, ChangePasswordPayload, EditPosCreditNotePayload, AddPosCreditNotePayload, AddCreditNotePayload, EditCreditNotePayload, AddReturnPosOrderPayload, EditReturnPosOrderPayload } from "../Types";
import type { AddPosCashRegisterPayload, EditPosCashRegisterPayload } from "../Types";
import { Delete, Post, Put } from "./Methods";
import { useMutations } from "./ReactQuery";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),
  useChangePassword: () => useMutations<ChangePasswordPayload, void>([KEYS.AUTH.CHANGE_PASSWORD], (input) => Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input)),

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

  // ************ Roles ***********
  useAddRoles: () => useMutations<AddRolesPayload, void>([KEYS.ROLES.ADD, KEYS.ROLES.BASE], (input) => Post(URL_KEYS.ROLES.ADD, input)),
  useEditRoles: () => useMutations<EditRolesPayload, void>([KEYS.ROLES.EDIT, KEYS.ROLES.BASE], (input) => Put(URL_KEYS.ROLES.EDIT, input)),
  useDeleteRoles: () => useMutations<string, void>([KEYS.ROLES.DELETE, KEYS.ROLES.BASE], (id) => Delete(`${URL_KEYS.ROLES.BASE}/${id}`)),

  // ************ product ***********
  useAddProduct: () => useMutations<AddProductPayload, void>([KEYS.PRODUCT.ADD, KEYS.PRODUCT.BASE], (input) => Post(URL_KEYS.PRODUCT.ADD, input)),
  useEditProduct: () => useMutations<EditProductPayload, void>([KEYS.PRODUCT.EDIT, KEYS.PRODUCT.BASE], (input) => Put(URL_KEYS.PRODUCT.EDIT, input)),
  useDeleteProduct: () => useMutations<string, void>([KEYS.PRODUCT.DELETE, KEYS.PRODUCT.BASE], (id) => Delete(`${URL_KEYS.PRODUCT.BASE}/${id}`)),

  // ************ Stock ***********
  useAddStock: () => useMutations<AddStockPayload, void>([KEYS.STOCK.ADD, KEYS.STOCK.BASE], (input) => Post(URL_KEYS.STOCK.ADD, input)),
  useAddStockBulkAdjustment: () => useMutations<AddStockBulkAdjustmentPayload, void>([KEYS.STOCK.BULK_ADJUSTMENT, KEYS.STOCK.BASE], (input) => Put(URL_KEYS.STOCK.BULK_ADJUSTMENT, input)),

  // ************ Stock Verification ***********
  useAddStockVerification: () => useMutations<AddStockVerificationPayload, void>([KEYS.STOCK_VERIFICATION.ADD, KEYS.STOCK_VERIFICATION.BASE], (input) => Post(URL_KEYS.STOCK_VERIFICATION.ADD, input)),
  useEditStockVerification: () => useMutations<EditStockVerificationPayload, void>([KEYS.STOCK_VERIFICATION.EDIT, KEYS.STOCK_VERIFICATION.BASE], (input) => Put(URL_KEYS.STOCK_VERIFICATION.EDIT, input)),
  useDeleteStockVerification: () => useMutations<string, void>([KEYS.STOCK_VERIFICATION.DELETE, KEYS.STOCK_VERIFICATION.BASE], (id) => Delete(`${URL_KEYS.STOCK_VERIFICATION.BASE}/${id}`)),

  // ************ Call Request ***********
  useAddCallRequest: () => useMutations<CallRequestFormValues, void>([KEYS.CALL_REQUEST.ADD], (input) => Post(URL_KEYS.CALL_REQUEST.ADD, input)),

  //************** bank *****************/
  useAddBank: () => useMutations<AddBankPayload, void>([KEYS.BANK.ADD], (input) => Post(URL_KEYS.BANK.ADD, input)),
  useEditBank: () => useMutations<EditBankPayload, void>([KEYS.BANK.EDIT, KEYS.BANK.BASE], (input) => Put(URL_KEYS.BANK.EDIT, input)),
  useDeleteBank: () => useMutations<string, void>([KEYS.BANK.DELETE], (id) => Delete(`${URL_KEYS.BANK.BASE}/${id}`)),

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
  useEditUserPermission: () => useMutations<EditPermissionPayload, void>([KEYS.PERMISSION.DETAILS], (input) => Put(URL_KEYS.PERMISSION.EDIT, input)),

  //************** supplier bill **************** *//
  useAddSupplierBill: () => useMutations<AddSupplierBillPayload, void>([KEYS.SUPPLIER_BILL.ADD, KEYS.SUPPLIER_BILL.BASE], (input) => Post(URL_KEYS.SUPPLIER_BILL.ADD, input)),
  useEditSupplierBill: () => useMutations<EditSupplierBillPayload, void>([KEYS.SUPPLIER_BILL.EDIT, KEYS.SUPPLIER_BILL.BASE], (input) => Put(URL_KEYS.SUPPLIER_BILL.EDIT, input)),
  useDeleteSupplierBill: () => useMutations<string, void>([KEYS.SUPPLIER_BILL.DELETE, KEYS.SUPPLIER_BILL.BASE], (id) => Delete(`${URL_KEYS.SUPPLIER_BILL.BASE}/${id}`)),

  //*************** Material Consumption **************** */
  useAddMaterialConsumption: () => useMutations<AddMaterialConsumptionPayload, void>([KEYS.MATERIAL_CONSUMPTION.ADD, KEYS.MATERIAL_CONSUMPTION.BASE], (input) => Post(URL_KEYS.MATERIAL_CONSUMPTION.ADD, input)),
  useEditMaterialConsumption: () => useMutations<EditMaterialConsumptionPayload, void>([KEYS.MATERIAL_CONSUMPTION.EDIT, KEYS.MATERIAL_CONSUMPTION.BASE], (input) => Put(URL_KEYS.MATERIAL_CONSUMPTION.EDIT, input)),
  useDeleteMaterialConsumption: () => useMutations<string, void>([KEYS.MATERIAL_CONSUMPTION.DELETE, KEYS.MATERIAL_CONSUMPTION.BASE], (id) => Delete(`${URL_KEYS.MATERIAL_CONSUMPTION.BASE}/${id}`)),

  //*************** POS **************** */
  useAddPosOrder: () => useMutations<AddPosProductOrderPayload, void>([KEYS.POS.ADD, KEYS.POS.BASE, KEYS.POS.HOLD_ORDER, KEYS.POS_ORDER.BASE, KEYS.POS_CASH_REGISTER.DETAILS], (input) => Post(URL_KEYS.POS.ADD, input)),
  useEditPosOrder: () => useMutations<EditPosProductOrderPayload, void>([KEYS.POS.EDIT, KEYS.POS.BASE, KEYS.POS.HOLD_ORDER], (input) => Put(URL_KEYS.POS.EDIT, input)),
  useDeletePosOrder: () => useMutations<string, void>([KEYS.POS.DELETE, KEYS.POS.BASE, KEYS.POS.HOLD_ORDER], (id) => Delete(`${URL_KEYS.POS.BASE}/${id}`)),

  // ************ POS Payment ************
  useAddPosPayment: () => useMutations<AddPosPaymentPayload, void>([KEYS.POS_PAYMENT.ADD, KEYS.POS_PAYMENT.BASE], (input) => Post(URL_KEYS.POS_PAYMENT.ADD, input)),
  useEditPosPayment: () => useMutations<EditPosPaymentPayload, void>([KEYS.POS_PAYMENT.EDIT, KEYS.POS_PAYMENT.BASE], (input) => Put(URL_KEYS.POS_PAYMENT.EDIT, input)),
  useDeletePosPayment: () => useMutations<string, void>([KEYS.POS_PAYMENT.DELETE, KEYS.POS_PAYMENT.BASE], (id) => Delete(`${URL_KEYS.POS_PAYMENT.BASE}/${id}`)),

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

  //*************** Loyalty **************** */
  useAddLoyalty: () => useMutations<AddLoyaltyPayload, void>([KEYS.LOYALTY.ADD, KEYS.LOYALTY.BASE], (input) => Post(URL_KEYS.LOYALTY.ADD, input)),
  useEditLoyalty: () => useMutations<EditLoyaltyPayload, void>([KEYS.LOYALTY.EDIT, KEYS.LOYALTY.BASE], (input) => Put(URL_KEYS.LOYALTY.EDIT, input)),
  useDeleteLoyalty: () => useMutations<string, void>([KEYS.LOYALTY.DELETE, KEYS.LOYALTY.BASE], (id) => Delete(`${URL_KEYS.LOYALTY.BASE}/${id}`)),
  useAddLoyaltyPoint: () => useMutations<EditLoyaltyPointPayload, void>([KEYS.LOYALTY.POINTS_ADD, KEYS.LOYALTY.BASE], (input) => Post(URL_KEYS.LOYALTY.POINTS_ADD, input)),
  useRedeemLoyalty: () => useMutations<RedeemLoyaltyPayload, RedeemLoyaltyApiResponse>([KEYS.LOYALTY.REDEEM], (input) => Post(URL_KEYS.LOYALTY.REDEEM, input)),

  //*************** Cash Control *********
  useAddCashControl: () => useMutations<AddCashControlPayload, void>([KEYS.CASH_CONTROL.ADD, KEYS.CASH_CONTROL.BASE], (input) => Post(URL_KEYS.CASH_CONTROL.ADD, input)),

  //*************** POS Credit Note *********
  useAddPosCreditNote: () => useMutations<AddPosCreditNotePayload, void>([KEYS.POS_CREDIT_NOTE.ADD, KEYS.POS_CREDIT_NOTE.BASE], (input) => Post(URL_KEYS.POS_CREDIT_NOTE.ADD, input)),
  useEditPosCreditNote: () => useMutations<EditPosCreditNotePayload, void>([KEYS.POS_CREDIT_NOTE.EDIT, KEYS.POS_CREDIT_NOTE.BASE], (input) => Put(URL_KEYS.POS_CREDIT_NOTE.EDIT, input)),
  useDeletePosCreditNote: () => useMutations<string, void>([KEYS.POS_CREDIT_NOTE.DELETE, KEYS.POS_CREDIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.POS_CREDIT_NOTE.BASE}/${id}`)),

  //*************** Credit Note *********
  useAddCreditNote: () => useMutations<AddCreditNotePayload, void>([KEYS.CREDIT_NOTE.ADD, KEYS.CREDIT_NOTE.BASE], (input) => Post(URL_KEYS.CREDIT_NOTE.ADD, input)),
  useEditCreditNote: () => useMutations<EditCreditNotePayload, void>([KEYS.CREDIT_NOTE.EDIT, KEYS.CREDIT_NOTE.BASE], (input) => Put(URL_KEYS.CREDIT_NOTE.EDIT, input)),
  useDeleteCreditNote: () => useMutations<string, void>([KEYS.CREDIT_NOTE.DELETE, KEYS.CREDIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.CREDIT_NOTE.BASE}/${id}`)),
  
  //*************** POS Return Order *********
  useAddReturnPosOrder: () => useMutations<AddReturnPosOrderPayload, void>([KEYS.RETURN_POS_ORDER.ADD, KEYS.RETURN_POS_ORDER.BASE], (input) => Post(URL_KEYS.RETURN_POS_ORDER.ADD, input)),
  useEditReturnPosOrder: () => useMutations<EditReturnPosOrderPayload, void>([KEYS.RETURN_POS_ORDER.EDIT, KEYS.RETURN_POS_ORDER.BASE], (input) => Put(URL_KEYS.RETURN_POS_ORDER.EDIT, input)),
  useDeleteReturnPosOrder: () => useMutations<string, void>([KEYS.RETURN_POS_ORDER.DELETE, KEYS.RETURN_POS_ORDER.BASE], (id) => Delete(`${URL_KEYS.RETURN_POS_ORDER.BASE}/${id}`)),
};
