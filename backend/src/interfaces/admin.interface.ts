import { Types } from "mongoose";

export interface IAdmin {
  _id: Types.ObjectId;
  admin: {
    email: string;
    password: string;
    role?: string;
  };
}
