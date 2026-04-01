import axios, { AxiosResponse } from "axios";
import { api, API_URLS } from "@/config/configURL";
import type {
  NearbyStationsResponse,
  IStation,
  StationComment,
  UpdateStation,
} from "@/interface/station.interface";
import { Pagination, SearchParams } from "@/interface/base.interface";

export async function fetchNearbyStations(
  lat: number,
  lng: number,
  radius = 10000
): Promise<NearbyStationsResponse> {
  const qs = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
  });
  const { data } = await axios.get<NearbyStationsResponse>(
    `${api("stations/nearby")}?${qs.toString()}`
  );
  return data;
}

export interface IStationRes extends Pagination<IStation> {}
export function loadStations(
  searchOptions?: Partial<SearchParams> & {
    division?: string;
    district?: string;
    subDistrict?: string;
    village?: string;
  }
): Promise<IStationRes> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<IStationRes>>(
        API_URLS.stations.all(),
        {
          params: searchOptions,
        }
      );

      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function getStationById(id: number) {
  return new Promise<IStation>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<IStation>>(
        API_URLS.stations.get(id)
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function editStation(id: number, data: Partial<UpdateStation>) {
  return new Promise<IStation>(async (resolve, reject) => {
    try {
      const response = await axios.put<any, AxiosResponse<IStation>>(
        API_URLS.stations.update(id),
        data
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function likeStation(stationId: number) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await axios.post(API_URLS.stations.like(), { stationId });
      resolve();
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function unlikeStation(stationId: number) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await axios.delete(API_URLS.stations.unlike(stationId));
      resolve();
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function followStation(stationId: number) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await axios.post(API_URLS.stations.follow(), { stationId });
      resolve();
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function unfollowStation(stationId: number) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await axios.delete(API_URLS.stations.unfollow(stationId));
      resolve();
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function loadCommentsByStation(stationId: number) {
  return new Promise<StationComment[]>(async (resolve, reject) => {
    try {
      const response = await axios.get<any, AxiosResponse<StationComment[]>>(
        API_URLS.stations.comments(stationId)
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}

export function createStationComment(stationId: number, text: string) {
  return new Promise<StationComment>(async (resolve, reject) => {
    try {
      const response = await axios.post<any, AxiosResponse<StationComment>>(
        API_URLS.stations.commentCreate(),
        { stationId, text }
      );
      resolve(response.data);
    } catch (error: any) {
      reject(error.response?.data?.message || "Something went wrong");
    }
  });
}
