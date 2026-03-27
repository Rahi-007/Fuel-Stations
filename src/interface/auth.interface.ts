import { IUser } from "./user.interface";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
