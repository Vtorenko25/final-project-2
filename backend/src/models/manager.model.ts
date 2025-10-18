import { model, Schema } from "mongoose";

import { IManager } from "../interfaces/manager.interface";
import { Counter } from "./counter.model";

const managerSchema = new Schema<IManager>(
  {
    manager_id: { type: Number, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Некоректний email"],
    },
    is_active: { type: Boolean, default: false },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    last_login: { type: String, required: false, default: null },
    password: { type: String, required: false, default: null },
  },
  { timestamps: true, versionKey: false },
);

managerSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "managerId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.manager_id = counter.seq;
  }
  next();
});

export const Managers = model<IManager>("Manager", managerSchema);
