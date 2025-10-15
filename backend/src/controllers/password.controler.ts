import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { managerService } from "../services/manager.service";
import { passwordService } from "../services/password.service";

class PasswordController {
  public async createPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body;
      const mewPassword = await passwordService.createPassword(dto);
      res.status(201).json(mewPassword);
    } catch (e) {
      next(e);
    }
  }

  public async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { manager_id, password } = req.body;
      const manager = await managerService.getManagerById(manager_id);
      if (!manager) {
        throw new ApiError("Manager not found", 404);
      }

      if (!manager.is_active) {
        throw new ApiError("This account is banned", 403);
      }

      const updatedManager = await passwordService.updatePassword(
        manager_id,
        password,
      );

      res.status(200).json({
        message: "Password updated successfully",
        manager: updatedManager,
      });
    } catch (e) {
      next(e);
    }
  }
}
export const passwordController = new PasswordController();
