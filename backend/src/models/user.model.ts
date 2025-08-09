import { model, Schema } from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true },
  course_format: { type: String, required: true },
  course_type: { type: String, required: true },
  sum: { type: Number, default: null },
  already_paid: { type: Boolean, default: null },
  group: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  manager: { enum: RoleEnum, type: String, default: null },
  utm: { type: String },
  msg: { type: String, default: null },
  status: { type: String, default: null },
  role: {
    enum: RoleEnum,
    type: String,
    required: true,
    default: RoleEnum.ADMIN,
  },
});

export const User = model<IUser>("users", userSchema);
