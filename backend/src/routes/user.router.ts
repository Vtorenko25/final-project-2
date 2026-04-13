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

router.put("/:id", userController.updateUserById);

router.get("/groups", userController.getAllGroups);

router.post("/group", userController.addGroupToUser);

router.post("/group/assign", userController.assignGroupToUser);

export const userRouter = router;
