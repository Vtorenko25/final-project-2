import { RoleEnum } from "../enums/role.enum";

export type ILogin = {
  email: string;
  password: string;
  userId: string;
  role: RoleEnum;
};

export type ILoginManager = {
  email: string;
  password: string;
  userId: string;
  role?: RoleEnum;
};
