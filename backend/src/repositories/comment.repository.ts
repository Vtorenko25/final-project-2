import { IComment } from "../interfaces/comment.interface";
import { Comments } from "../models/comment.model";

class CommentRepository {
  public async getComment(): Promise<IComment[]> {
    try {
      const comments = await Comments.find({
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      });
      return comments;
    } catch {
      throw new Error("Failed to retrieve comments");
    }
  }

  public async getCommentByCrmId(crmId: string): Promise<IComment[]> {
    try {
      const comments = await Comments.find({ crmId, isDeleted: false });
      return comments;
    } catch {
      throw new Error("Failed to retrieve comments by crmId");
    }
  }


  public async create(dto: IComment): Promise<IComment> {
    return await Comments.create(dto);
  }
}

export const commentRepository = new CommentRepository();
