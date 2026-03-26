//W---------={ Interface }=----------</br>

export interface IUser {
  id: number;
  name: string;
  phone: string;
  address: string;
  description?: string;
  status: "active" | "suspend" | "inActive";
  createdAt?: Date;
  createdBy: {
    id: number;
    name: string;
  };
  updatedAt?: Date;
  updatedBy?: {
    id: number;
    name: string;
  };
}

export interface IAddUser {
  name: string;
  phone: string;
  address: string;
  description?: string;
  status: "active" | "suspend" | "inActive";
}
