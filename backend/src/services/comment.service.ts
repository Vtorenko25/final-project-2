import { IComment } from "../interfaces/comment.interface";
import { commentRepository } from "../repositories/comment.repository";

class CommentService {
  public async getComment(): Promise<IComment[]> {
    return await commentRepository.getComment();
  }

  public async getCommentByCrmId(crmId: string): Promise<IComment[]> {
    return await commentRepository.getCommentByCrmId(crmId);
  }


  public async createComment(dto: IComment): Promise<IComment> {
    return await commentRepository.create(dto);
  }
}

export const commentService = new CommentService();
