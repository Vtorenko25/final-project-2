// import { RoleEnum } from "../enums/role.enum";
// import { ApiError } from "../errors/api.error";
// import { ILogin } from "../interfaces/login.interface";
// import { ITokenPair } from "../interfaces/token.interface";
// import { tokenRepository } from "../repositories/token.repository";
// import { adminService } from "./admin.service";
// import { tokenService } from "./token.service";
//
// class AuthService {
//   public async signIn(dto: ILogin): Promise<ITokenPair> {
//     const { email, password } = dto;
//
//     const adminDoc = await adminService.getAdminByEmail(email);
//     if (!adminDoc) {
//       throw new ApiError("Невірний email або пароль", 401);
//     }
//
//     const admin = adminDoc.admin;
//
//     if (admin.password !== password) {
//       throw new ApiError("Невірний email або пароль", 401);
//     }
//
//     const tokenPayload = {
//       email: admin.email,
//       role: admin.role as RoleEnum,
//       userId: adminDoc._id.toString(),
//     };
//
//     const tokens = await tokenService.genereteTokens(tokenPayload);
//     await tokenRepository.create({ ...tokens, email: admin.email });
//
//     return tokens;
//   }
// }
//
// export const authService = new AuthService();

import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api.error";
import { ILogin } from "../interfaces/login.interface";
import { ITokenPair } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { adminService } from "./admin.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signIn(dto: ILogin): Promise<{ tokens: ITokenPair; email: string }> {
    const { email, password } = dto;

    const adminDoc = await adminService.getAdminByEmail(email);
    if (!adminDoc) {
      throw new ApiError("Невірний email або пароль", 401);
    }

    const admin = adminDoc.admin;

    if (admin.password !== password) {
      throw new ApiError("Невірний email або пароль", 401);
    }

    const tokenPayload = {
      email: admin.email,
      role: admin.role as RoleEnum,
      userId: adminDoc._id.toString(),
    };

    const generatedTokens = await tokenService.genereteTokens(tokenPayload);
    await tokenRepository.create({ ...generatedTokens, email: admin.email });

    return { tokens: generatedTokens, email: admin.email };
  }
}

export const authService = new AuthService();