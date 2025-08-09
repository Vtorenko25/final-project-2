import { OrderEnum } from "../enums/order.enum";
import { RoleEnum } from "../enums/role.enum";
import { UserListOrderEnum } from "../enums/user-list-order.enum";

export interface IUser {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  role: RoleEnum;
  course: string;
  course_format: string;
  course_type: string;
  sum?: number;
  already_paid?: number;
  created_at: string;
  utm: string;
  msg?: string;
  status?: string;
}

export interface IUserListQuery {
  limit: number;
  page: number;
  search: string;
  order: OrderEnum;
  orderBy: UserListOrderEnum;
}

export type IUserResponse = Pick<
  IUser,
  | "_id"
  | "name"
  | "surname"
  | "email"
  | "phone"
  | "age"
  | "role"
  | "course"
  | "course_format"
  | "course_type"
  | "sum"
  | "already_paid"
  | "created_at"
  | "utm"
  | "msg"
  | "status"
>;

export interface IUserListResponse {
  data: IUserResponse[];
  total: number;
}
