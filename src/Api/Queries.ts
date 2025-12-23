import { KEYS, URL_KEYS } from "../Constants";
import type { AppQueryOptions, EmployeeApiResponse, Params, UploadResponse } from "../Types";
import { CleanParams } from "../Utils";
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
  useGetEmployee: (params?: Params) => useQueries<EmployeeApiResponse>([KEYS.EMPLOYEE.BASE, params], () => Get(URL_KEYS.EMPLOYEE.ALL, params)),

  useGetOneEmployeeData: (id?: string) =>
    useQueries<any>([KEYS.EMPLOYEE.BASE], () => Get(URL_KEYS.EMPLOYEE.ALL), {
      enabled: !!id,
    }),

  // ************ Branch ***********

  useGetAllBranchData: (params?: Params) => {
    const cleanedParams = CleanParams(params);

    return useQueries<any>([KEYS.BRANCH.ALL, cleanedParams], () => Get(URL_KEYS.BRANCH.ALL, cleanedParams), { placeholderData: (previousData: any) => previousData });
  },
  useGetOneBranchData: (id?: string) =>
    useQueries<any>(KEYS.BRANCH.ALL, () => Get(URL_KEYS.BRANCH.ALL), {
      enabled: !!id,
    }),

  // ************ Stock ***********

  useGetAllStockData: (params?: Params) => {
    const cleanedParams = CleanParams(params);

    return useQueries<any>([KEYS.STOCK.ALL, cleanedParams], () => Get(URL_KEYS.STOCK.ALL, cleanedParams), { placeholderData: (previousData: any) => previousData });
  },
  // ************ Stock ***********
  useGetAllProductData: (params?: Params) => {
    const cleanedParams = CleanParams(params);
    return useQueries<any>([KEYS.PRODUCT.ALL, cleanedParams], () => Get(URL_KEYS.PRODUCT.ALL, cleanedParams), { placeholderData: (previousData: any) => previousData });
  },
};
