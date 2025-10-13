import bcrypt from "bcrypt";

import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api.error";
import { ILogin, ILoginManager } from "../interfaces/login.interface";
import { ITokenPair } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { adminService } from "./admin.service";
import { managerService } from "./manager.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signIn(
    dto: ILogin,
  ): Promise<{ tokens: ITokenPair; email: string }> {
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

  public async signInManager(
    dto: ILoginManager,
  ): Promise<{ tokens: ITokenPair; email: string }> {
    const { email, password } = dto;

    const managerDoc = await managerService.getManagerByEmail(email);

    if (!managerDoc) {
      throw new ApiError("Невірний email або пароль", 401);
    }
    const manager = managerDoc;
    if (!(await bcrypt.compare(password, manager.password))) {
      throw new ApiError("Невірний email або пароль", 401);
    }

    const tokenPayload = {
      email: manager.email,
      userId: managerDoc._id.toString(),
      role: RoleEnum.MANAGER,
    };

    const generatedTokens = await tokenService.genereteTokens(tokenPayload);
    await tokenRepository.create({
      ...generatedTokens,
      email: manager.email,
      role: RoleEnum,
    });

    return { tokens: generatedTokens, email: manager.email };
  }
}

export const authService = new AuthService();
