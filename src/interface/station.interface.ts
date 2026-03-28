export interface OsmFuelStation {
  /** Internal DB id after backend upsert */
  id: number;
  osmId: number;
  osmType: "node" | "way" | "relation";
  name: string | null;
  brand: string | null;
  lat: number;
  lng: number;
  tags: Record<string, string>;
  /** From OSM addr:* tags when present / linked admin row name */
  division: string | null;
  district: string | null;
  /** Sub-district (e.g. upazila) */
  subDistrict: string | null;
  village: string | null;
}

export interface NearbyStationsResponse {
  source: string;
  attribution: string;
  count: number;
  stations: OsmFuelStation[];
  persisted?: boolean;
}

export interface ListStationsResponse {
  count: number;
  stations: OsmFuelStation[];
}
