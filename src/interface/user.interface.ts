//W---------={ Interface }=----------</br>

// Matches backend UserRes (Fuel Station Backend/src/auth/dto/user.dto.ts)
export interface IUser {
  id: number;
  firstName: string;
  lastName?: string;
  phone?: string;
  email: string;
  address?: string;
  avatar?: string;
  dob?: Date;
  lastLoggedIn?: Date;
  gender?: string;
  bloodGroup?: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  trustScore?: number;
  totalReports?: number;
  correctReports?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddUser {
  firstName: string;
  lastName?: string;
  phone?: string;
  email: string;
  password: string;
  address?: string;
}
