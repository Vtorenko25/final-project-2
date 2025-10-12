import {
  IManager,
  IManagerListQuery,
  IManagerListResponse,
} from "../interfaces/manager.interface";
import { managerPresenter } from "../presenters/manager.presenter";
import { managerRepository } from "../repositories/manager.repository";
import { passwordService } from "./password.service";

class ManagerService {
  public async createManager(dto: IManager): Promise<IManager> {
    return await managerRepository.create(dto);
  }

  public async getManager(
    query: IManagerListQuery,
  ): Promise<IManagerListResponse> {
    const [entities, total] = await managerRepository.getManager(query);
    return managerPresenter.toListResDto(entities, total, query);
  }

  public async getManagerById(manager_id: number): Promise<IManager | null> {
    return await managerRepository.findById(manager_id);
  }

  public async createPassword(dto: IManager): Promise<IManager> {
    const manager = await managerRepository.findById(dto.manager_id);
    if (!manager) {
      throw new Error("No manager found.");
    }

    const hashedPassword = await passwordService.hashPassword(dto.password);

    // 🔹 Оновлюємо існуючого менеджера
    return await managerRepository.updatePassword(
      manager.manager_id,
      hashedPassword,
    );
  }
}

export const managerService = new ManagerService();
