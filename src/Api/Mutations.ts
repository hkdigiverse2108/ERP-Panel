import { KEYS, URL_KEYS } from "../Constants";
import type { AddBranchPayload, AddEmployeePayload, EditBranchPayload, EditEmployeePayload, LoginPayload, LoginResponse, UploadResponse } from "../Types";
import { Delete, Post, Put } from "./Methods";
import { useMutations } from "./ReactQuery";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>(KEYS.AUTH.SIGNIN, (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),

  // ************ Upload ***********
  useUpload: () => useMutations<FormData, UploadResponse>(KEYS.UPLOAD.ADD, (input) => Post(URL_KEYS.UPLOAD.ADD, input)),
  useDeleteUpload: () => useMutations<{ fileUrl: string }, void>(KEYS.UPLOAD.DELETE, (id) => Delete(`${URL_KEYS.UPLOAD.DELETE}`, id)),

  // ************ User ***********
  useEditUser: () => useMutations<FormData, any>(KEYS.USER.EDIT, (input) => Put(URL_KEYS.USER.EDIT, input)),

  // ************ Company ***********
  useEditCompany: () => useMutations<FormData, any>(KEYS.COMPANY.EDIT, (input) => Put(URL_KEYS.COMPANY.EDIT, input)),

  // ************ Employee ***********
  useAddEmployee: () => useMutations<AddEmployeePayload, void>([KEYS.EMPLOYEE.ADD, KEYS.EMPLOYEE.BASE], (input) => Post(URL_KEYS.EMPLOYEE.ADD, input)),
  useEditEmployee: () => useMutations<EditEmployeePayload, void>([KEYS.EMPLOYEE.EDIT, KEYS.EMPLOYEE.BASE], (input) => Put(URL_KEYS.EMPLOYEE.EDIT, input)),
  useDeleteEmployee: () => useMutations<string, void>([KEYS.EMPLOYEE.DELETE, KEYS.EMPLOYEE.BASE], (id) => Delete(`${URL_KEYS.EMPLOYEE.BASE}/${id}`)),

  // ************ Branch ***********
  useAddBranch: () => useMutations<AddBranchPayload, void>([KEYS.BRANCH.ADD, KEYS.BRANCH.BASE], (input) => Post(URL_KEYS.BRANCH.ADD, input, false)),
  useEditBranch: () => useMutations<EditBranchPayload, void>([KEYS.BRANCH.EDIT, KEYS.BRANCH.BASE], (input) => Put(URL_KEYS.BRANCH.EDIT, input)),
  useDeleteBranch: () => useMutations<string, void>([KEYS.BRANCH.DELETE, KEYS.BRANCH.BASE], (id) => Delete(`${URL_KEYS.BRANCH.BASE}/${id}`)),

  // ************ product ***********
  useAddProduct: () => useMutations<FormData, any>(KEYS.PRODUCT.ADD, (input) => Post(URL_KEYS.PRODUCT.ADD, input, false)),
  useEditProduct: () => useMutations<FormData, any>(KEYS.PRODUCT.EDIT, (input) => Put(URL_KEYS.PRODUCT.EDIT, input)),
  useDeleteProduct: () => useMutations<{ id: string }, void>(KEYS.PRODUCT.DELETE, (id) => Delete(`${URL_KEYS.PRODUCT.BASE}/${id}`)),

  // ************ Call Request ***********
  useAddCallRequest: () => useMutations<FormData, any>(KEYS.CALL_REQUEST.ADD, (input) => Post(URL_KEYS.CALL_REQUEST.ADD, input, false)),

  //************** bank *****************/
  useAddBank: () => useMutations<FormData, any>(KEYS.BANK.ADD, (input) => Post(URL_KEYS.BANK.ADD, input, false)),
  useEditBank: () => useMutations<FormData, any>(KEYS.BANK.EDIT, (input) => Put(URL_KEYS.BANK.EDIT, input)),
  useDeleteBank: () => useMutations<{ id: string }, void>(KEYS.BANK.DELETE, (id) => Delete(`${URL_KEYS.BANK.BASE}/${id}`)),

  //************** payment **************** */
  useAddPayment: () => useMutations<FormData, any>(KEYS.PAYMENT.ADD, (input) => Post(URL_KEYS.PAYMENT.ADD, input, false)),
  useEditPayment: () => useMutations<FormData, any>(KEYS.PAYMENT.EDIT, (input) => Put(URL_KEYS.PAYMENT.EDIT, input)),
  useDeletePayment: () => useMutations<{ id: string }, void>(KEYS.PAYMENT.DELETE, (id) => Delete(`${URL_KEYS.PAYMENT.BASE}/${id}`)),

 
};
