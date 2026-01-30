import { KEYS, URL_KEYS } from "../Constants";
import type { AddBankPayload, AddContactPayload, AddEmployeePayload, AddMaterialConsumptionPayload, AddProductPayload, AddRecipePayload, AddRolesPayload, AddStockBulkAdjustmentPayload, AddStockPayload, AddStockVerificationPayload, CallRequestFormValues, CompanyApiResponse, EditBankPayload, EditCompanyPayload, EditContactPayload, EditEmployeePayload, EditMaterialConsumptionPayload, EditPermissionPayload, EditProductPayload, EditRecipePayload, EditRolesPayload, EditStockVerificationPayload, EmployeeApiResponse, LoginPayload, LoginResponse, UploadResponse } from "../Types";
import type { AddBillOfLiveProductPayload, EditBillOfLiveProductPayload } from "../Types/BillOfMaterials";
import type { AddSupplierBillPayload, EditSupplierBillPayload } from "../Types/SupplierBill";
import { Delete, Post, Put } from "./Methods";
import { useMutations } from "./ReactQuery";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),

  // ************ Upload ***********
  useUpload: () => useMutations<FormData, UploadResponse>([KEYS.UPLOAD.ADD, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (input) => Post(URL_KEYS.UPLOAD.ADD, input)),
  useDeleteUpload: () => useMutations<{ fileUrl: string }, void>([KEYS.UPLOAD.DELETE, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (id) => Delete(`${URL_KEYS.UPLOAD.DELETE}`, id)),

  // ************ User ***********
  useEditUser: () => useMutations<EditEmployeePayload, EmployeeApiResponse>([KEYS.USER.EDIT], (input) => Put(URL_KEYS.USER.EDIT, input)),

  // ************ Company ***********
  useEditCompany: () => useMutations<EditCompanyPayload, CompanyApiResponse>([KEYS.COMPANY.EDIT], (input) => Put(URL_KEYS.COMPANY.EDIT, input)),

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
  useAddBillOfLiveProduct: () => useMutations<AddBillOfLiveProductPayload, void>([KEYS.BILL_OF_Live_Product.ADD, KEYS.BILL_OF_Live_Product.BASE], (input) => Post(URL_KEYS.BILL_OF_Live_Product.ADD, input)),
  useEditBillOfLiveProduct: () => useMutations<EditBillOfLiveProductPayload, void>([KEYS.BILL_OF_Live_Product.EDIT, KEYS.BILL_OF_Live_Product.BASE], (input) => Put(URL_KEYS.BILL_OF_Live_Product.EDIT, input)),
  useDeleteBillOfLiveProduct: () => useMutations<string, void>([KEYS.BILL_OF_Live_Product.DELETE, KEYS.BILL_OF_Live_Product.BASE], (id) => Delete(`${URL_KEYS.BILL_OF_Live_Product.BASE}/${id}`)),

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
};
