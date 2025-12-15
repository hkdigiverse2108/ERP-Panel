import { KEYS, URL_KEYS } from "../Constants";
import type { AppQueryOptions, UploadResponse } from "../Types";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";

export const Queries = {
  // ************ Upload ***********
  useGetUploadImage: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>(KEYS.UPLOAD.LIST_IMAGE, () => Get(URL_KEYS.UPLOAD.ALL_IMAGE), options),
  useGetUploadPdf: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>(KEYS.UPLOAD.LIST_PDF, () => Get(URL_KEYS.UPLOAD.ALL_PDF), options),

  // ************ User ***********
  userGetUserdata: (userId?: string) =>
    useQueries<any>([KEYS.USER.ADD], () => Get(URL_KEYS.USER.ONE(userId as string)), {
      enabled: !!userId,
    }),
};
