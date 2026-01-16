import { KEYS, URL_KEYS } from "../Constants";
import type { AddBankPayload, AddContactPayload, AddEmployeePayload, AddProductPayload, AddRecipePayload, AddRolesPayload, CallRequestFormValues, CompanyApiResponse, EditBankPayload, EditCompanyPayload, EditContactPayload, EditEmployeePayload, EditProductPayload, EditRecipePayload, EditRolesPayload, EmployeeApiResponse, LoginPayload, LoginResponse, UploadResponse } from "../Types";
import type { AddStockPayload } from "../Types/Stock";
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
  useAddEmployee: () => useMutations<AddEmployeePayload, void>([KEYS.EMPLOYEE.ADD, KEYS.EMPLOYEE.BASE], (input) => Post(URL_KEYS.EMPLOYEE.ADD, input)),
  useEditEmployee: () => useMutations<EditEmployeePayload, void>([KEYS.EMPLOYEE.EDIT, KEYS.EMPLOYEE.BASE], (input) => Put(URL_KEYS.EMPLOYEE.EDIT, input)),
  useDeleteEmployee: () => useMutations<string, void>([KEYS.EMPLOYEE.DELETE, KEYS.EMPLOYEE.BASE], (id) => Delete(`${URL_KEYS.EMPLOYEE.BASE}/${id}`)),

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
  useAddRecipe: () => useMutations<AddRecipePayload, void>([KEYS.RECIPE.ADD], (input) => Post(URL_KEYS.RECIPE.ADD, input)),
  useEditRecipe: () => useMutations<EditRecipePayload, void>([KEYS.RECIPE.EDIT], (input) => Put(URL_KEYS.RECIPE.EDIT, input)),
  useDeleteRecipe: () => useMutations<string, void>([KEYS.RECIPE.DELETE], (id) => Delete(`${URL_KEYS.RECIPE.BASE}/${id}`)),
};
