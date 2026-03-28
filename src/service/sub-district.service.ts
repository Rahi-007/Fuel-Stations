import axios, { AxiosResponse } from "axios";
import { API_URLS } from "@/config/configURL";
import {
  IAddSubDistrict,
  ISubDistrict,
} from "@/interface/sub-district.interface";

export function loadSubDistricts() {
  return new Promise<ISubDistrict[]>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<ISubDistrict[]>>(
        API_URLS.subDistrict.all()
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function getSubDistrictById(id: number) {
  return new Promise<ISubDistrict>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<ISubDistrict>>(
        API_URLS.subDistrict.get(id)
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function addSubDistrict(data: IAddSubDistrict) {
  return new Promise<ISubDistrict>(async (resolve, reject) => {
    try {
      const response = await axios.post<any, AxiosResponse<ISubDistrict>>(
        API_URLS.subDistrict.create(),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function editSubDistrict(id: number, data: Partial<IAddSubDistrict>) {
  return new Promise<ISubDistrict>(async (resolve, reject) => {
    try {
      const response = await axios.put<any, AxiosResponse<ISubDistrict>>(
        API_URLS.subDistrict.update(id),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function deleteSubDistrict(id: number) {
  return new Promise<{ message: string }>(async (resolve, reject) => {
    try {
      const response = await axios.delete<
        any,
        AxiosResponse<{ message: string }>
      >(API_URLS.subDistrict.delete(id));
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}
