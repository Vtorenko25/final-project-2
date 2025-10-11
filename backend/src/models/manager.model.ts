import { model, Schema } from "mongoose";

import { IManager } from "../interfaces/manager.interface";

const managerSchema = new Schema<IManager>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Некоректний email"],
    },
    is_active: { type: Boolean, default: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    last_login: { type: String, required: false, default: null },
  },
  { timestamps: true, versionKey: false },
);

export const Managers = model<IManager>("Manager", managerSchema);
