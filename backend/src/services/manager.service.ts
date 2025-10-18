import {
  IManager,
  IManagerListQuery,
  IManagerListResponse,
} from "../interfaces/manager.interface";
import { managerPresenter } from "../presenters/manager.presenter";
import { managerRepository } from "../repositories/manager.repository";

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

  public async getManagerByEmail(email: string) {
    return await managerRepository.findByEmail(email);
  }

  public async banManager(id: string | number): Promise<IManager> {
    return await managerRepository.updateStatus(Number(id), false);
  }

  public async unbanManager(id: string | number): Promise<IManager> {
    return await managerRepository.updateStatus(Number(id), true);
  }
  public async updateLastLogin(manager_id: number): Promise<IManager> {
    return await managerRepository.updateLastLogin(manager_id);
  }
}

export const managerService = new ManagerService();
