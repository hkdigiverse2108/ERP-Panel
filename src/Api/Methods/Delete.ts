import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { HTTP_STATUS } from "../../Constants";
import { getToken } from "../../Utils";
import { ShowNotification } from "../../Attribute";

export async function Delete<T, TInput>(url: string, data?: TInput): Promise<T> {
  const authToken = getToken();
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    data,
  };

  try {
    const response = await axios(config);
    const resData = response.data;

    if (response.status === HTTP_STATUS.OK) {
      ShowNotification(resData.message, "success");
      return resData;
    } else {
      return null as T;
    }
  } catch (error: any) {
    const axiosError = error as AxiosError<any>;
    const responseData = axiosError.response?.data as { message?: string };
    const message = responseData?.message || axiosError.message || "Something went wrong";
    throw new Error(message);
  }
}
