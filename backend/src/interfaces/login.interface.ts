import { RoleEnum } from "../enums/role.enum";

export type ILogin = {
  email: string;
  password: string;
  userId: string;
  role: RoleEnum;
};
