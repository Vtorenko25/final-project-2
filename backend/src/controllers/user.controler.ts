import { NextFunction, Request, Response } from "express";

import { IUserListQuery } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as IUserListQuery;
      const result = await userService.getAllUsers(query);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}
export const userController = new UserController();
