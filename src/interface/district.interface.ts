// Matches backend DistrictRes (Fuel Station Backend/src/location/dto/district.dto.ts)

import type { IDivision } from "./division.interface";

export interface IDistrict {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  division?: Pick<IDivision, "id" | "name" | "isActive"> & {
    description?: string;
  };
  /** Present on GET /districts/:id */
  subDistricts?: IDistrictSubSummary[];
}

export interface IDistrictSubSummary {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddDistrict {
  name: string;
  description?: string;
  divisionId: number;
  isActive?: boolean;
}
