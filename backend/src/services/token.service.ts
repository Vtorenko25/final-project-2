import jwt, { Secret, SignOptions } from "jsonwebtoken";

import { config } from "../configs/config";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";

class TokenService {
  public genereteTokens(payload: ITokenPayload): ITokenPair {
    const accessToken = jwt.sign(payload, config.jwtAccessSecret as Secret, {
      expiresIn: config.jwtAccessExpiresIn as SignOptions["expiresIn"],
    });
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret as Secret, {
      expiresIn: config.jwtRefreshExpiresIn as SignOptions["expiresIn"],
    });
    return { accessToken, refreshToken };
  }
  public verifyToken(token: string, type: "access" | "refresh"): ITokenPayload {
    try {
      let secret: string;
      switch (type) {
        case "access":
          secret = config.jwtAccessSecret;
          break;
        case "refresh":
          secret = config.jwtRefreshSecret;
          break;
        default:
          throw new ApiError("Invalid token type", 401);
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (error) {
      throw new ApiError("Invalid token", 401);
    }
  }
}

export const tokenService = new TokenService();
