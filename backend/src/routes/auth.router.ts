import { Router } from "express";

import { authController } from "../controllers/auth.controler";

const router = Router();

router.post("/sign-in", authController.signIn);

router.post("/sing-in/manager", authController.signInManager);

export const authRouter = router;
