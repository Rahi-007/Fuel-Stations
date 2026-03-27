import axios, { AxiosResponse } from "axios";
import { API_URLS } from "@/config/configURL";
import type {
  ILoginPayload,
  ILoginResponse,
} from "../interface/auth.interface";

export function login(data: ILoginPayload) {
  return new Promise<ILoginResponse>(async (resolve, reject) => {
    try {
      const response = await axios.post<any, AxiosResponse<ILoginResponse>>(
        API_URLS.auth.login(),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function logout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("user");
  }

  delete axios.defaults.headers.common.Authorization;
}
