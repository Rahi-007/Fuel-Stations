// Matches backend DivisionRes (Fuel Station Backend/src/location/dto/division.dto.ts)

export interface IDivision {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  /** Present on GET /divisions/:id */
  districts?: IDivisionDistrictSummary[];
}

export interface IDivisionDistrictSummary {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddDivision {
  name: string;
  description?: string;
  isActive?: boolean;
}
