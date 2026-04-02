export type AdminRef = { id: number; name: string };

export type UserRef = { id: number; name: string };

export type FuelTypes = {
  petrol: boolean;
  octane: boolean;
  diesel: boolean;
};

export type FuelPrices = {
  petrol: number;
  octane: number;
  diesel: number;
};

export enum FuelStatus {
  AVAILABLE = "available",
  OUT_OF_STOCK = "out_of_stock",
  LIMITED = "limited",
}

export enum QueueStatus {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

/** Persisted station response (matches backend `StationRes`) */
export interface IStation {
  id: number;
  osmRef: string;
  name?: string;
  brand?: string;
  lat: number;
  lng: number;

  division?: AdminRef;
  district?: AdminRef;
  subDistrict?: AdminRef;
  village?: string;
  tags?: Record<string, any>;

  createdAt: string | Date;
  updatedAt: string | Date;

  avatar?: string;
  fuelTypes?: FuelTypes;
  prices?: FuelPrices;
  status?: FuelStatus;
  queueStatus?: QueueStatus;
  openingTime?: string;
  googleMapLink?: string;
  description?: string;
  adminNote?: string;

  likesCount: number;
  followersCount: number;
  lastUpdatedBy?: UserRef;
}

/** Nearby station response (matches backend `NearbyStationRes`) */
export interface NearbyStation {
  id: number;
  osmId: number;
  osmType: "node" | "way" | "relation";
  name: string | null;
  brand: string | null;
  lat: number;
  lng: number;
  tags: Record<string, string>;
  division: string | null;
  district: string | null;
  subDistrict: string | null;
  village: string | null;
  status?: FuelStatus;
}

export enum OsmType {
  Node = "node",
  Way = "way",
  Relation = "relation",
}

export interface UpdateStation {
  // NOTE: backend update uses `osmRef` (string) not osmType; keep only supported fields here
  name?: string;
  brand?: string;
  lat?: number;
  lng?: number;
  tags?: Record<string, any>;
  divisionId?: number | null;
  districtId?: number | null;
  subDistrictId?: number | null;
  village?: string;
  avatar?: string;
  fuelTypes?: FuelTypes;
  prices?: FuelPrices;
  status?: FuelStatus;
  queueStatus?: QueueStatus;
  openingTime?: string;
  googleMapLink?: string;
  description?: string;
  adminNote?: string;
  lastUpdatedById?: number;
}

export interface NearbyStationsResponse {
  source: "database" | "openstreetmap" | "database+openstreetmap";
  attribution: string;
  count: number;
  stations: NearbyStation[];
  persisted?: boolean;
}

export type StationCommentUser = {
  id: number;
  firstName: string;
  lastName?: string;
  /** Display name (e.g. first + last) */
  name: string;
  avatar?: string;
};

export type StationComment = {
  id: number;
  parentId?: number;
  text: string;
  createdAt: string | Date;
  userId: number;
  /** Included by API for thread UI (name + avatar) */
  user: StationCommentUser;
  stationId: number;
};
