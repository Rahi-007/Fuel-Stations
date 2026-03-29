export interface IStation {
  id: number;
  osmId: number;
  osmType: "node" | "way" | "relation";
  name: string | null;
  brand: string | null;
  lat: number;
  lng: number;
  tags: Record<string, string>;
  division: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  subDistrict: {
    id: number;
    name: string;
  };
  village: string | null;
}

export enum OsmType {
  Node = "node",
  Way = "way",
  Relation = "relation",
}

export interface UpdateStation {
  osmType?: OsmType;
  name?: string;
  brand?: string;
  lat?: number;
  lng?: number;
  tags?: number; // Record<string, string>;
  divisionId?: number;
  districtId?: number;
  subDistrictId?: number;
  village?: string;
}

export interface NearbyStationsResponse {
  source: string;
  attribution: string;
  count: number;
  stations: IStation[];
  persisted?: boolean;
}
