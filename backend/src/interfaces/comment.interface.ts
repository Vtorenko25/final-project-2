import { ObjectId } from "mongoose";

export interface IComment {
  _userId: string | ObjectId;
  crmId: string;
  title: string;
  content: string;
  manager: string;
  id: string | ObjectId;
  createdAt: Date;
  isDeleted: boolean;
}
