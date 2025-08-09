import { Router } from "express";

import { userController } from "../controllers/user.controler";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

// import { userController } from "../controllers/user.controler";
// // import { authMiddleware } from "../middlewares/auth.middleware";
// import { commonMiddleware } from "../middlewares/common.middleware";
// import { UserValidator } from "../validators/user.validator";

const router = Router();

// router.get(
//   "/",
//   commonMiddleware.validateQuery(UserValidator.getListQuery),
//   // authMiddleware.checkAccessToken,
//   userController.getAllUsers,
// );
router.get(
  "/",
  commonMiddleware.isQueryValid(UserValidator.listQuery),
  userController.getAllUsers,
);

export const userRouter = router;
