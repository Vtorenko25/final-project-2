import { model, Schema } from "mongoose";

import { IComment } from "../interfaces/comment.interface";

const commentSchema = new Schema<IComment>(
  {
    crmId: { type: String, required: true },
    title: { type: String, required: false },
    content: { type: String, required: true },
    manager: { type: String, required: true },
    _userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const Comments = model<IComment>("Comment", commentSchema);
