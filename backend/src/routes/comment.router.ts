import { Router } from "express";

import { commentController } from "../controllers/comment.controler";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", commentController.getComment);

router.get("/:crmId", commentController.getCommentById);

router.post(
  "/create",
  authMiddleware.checkAccessToken,
  commentController.create,
);

export const commentRouter = router;
