import { Router } from "express";

import { managerController } from "../controllers/manager.controler";
import { commonMiddleware } from "../middlewares/common.middleware";
import { authManagerMiddleware } from "../middlewares/manager.middleware";
import { ManagerValidator } from "../validators/manager.validator";

const router = Router();

router.post("/create", managerController.create);

router.get(
  "/",
  commonMiddleware.isQueryValid(ManagerValidator.listQuery),
  managerController.getManager,
);

// @ts-ignore
router.post("/:id", managerController.generateActivationLink);

router.patch("/ban/:id", managerController.banManager);
router.patch("/unban/:id", managerController.unbanManager);

router.post(
  "/password/:id",
  authManagerMiddleware.checkManagerAccessToken,
  managerController.createPassword,
);

export const managerRouter = router;
