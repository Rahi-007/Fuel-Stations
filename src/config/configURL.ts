import { BASE_URL } from "./const";

export const api = (l?: string) => {
  return l ? `${BASE_URL}/api/${l}` : BASE_URL;
};

function objectToUrlParams(obj: Record<string, any>): string {
  return new URLSearchParams(obj).toString();
}

export const API_URLS = {
  auth: {
    login: () => api("auth/login"),
    register: () => api("auth/register"),
  },
  stations: {
    nearby: (lat: number, lng: number, radius = 5000) =>
      api(`stations/nearby?${objectToUrlParams({ lat, lng, radius })}`),
  },
  user: {
    all: (s?: Record<string, any>) =>
      api(["user", objectToUrlParams(s || {})].join("?")),
    add: () => api("user"),
    get: (id: number) => api(`auth/users/${id}`),
    create: () => api("user"),
    update: (id: number) => api(`user/${id}`),
    delete: (id: number) => api(`user/${id}`),
  },
  division: {
    all: () => api("divisions"),
    get: (id: number) => api(`divisions/${id}`),
    create: () => api("divisions"),
    update: (id: number) => api(`divisions/${id}`),
    delete: (id: number) => api(`divisions/${id}`),
  },
  district: {
    all: () => api("districts"),
    get: (id: number) => api(`districts/${id}`),
    create: () => api("districts"),
    update: (id: number) => api(`districts/${id}`),
    delete: (id: number) => api(`districts/${id}`),
  },
  subDistrict: {
    all: () => api("sub-districts"),
    get: (id: number) => api(`sub-districts/${id}`),
    create: () => api("sub-districts"),
    update: (id: number) => api(`sub-districts/${id}`),
    delete: (id: number) => api(`sub-districts/${id}`),
  },
};
