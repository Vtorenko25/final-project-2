import { RoleEnum } from "../enums/role.enum";

export interface IToken {
  _id: string;
  accessToken: string;
  refreshToken: string;
  _userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokenPayload {
  userId: string;
  role: RoleEnum;
  email: string;
}

export type ITokenPair = Pick<IToken, "accessToken" | "refreshToken">;

export type ITokenPairManager = Pick<
  ITokenManager,
  "accessToken" | "refreshToken"
>;

export interface ITokenManager {
  _id: string;
  manager_id: number;
  accessToken: string;
  refreshToken: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokenPayloadManager {
  _id: string;
  email: string;
  manager_id: number;
}
