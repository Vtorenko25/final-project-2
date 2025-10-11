// import { NextFunction, Request, Response } from "express";
//
// import { ITokenPayload } from "../interfaces/token.interface";
// import { IUserListQuery, IUserUpdateDto } from "../interfaces/user.interface";
// import { userService } from "../services/user.service";
//
// class UserController {
//   public async getAllUsers(req: Request, res: Response, next: NextFunction) {
//     try {
//       const query = req.query as unknown as IUserListQuery;
//       const result = await userService.getAllUsers(query);
//       res.json(result);
//     } catch (e) {
//       next(e);
//     }
//   }
//
//   public async updateUserById(req: Request, res: Response, next: NextFunction) {
//     try {
//       const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
//       const userId = req.params.id;
//       const dto = req.body as IUserUpdateDto;
//
//       const result = await userService.updateUserById(
//         tokenPayload,
//         userId,
//         dto,
//       );
//       res.status(200).json(result);
//     } catch (e) {
//       next(e);
//     }
//   }
// }
// export const userController = new UserController();

import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../interfaces/token.interface";
import { IUserListQuery, IUserUpdateDto } from "../interfaces/user.interface";
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

  public async getAllUsersStatistic(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const stats = await userService.getAllUsersStatistic();
      res.json(stats);
    } catch (e) {
      next(e);
    }
  }

  public async updateUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const userId = req.params.id;
      const dto = req.body as IUserUpdateDto;

      const result = await userService.updateUserById(
        tokenPayload,
        userId,
        dto,
      );
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
