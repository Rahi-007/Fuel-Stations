import { BASE_URL } from "./const";

export const api = (l?: string) => {
  return l ? `${BASE_URL}/api/${l}` : BASE_URL;
};

function objectToUrlParams(obj: Record<string, any>): string {
  return new URLSearchParams(obj).toString();
}

export const API_URLS = {
  user: {
    all: (s?: Record<string, any>) =>
      api(["user", objectToUrlParams(s || {})].join("?")),
    add: () => api("user"),
    get: (id: number) => api(`user/${id}`),
    create: () => api("user"),
    update: (id: number) => api(`user/${id}`),
    delete: (id: number) => api(`user/${id}`),
  },
};
