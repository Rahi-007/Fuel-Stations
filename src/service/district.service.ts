import axios, { AxiosResponse } from "axios";
import { API_URLS } from "@/config/configURL";
import { IAddDistrict, IDistrict } from "@/interface/district.interface";

export function loadDistricts() {
  return new Promise<IDistrict[]>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<IDistrict[]>>(
        API_URLS.district.all()
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function getDistrictById(id: number) {
  return new Promise<IDistrict>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<IDistrict>>(
        API_URLS.district.get(id)
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function addDistrict(data: IAddDistrict) {
  return new Promise<IDistrict>(async (resolve, reject) => {
    try {
      const response = await axios.post<any, AxiosResponse<IDistrict>>(
        API_URLS.district.create(),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function editDistrict(id: number, data: Partial<IAddDistrict>) {
  return new Promise<IDistrict>(async (resolve, reject) => {
    try {
      const response = await axios.put<any, AxiosResponse<IDistrict>>(
        API_URLS.district.update(id),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function deleteDistrict(id: number) {
  return new Promise<{ message: string }>(async (resolve, reject) => {
    try {
      const response = await axios.delete<
        any,
        AxiosResponse<{ message: string }>
      >(API_URLS.district.delete(id));
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}
