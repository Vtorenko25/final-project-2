import { Router } from "express";

import { authController } from "../controllers/auth.controler";

const router = Router();

router.post("/sign-in", authController.signIn);

export const authRouter = router;
