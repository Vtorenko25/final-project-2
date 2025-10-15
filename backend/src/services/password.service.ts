import * as bcrypt from "bcrypt";

import { ApiError } from "../errors/api.error";
import { IManager } from "../interfaces/manager.interface";
import { managerRepository } from "../repositories/manager.repository";
import { passwordRepository } from "../repositories/password.reposytory";

class PasswordService {
  public async createPassword(dto: IManager): Promise<IManager> {
    const manager = await managerRepository.findById(dto.manager_id);
    if (!manager) {
      throw new Error("No manager found.");
    }

    const hashedPassword = await passwordService.hashPassword(dto.password);

    return await passwordRepository.updatePassword(
      manager.manager_id,
      hashedPassword,
    );
  }
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
  public async updatePassword(manager_id: number, newPassword: string) {
    const manager = await managerRepository.findById(manager_id);
    if (!manager) {
      throw new ApiError("Manager not found", 404);
    }

    if (!manager.is_active) {
      throw new ApiError("This account is banned", 403);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedManager = await passwordRepository.updatePassword(
      manager_id,
      hashedPassword,
    );

    return updatedManager;
  }
}

export const passwordService = new PasswordService();
