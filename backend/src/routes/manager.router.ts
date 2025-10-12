import { Router } from "express";

import { managerController } from "../controllers/manager.controler";
import { commonMiddleware } from "../middlewares/common.middleware";
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

export const managerRouter = router;
