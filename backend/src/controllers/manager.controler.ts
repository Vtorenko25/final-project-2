import { NextFunction, Request, Response } from "express";

import { IManagerListQuery } from "../interfaces/manager.interface";
import { managerService } from "../services/manager.service";

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
}

export const managerController = new ManagerController();
