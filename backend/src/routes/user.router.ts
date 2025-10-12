import { Router } from "express";

import { userController } from "../controllers/user.controler";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get(
  "/",
  authMiddleware.checkAccessToken,
  commonMiddleware.isQueryValid(UserValidator.listQuery),
  userController.getAllUsers,
);

router.get("/statistic", userController.getAllUsersStatistic);

router.put(
  "/:id",
  // authMiddleware.checkAccessToken,
  userController.updateUserById,
);

export const userRouter = router;
