import { model, Schema } from "mongoose";

import { IToken } from "../interfaces/token.interface";

const tokenSchema = new Schema(
  {
    accessToken: { type: String, requires: true },
    refreshToken: { type: String, requires: true },
    email: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const Token = model<IToken>("token", tokenSchema);
