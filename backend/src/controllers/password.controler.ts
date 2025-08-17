// import { NextFunction, Request, Response } from "express";
//
// import { passwordService } from "../services/password.service";
//
// class PasswordController {
//   public async getPassword(req: Request, res: Response, next: NextFunction) {
//     try {
//       const password = await passwordService.getPassword();
//       res.json(password);
//     } catch (e) {
//       next(e);
//     }
//   }
// }
// export const userController = new PasswordController();
