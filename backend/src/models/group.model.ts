import { model, Schema } from "mongoose";

import { IGroup } from "../interfaces/group.interface";

const groupSchema = new Schema<IGroup>({
  name: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

export const Group = model<IGroup>("groups", groupSchema);
