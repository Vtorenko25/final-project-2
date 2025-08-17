import { model, Schema } from "mongoose";

import { IAdmin } from "../interfaces/admin.interface";

const AdminSchema = new Schema<IAdmin>({
  admin: {
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
});

export const AdminModel = model<IAdmin>("Admin", AdminSchema, "password");
