import { Router } from "express";

import { authController } from "../controllers/auth.controler";
import { authManagerMiddleware } from "../middlewares/manager.middleware";

const router = Router();

router.post("/sign-in", authController.signIn);

router.post(
  "/sign-in/manager",
  authController.signInManager,
  authManagerMiddleware.checkManagerAccessToken,
);

export const authRouter = router;
