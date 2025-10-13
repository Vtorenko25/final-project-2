import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { managerService } from "../services/manager.service";
import { tokenService } from "../services/token.service";

class AuthManagerMiddleware {
  public async checkManagerAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("No token provided", 401);
      }

      const accessToken = header.replace(/Bearer\s+/i, "").trim();
      if (!accessToken) {
        throw new ApiError("No token provided", 401);
      }

      const tokenPayload = tokenService.verifyTokenManager(
        accessToken,
        "access",
      );
      console.log(tokenPayload);
      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        throw new ApiError("Invalid token", 401);
      }

      const manager = await managerService.getManagerById(
        tokenPayload.manager_id,
      );
      if (!manager) {
        throw new ApiError("Manager not found", 404);
      }
      if (!manager.is_active) {
        throw new ApiError("Your account is banned", 403);
      }
      req.res.locals.tokenPayload = tokenPayload;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authManagerMiddleware = new AuthManagerMiddleware();
