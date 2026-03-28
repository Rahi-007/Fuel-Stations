import axios from "axios";
import { api } from "@/config/configURL";
import type {
  ListStationsResponse,
  NearbyStationsResponse,
} from "@/interface/station.interface";

export async function fetchNearbyStations(
  lat: number,
  lng: number,
  radius = 5000
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

export async function fetchStationsFromDb(filters: {
  division?: string;
  district?: string;
  subDistrict?: string;
  village?: string;
  limit?: number;
}): Promise<ListStationsResponse> {
  const params = new URLSearchParams();
  if (filters.division?.trim()) params.set("division", filters.division.trim());
  if (filters.district?.trim()) params.set("district", filters.district.trim());
  if (filters.subDistrict?.trim())
    params.set("subDistrict", filters.subDistrict.trim());
  if (filters.village?.trim()) params.set("village", filters.village.trim());
  if (filters.limit != null) params.set("limit", String(filters.limit));
  const q = params.toString();
  const { data } = await axios.get<ListStationsResponse>(
    `${api("stations")}${q ? `?${q}` : ""}`
  );
  return data;
}
