import { KEYS, URL_KEYS } from "../Constants";
import type { AppQueryOptions, Params, UploadResponse } from "../Types";
import { cleanParams } from "../Utils";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";

export const Queries = {
  // ************ Upload ***********
  useGetUploadImage: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>(KEYS.UPLOAD.ALL_IMAGE, () => Get(URL_KEYS.UPLOAD.ALL_IMAGE), options),
  useGetUploadPdf: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>(KEYS.UPLOAD.ALL_PDF, () => Get(URL_KEYS.UPLOAD.ALL_PDF), options),

  // ************ User ***********
  useGetUserdata: (id?: string) =>
    useQueries<any>(KEYS.USER.DETAILS(id as string), () => Get(URL_KEYS.USER.ONE(id as string)), {
      enabled: !!id,
    }),

  // ************ Company ***********
  useGetCompanyData: (id?: string) =>
    useQueries<any>(KEYS.COMPANY.DETAILS(id as string), () => Get(URL_KEYS.COMPANY.ONE(id as string)), {
      enabled: !!id,
    }),

  // ************ Employee ***********
  useGetAllEmployeeData: (params?: Params) =>
    useQueries<any>([KEYS.EMPLOYEE.ALL, cleanParams(params)], () => Get(URL_KEYS.EMPLOYEE.ALL, cleanParams(params)), {
      placeholderData: undefined,
    }),

  useGetOneEmployeeData: (id?: string) =>
    useQueries<any>(KEYS.EMPLOYEE.ALL, () => Get(URL_KEYS.EMPLOYEE.ALL), {
      enabled: !!id,
    }),

  // ************ Branch ***********
  useGetAllBranchData: () => useQueries<any>(KEYS.BRANCH.ALL, () => Get(URL_KEYS.BRANCH.ALL)),

  useGetOneBranchData: (id?: string) =>
    useQueries<any>(KEYS.BRANCH.ALL, () => Get(URL_KEYS.BRANCH.ALL), {
      enabled: !!id,
    }),
};
