import { Types } from "mongoose";

export interface IManager {
  id: string;
  email: string;
  name: string;
  surname: string;
  is_active: boolean;
  last_login?: string;
  manager_id: number;
  password?: string;
}

export interface IManagerListQuery {
  limit?: number;
  page?: number;
  search?: string;
}

export interface IManagerListResponse {
  data: IManagerResponse[];
  total: number;
}

export type IManagerResponse = Pick<
  IManager,
  "name" | "surname" | "email" | "is_active" | "last_login" | "manager_id"
>;

export interface IManagerPassword {
  _id: Types.ObjectId;
  manager: {
    email: string;
    password: string;
    role?: string;
  };
}
