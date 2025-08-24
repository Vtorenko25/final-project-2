import { NextFunction, Request, Response } from "express";

import { commentService } from "../services/comment.service";

class CommentController {
  public async getComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.getComment();
      res.status(200).json(comment);
    } catch (e) {
      next(e);
    }
  }

  public async getCommentById(req: Request, res: Response, next: NextFunction) {
    try {
      const crmId = req.params.crmId; // переконатися, що роут має :crmId
      const result = await commentService.getCommentByCrmId(crmId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }


  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.tokenPayload?.userId;
      if (!userId) {
        throw new Error("User ID is missing from token");
      }
      const dto = req.body as any;
      const result = await commentService.createComment({
        ...dto,
        _userId: userId,
      });
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const commentController = new CommentController();
