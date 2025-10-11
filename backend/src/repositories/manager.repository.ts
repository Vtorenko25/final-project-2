import { IManager } from "../interfaces/manager.interface";
import { Managers } from "../models/manager.model";

class ManagerRepository {
  public async create(dto: IManager): Promise<IManager> {
    return await Managers.create(dto);
  }
  public async getManager(): Promise<IManager[]> {
    try {
      const manager = await Managers.find();
      return manager;
    } catch {
      throw new Error("Failed to retrieve managers");
    }
  }
}

export const managerRepository = new ManagerRepository();
