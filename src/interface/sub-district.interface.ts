// Matches backend SubDistrictRes (Fuel Station Backend/src/location/dto/subDistrict.dto.ts)

export interface ISubDistrict {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  district?: ISubDistrictDistrictSummary;
  division?: ISubDistrictDivisionSummary;
}

export interface ISubDistrictDivisionSummary {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubDistrictDistrictSummary {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  /** When API embeds parent division on district */
  division?: Pick<ISubDistrictDivisionSummary, "id" | "name">;
}

export interface IAddSubDistrict {
  name: string;
  description?: string;
  districtId: number;
  isActive?: boolean;
}
