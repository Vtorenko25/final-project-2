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
}

export const managerService = new ManagerService();
