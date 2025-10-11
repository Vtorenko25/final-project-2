import { IManager } from "../interfaces/manager.interface";
import { managerRepository } from "../repositories/manager.repository";

class ManagerService {
  public async createManager(dto: IManager): Promise<IManager> {
    return await managerRepository.create(dto);
  }
  public async getManager(): Promise<IManager[]> {
    return await managerRepository.getManager();
  }
}

export const managerService = new ManagerService();

