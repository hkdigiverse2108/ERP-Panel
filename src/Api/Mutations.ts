import { KEYS, URL_KEYS } from "../Constants";
import type { AddEmployeePayload, EditEmployeePayload, LoginPayload, LoginResponse, UploadResponse } from "../Types";
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
  // useAddEmployee: () => useMutations<EmployeeFormValues, void>([KEYS.EMPLOYEE.ADD, KEYS.EMPLOYEE.BASE], (input) => Post(URL_KEYS.EMPLOYEE.ADD, input)),
  // useEditEmployee: () => useMutations<EmployeeFormValues, void>([KEYS.EMPLOYEE.EDIT, KEYS.EMPLOYEE.BASE], (input) => Put(URL_KEYS.EMPLOYEE.EDIT, input)),
  useAddEmployee: () => useMutations<AddEmployeePayload, void>([KEYS.EMPLOYEE.ADD, KEYS.EMPLOYEE.BASE], (input) => Post(URL_KEYS.EMPLOYEE.ADD, input)),
  useEditEmployee: () => useMutations<EditEmployeePayload, void>([KEYS.EMPLOYEE.EDIT, KEYS.EMPLOYEE.BASE], (input) => Put(URL_KEYS.EMPLOYEE.EDIT, input)),
  useDeleteEmployee: () => useMutations<string, void>([KEYS.EMPLOYEE.DELETE], (id) => Delete(`${URL_KEYS.EMPLOYEE.BASE}/${id}`)),

  // ************ Branch ***********
  useAddBranch: () => useMutations<FormData, any>(KEYS.BRANCH.ADD, (input) => Post(URL_KEYS.BRANCH.ADD, input, false)),
  useEditBranch: () => useMutations<FormData, any>(KEYS.BRANCH.ADD, (input) => Put(URL_KEYS.BRANCH.EDIT, input)),
  useDeleteBranch: () => useMutations<{ id: string }, void>(KEYS.BRANCH.DELETE, (id) => Delete(`${URL_KEYS.BRANCH.BASE}/${id}`)),

  // ************ Branch ***********
  useAddProduct: () => useMutations<FormData, any>(KEYS.PRODUCT.ADD, (input) => Post(URL_KEYS.PRODUCT.ADD, input, false)),
  useEditProduct: () => useMutations<FormData, any>(KEYS.PRODUCT.EDIT, (input) => Put(URL_KEYS.PRODUCT.EDIT, input)),
  useDeleteProduct: () => useMutations<{ id: string }, void>(KEYS.PRODUCT.DELETE, (id) => Delete(`${URL_KEYS.PRODUCT.BASE}/${id}`)),

  // ************ Call Request ***********
  useAddCallRequest: () => useMutations<FormData, any>(KEYS.CALL_REQUEST.ADD, (input) => Post(URL_KEYS.CALL_REQUEST.ADD, input, false)),

  //************** bank *****************/
  useAddBank: () => useMutations<FormData, any>(KEYS.BANK.ADD, (input) => Post(URL_KEYS.BANK.ADD, input, false)),
};
