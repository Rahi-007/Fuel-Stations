import axios, { AxiosResponse } from "axios";
import { API_URLS } from "@/config/configURL";
import { Pagination } from "@/interface/base.interface";
import { IAddUser, IUser } from "@/interface/user.interface";

interface IUserRes extends Pagination<IUser> {}
export function loadUsers(searchOptions?: Record<string, any>) {
  return new Promise<IUserRes>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<IUserRes>>(
        API_URLS.user.all(searchOptions)
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function getUserById(id: number) {
  return new Promise<IUser>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<IUser>>(
        API_URLS.user.get(id)
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function addUser(data: IAddUser) {
  return new Promise<IUser>(async (resolve, reject) => {
    try {
      const response = await axios.post<any, AxiosResponse<IUser>>(
        API_URLS.user.create(),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function editUser(id: number, data: Partial<IAddUser>) {
  return new Promise<IUser>(async (resolve, reject) => {
    try {
      const response = await axios.put<any, AxiosResponse<IUser>>(
        API_URLS.user.update(id),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function deleteUser(id: number) {
  return new Promise<IUser>(async (resolve, reject) => {
    try {
      const response = await axios.delete<any, AxiosResponse<IUser>>(
        API_URLS.user.delete(id)
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}
