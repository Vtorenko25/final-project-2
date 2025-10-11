import { Router } from "express";

import { managerController } from "../controllers/manager.controler";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", managerController.create);

router.get("/", managerController.getManager, authMiddleware.checkAccessToken);

export const managerRouter = router;
