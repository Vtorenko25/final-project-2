import { Router } from "express";

import { userController } from "../controllers/user.controler";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get(
  "/",
  commonMiddleware.isQueryValid(UserValidator.listQuery),
  userController.getAllUsers,
);

router.put(
  "/:id",
  authMiddleware.checkAccessToken,
  // commonMiddleware.validateBody(UserValidator.update),
  userController.updateUserById,
);

export const userRouter = router;
