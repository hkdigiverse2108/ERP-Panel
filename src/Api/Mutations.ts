import { KEYS, URL_KEYS } from "../Constants";
import type { LoginPayload, LoginResponse, UploadResponse } from "../Types";
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
  useAddEmployee: () => useMutations<FormData, any>(KEYS.EMPLOYEE.ADD, (input) => Post(URL_KEYS.EMPLOYEE.ADD, input, false)),
  useEditEmployee: () => useMutations<FormData, any>(KEYS.EMPLOYEE.EDIT, (input) => Put(URL_KEYS.EMPLOYEE.EDIT, input)),
  useDeleteEmployee: () => useMutations<{ id: string }, void>(KEYS.EMPLOYEE.DELETE, (id) => Delete(`${URL_KEYS.EMPLOYEE.BASE}/${id}`)),
};
