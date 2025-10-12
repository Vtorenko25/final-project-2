import { NextFunction, Request, Response } from "express";

import { IManagerListQuery } from "../interfaces/manager.interface";
import { tokenRepository } from "../repositories/token.repository";
import { managerService } from "../services/manager.service";
import { tokenService } from "../services/token.service";

class ManagerController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body;
      const newManager = await managerService.createManager(dto);
      res.status(201).json(newManager);
    } catch (e) {
      next(e);
    }
  }

  public async getManager(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as IManagerListQuery;
      const manager = await managerService.getManager(query);
      res.status(200).json(manager);
    } catch (e) {
      next(e);
    }
  }

  public async generateActivationLink(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const manager_id = Number(req.params.id);
      if (isNaN(manager_id)) {
        return res
          .status(400)
          .json({ status: 400, message: "Invalid manager id" });
      }

      const manager = await managerService.getManagerById(Number(manager_id));
      if (!manager) {
        return res.status(404).json({ message: "Manager not found" });
      }

      const tokenPayload = {
        _id: manager.manager_id.toString(),
        manager_id: manager.manager_id,
        email: manager.email.toString(),
      };

      const generatedTokens =
        await tokenService.generateTokensManager(tokenPayload);

      await tokenRepository.create({
        ...generatedTokens,
        email: manager.email,
        userId: manager.manager_id,
        manager_id: manager.manager_id,
      });

      res.status(200).json({
        message: "Activation link generated successfully",
        AccessToken: `${generatedTokens.accessToken}`,
        expiresIn: "30m",
      });
    } catch (e) {
      next(e);
    }
  }

  public async createPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body;
      const mewPassword = await managerService.createPassword(dto);
      res.status(201).json(mewPassword);
    } catch (e) {
      next(e);
    }
  }
}

export const managerController = new ManagerController();
