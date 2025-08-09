import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";

class AuthControler {
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body;
      const result = await authService.signIn(dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthControler();
