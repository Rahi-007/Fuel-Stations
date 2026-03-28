import axios, { AxiosResponse } from "axios";
import { API_URLS } from "@/config/configURL";
import { IAddDivision, IDivision } from "@/interface/division.interface";

export function loadDivisions() {
  return new Promise<IDivision[]>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<IDivision[]>>(
        API_URLS.division.all()
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function getDivisionById(id: number) {
  return new Promise<IDivision>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<IDivision>>(
        API_URLS.division.get(id)
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function addDivision(data: IAddDivision) {
  return new Promise<IDivision>(async (resolve, reject) => {
    try {
      const response = await axios.post<any, AxiosResponse<IDivision>>(
        API_URLS.division.create(),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function editDivision(id: number, data: Partial<IAddDivision>) {
  return new Promise<IDivision>(async (resolve, reject) => {
    try {
      const response = await axios.put<any, AxiosResponse<IDivision>>(
        API_URLS.division.update(id),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function deleteDivision(id: number) {
  return new Promise<{ message: string }>(async (resolve, reject) => {
    try {
      const response = await axios.delete<
        any,
        AxiosResponse<{ message: string }>
      >(API_URLS.division.delete(id));
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}
