import { IUser } from "../models";

export interface ILoginResponse {
  status: string;
  access_token: string;
}

export interface IGetMeResponse {
  status: string;
  data: {
    data: IUser;
  };
}
