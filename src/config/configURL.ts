export const api = (l?: string) => {
  const base = "https://nonconterminously-unreactionary-lai.ngrok-free.dev";

  return l ? `${base}/api/${l}` : base;
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
    all: () => api("stations"),
    get: (id: number) => api(`stations/${id}`),
    nearby: (lat: number, lng: number, radius = 5000) =>
      api(`stations/nearby?${objectToUrlParams({ lat, lng, radius })}`),
    update: (id: number) => api(`stations/${id}`),
    like: () => api("stations/like"),
    unlike: (stationId: number) => api(`stations/like/${stationId}`),
    follow: () => api("stations/follow"),
    unfollow: (stationId: number) => api(`stations/follow/${stationId}`),
    likeStatus: (stationId: number) => api(`stations/${stationId}/like-status`),
    followStatus: (stationId: number) =>
      api(`stations/${stationId}/follow-status`),
    comments: (stationId: number) => api(`stations/${stationId}/comments`),
    commentCreate: () => api("stations/comment"),
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
